/*Variable area*/

var initHandler = require('./initiative-handler');
var rollHandler = require('./roll-handler');
var destinyHandler = require('./destiny-handler');

const HomeServer = process.env.home_server;

var Discord = require('discord.io');
var bot = new Discord.Client({
    token: process.env.token,
    autorun: true
});

var serverDice = {};
var serverSymbols = {};

var serverSetup = {};

/*Event area*/

bot.on("ready", function(event) {
    console.log("Connected!");
    console.log("Logged in as: ");
    console.log(bot.username + " - (" + bot.id + ")");
    setTimeout(console.log, 9000, bot.inviteURL);
    bot.setPresence( {game:"!Roll Help"} );
});

bot.on("message", function(user, userID, channelID, message, event) {
    if (user === bot.username){
        return;
    }    
    
    var serverID = bot.channels[channelID].guild_id;
    var emojiServerID = serverID;

    if (hasPermission(0x00040000, serverID)) {
        emojiServerID = HomeServer;
    }

    if(!(emojiServerID in serverDice)) {
        setupServer(emojiServerID);
    }

    initHandler.handleMessage(message, channelID, serverDice[serverID], serverSymbols[serverID], emojiServerID, sendMessages, printSymbols);
    rollHandler.handleMessage(message, channelID, serverDice[serverID], serverSymbols[serverID], emojiServerID, sendMessages, printSymbols);
    destinyHandler.handleMessage(message, channelID, serverDice[serverID], serverSymbols[serverID], emojiServerID, sendMessages, printSymbols);
});

bot.on("disconnect", function(err, code) {
    try {
        console.log("Bot disconnected: " + err + " " + code);
        bot.connect(); //Auto reconnect
    } catch (err){
        console.log(err);
    }
    
});

/*Function declaration area*/
function printSymbols(symbols, serverID) {
    var result = "";
    symbols.forEach(function(symbol){
        result += serverSymbols[serverID][symbol.toLowerCase()].code;
    });
    return result;
}

function hasPermission(permission, serverID) {
    var roleID = bot.servers[serverID].members[bot.id].roles[0];
    var role = bot.servers[serverID].roles[roleID];
    if (!role) {
        return false;
    }
    return ((role._permissions & permission) == permission);
}

function sendMessages(ID, messageArr, interval) {
    var resArr = [], len = messageArr.length;
    var callback = typeof(arguments[2]) === 'function' ?  arguments[2] :  arguments[3];
    if (typeof(interval) !== 'number') interval = 100;

    function _sendMessages() {
        setTimeout(function() {
            if (messageArr[0]) {
                var message = messageArr.shift();
                bot.sendMessage({
                    to: ID,
                    message: message
                }, function(err, res) {
                    resArr.push(err || res);
                    if (err != null && err.statusCode == 429) {
                        sendMessages(ID, [message], err.response.retry_after);
                    }
                    if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
                });
                _sendMessages();
            }
        }, interval);
    }
    _sendMessages();
}

function setupServer(serverID) {
    var server = bot.servers[serverID];
    var newConfig = JSON.parse(JSON.stringify(require('./dice.js')));
    var diceEM = {
        "a":newConfig.ability,
        "d":newConfig.difficulty,
        "s":newConfig.setback,
        "b":newConfig.boost,
        "p":newConfig.proficiency,
        "c":newConfig.challenge,
        "f":newConfig.force
    }
    var symbols = newConfig.symbols;
    var serverEmojis = server.emojis;
    //    console.log(serverEmojis);
    Object.keys(diceEM).forEach(function(dieKey) {
        diceEM[dieKey].forEach(function(side){
            var emoji = Object.keys(serverEmojis).find(function(it){
                return (serverEmojis[it].name === side.face);
            });
            emoji = serverEmojis[emoji];
            if (emoji) {
                side.code = "<:"+emoji.name+":"+emoji.id+">";
            }
        });
    });
    Object.keys(symbols).forEach(function(symbol) {
        var emoji = Object.keys(serverEmojis).find(function(it){
            return (serverEmojis[it].name === symbols[symbol].name);
        });
        emoji = serverEmojis[emoji];
        if (emoji) {
            symbols[symbol].code = "<:"+emoji.name+":"+emoji.id+">";
        }
    });

    serverDice[serverID] = diceEM;
    serverSymbols[serverID] = symbols;
    serverSetup[serverID] = true;
}
