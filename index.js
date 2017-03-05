/*Variable area*/

var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic('public', {'index': ['index.html', 'index.htm']})

http.createServer(function (req, res) { 
    res.writeHead(200, {'Content-Type': 'text/plain'});
    serve(req, res, finalhandler(req, res));
    res.end('Hello! Was I asleep? Sorry, Heroku is very particular about sleeping apps.\n'); 
}).listen(process.env.PORT || 5000);

var Discord = require('discord.io');
var bot = new Discord.Client({
    token: process.env.token,
    autorun: true
});

var success = "Success", failure = "Failure", advantage = "Advantage", threat = "Threat", triumph = "Triumph", despair = "Despair", blank = "Blank", light = "Light", dark = "Dark";

// var diceEM = {
// 	"a":dice.ability,
// 	"d":dice.difficulty,
// 	"s":dice.setback,
// 	"b":dice.boost,
// 	"p":dice.proficiency,
// 	"c":dice.challenge,
// 	"f":dice.force
// }

var serverDice = {};
var serverSymbols = {};

var channelDestiny = {};

// var symbols = dice.symbols;

function resultIs(result) {
    return function(target) {
        return result == target;
    }
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

var diceMatch = /!Roll\[([adpcfbs]*)\]/;
var diceHelpMatch = /^!Roll Help/;
var destinyMatch = /^!Destiny Flip ((Dark)|(Light))/;
var poolMatch = /^!Destiny Roll/;
var clearMatch = /^!Destiny Reset/;
var showMatch = /^!Destiny Show/;
var destinyHelpMatch = /^!Destiny Help/;

var pool = [];

var serverSetup = {};

/*Event area*/

bot.on("ready", function(event) {
    console.log("Connected!");
    console.log("Logged in as: ");
    console.log(bot.username + " - (" + bot.id + ")");
    setTimeout(console.log, 9000, bot.inviteURL);
});

bot.on("message", function(user, userID, channelID, message, event) {
//    console.log(process.env.maintenance);
    if (user === "SWRPG_Dice" || user === "SWRPG_Dice_Beta"){
        return;
    }
    if (process.env.maintenance === "true"){
        console.log("Ignoring message, in maintenance mode.");
        return;
    }
    console.log(user + " - " + userID);
//    console.log("in " + channelID);
    console.log(message);
    console.log("----------");
    console.log("Server ID" + bot.channels[channelID].guild_id); //Woot! Thanks Discord.io discord!
    var serverID = bot.channels[channelID].guild_id;
    if(!(serverID in serverDice)) {
        setupServer(serverID);
    }

    if (message === "ping") {
        sendMessages(channelID, [String.raw`\\:AbilBla:`]); //Sending a message with our helper function
    }
    
    if (message === "!ClearAll") {
        serverDice = {};
        serverSymbols = {};
        serverSetup = {};
        sendMessages(channelID, ["Clearing all saved emoji settings. I'll re-add them next time someone wants to roll."]);
    }

    if (message.match(poolMatch)) {
        if (!channelDestiny[channelID]){
            channelDestiny[channelID] = [];
        }
        var die = "f";
        var roll = Math.floor(Math.random() * serverDice[serverID][die].length);
        var result = serverDice[serverID][die][roll];
        channelDestiny[channelID] = channelDestiny[channelID].concat(result.results);
        var resultSymbols = "";
        
        var returnMessage =  "Adding " + printSymbols(result.results, serverID) + " to destiny pool";
        var poolMessage = "Current destiny pool: " + printSymbols(channelDestiny[channelID], serverID);
        sendMessages(channelID, [result.code, returnMessage, poolMessage]);
    }

    if (message.match(clearMatch)) {
        delete channelDestiny[channelID];
        sendMessages(channelID, ["Destiny Pool reset for this channel."]);
    }

    if (message.match(showMatch)) {	
        if (!channelDestiny[channelID]){
            sendMessages(channelID, ["No Destiny points have been rolled for this channel. Use `!Roll Destiny` to begin."]);
            return;
        }
        var poolMessage = "Current destiny pool: " + printSymbols(channelDestiny[channelID], serverID);
        sendMessages(channelID, [poolMessage]);
    }
    
    if (message.match(destinyHelpMatch)){
        var message = "```Available Commands:\n";
        message += "!Destiny Roll\n";
        message += "!Destiny Flip (Dark|Light)\n";
        message += "!Destiny Show\n";
        message += "!Destiny Reset\n```";
        sendMessages(channelID, [message]);
    }

    if (message.match(destinyMatch)) {
        if (!channelDestiny[channelID]){
            sendMessages(channelID, ["No Destiny points have been rolled for this channel. Use `!Destiny Roll` to begin, or `!Destiny Help` for more information."]);
            return;
        }
        
        var returnMessage = "";
        var pool = channelDestiny[channelID];
        
        var match = destinyMatch.exec(message);
        
        if (match[1] === "Dark") {
            if (pool.indexOf(dark) !== -1) {
                returnMessage += "Flipping a Dark Side point.";
                pool[pool.indexOf(dark)] = light;
            } else {
                returnMessage += "No Dark Side points to flip.";
            }
        } else if (match[1] === "Light" !== -1) {
            if (pool.indexOf(light) !== -1) {
                returnMessage += "Flipping a Light Side point.";
                pool[pool.indexOf(light)] = dark;
            } else {
               returnMessage += "No Light Side points to flip."; 
            }
        } else {
            returnMessage += "The Force is confused.";
        }

        var poolMessage = "Current destiny pool: " + printSymbols(pool, serverID);
        sendMessages(channelID, [returnMessage, poolMessage]);
    }
    
    if (message.match(diceHelpMatch)){
        var message = "```Dice Bot Help:\n";
        message += "Send commands in the form of: !Roll[Some Dice Characters]\n";
        message += "Where 'Some Dice Characters' are any of these:\n";
        message += "a = Ability (Green)\n";
        message += "d = Difficulty (Purple)\n";
        message += "s = Setback (Black)\n";
        message += "b = Boost (Blue)\n";
        message += "p = Proficiency (Yellow)\n";
        message += "c = Challenge (Challenge)\n";
        message += "f = Force (White)\n";
        message += "Example: !Roll[aadd]```";
        sendMessages(channelID, [message]);
    }

    if (message.match(diceMatch)) {
        console.log("Saw Dice Message");
        
        var match = diceMatch.exec(message);
        var diceToRoll = match[1].split('');

        var results = [];
        diceToRoll.forEach(function(die) {
            if (serverDice[serverID][die]) {
                var roll = Math.floor(Math.random() * serverDice[serverID][die].length);
                results = results.concat(serverDice[serverID][die][roll]);
            }
        });
        var returnMessage = "";

        var diceResults = [];
        results.forEach(function(result) {
            returnMessage += result.code + " ";	
            diceResults = diceResults.concat(result.results)
        });
        var triumphs = diceResults.filter(resultIs(triumph)).length;
        var despairs = diceResults.filter(resultIs(despair)).length
        var successes = diceResults.filter(resultIs(success)).length + triumphs;
        var failures = diceResults.filter(resultIs(failure)).length + despairs;
        var threats = diceResults.filter(resultIs(threat)).length;
        var advantages = diceResults.filter(resultIs(advantage)).length;
        var lightForce = diceResults.filter(resultIs(light)).length;
        var darkForce = diceResults.filter(resultIs(dark)).length;

        var successScale = successes - failures;
        var advantageScale = advantages - threats;

        var resultsMessage = "";
        if (successScale > 0) {
            for(var i=0; i < successScale; i++){
                resultsMessage += serverSymbols[serverID].success.code;
            }	
        } else if (successScale < 0) {
            for(var i=0; i < -successScale; i++){
                resultsMessage += serverSymbols[serverID].failure.code;
            }
        }

        if (advantageScale > 0) {
            for(var i=0; i < advantageScale; i++){
                resultsMessage += serverSymbols[serverID].advantage.code;
            }	
        } else if (advantageScale < 0) {
            for(var i=0; i < -advantageScale; i++){
                resultsMessage += serverSymbols[serverID].threat.code;
            }
        }

        for(var i=0; i < despairs; i++){
            resultsMessage += serverSymbols[serverID].despair.code;
        }
        for(var i=0; i < triumphs; i++){
            resultsMessage += serverSymbols[serverID].triumph.code;
        }
        for(var i=0; i < lightForce; i++){
            resultsMessage += serverSymbols[serverID].light.code;
        }
        for(var i=0; i < darkForce; i++){
            resultsMessage += serverSymbols[serverID].dark.code;
        }
        sendMessages(channelID, [returnMessage,resultsMessage]);
    }
});

bot.on("disconnect", function() {
    console.log("Bot disconnected");
    bot.connect() //Auto reconnect
});

/*Function declaration area*/
function printSymbols(symbols, serverID) {
    var result = "";
    symbols.forEach(function(symbol){
       result += serverSymbols[serverID][symbol.toLowerCase()].code
    });
    return result;
}

function sendMessages(ID, messageArr, interval) {
    var resArr = [], len = messageArr.length;
    var callback = typeof(arguments[2]) === 'function' ?  arguments[2] :  arguments[3];
    if (typeof(interval) !== 'number') interval = 1000;

    function _sendMessages() {
        setTimeout(function() {
            if (messageArr[0]) {
                bot.sendMessage({
                    to: ID,
                    message: messageArr.shift()
                }, function(err, res) {
                    resArr.push(err || res);
                    if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
                });
                _sendMessages();
            }
        }, interval);
    }
    _sendMessages();
}

function sendFiles(channelID, fileArr, interval) {
    var resArr = [], len = fileArr.length;
    var callback = typeof(arguments[2]) === 'function' ? arguments[2] : arguments[3];
    if (typeof(interval) !== 'number') interval = 1000;

    function _sendFiles() {
        setTimeout(function() {
            if (fileArr[0]) {
                bot.uploadFile({
                    to: channelID,
                    file: fileArr.shift()
                }, function(err, res) {
                    resArr.push(err || res);
                    if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
                });
                _sendFiles();
            }
        }, interval);
    }
    _sendFiles();
}
