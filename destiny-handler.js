var DiceRoller = require('./diceRoller.js');
const DestinyPool = require('./destinyPool.js');

var destinyMatch = /^!Destiny Flip ((Dark)|(Light))/i;
var destinyAddMatch = /^!Destiny Add ((Dark)|(Light))/i;
var destinySetMatch = /^![Dd]estiny Set \[([DL]*)\]/i;
var poolMatch = /^!Destiny Roll/i;
var clearMatch = /^!Destiny Reset/i;
var showMatch = /^!Destiny Show/i;
var destinyHelpMatch = /^!Destiny Help/i;

exports.handleMessage = function(message, channelID, serverDice, serverSymbols, emojiServerID, sendMessages, printSymbols) {
    if (message.match(poolMatch)) {
        let destinyPool = new DestinyPool(channelID, []);

        destinyPool.getPool().then(function(pool){
            let roller = new DiceRoller(serverDice);
            roller.roll('f');
            pool = pool.concat(roller.symbolResults);

            destinyPool.setPool(pool).then(function(result){
                var returnMessage =  "Adding " + printSymbols(roller.symbolResults, emojiServerID) + " to destiny pool";
                var poolMessage = "Current destiny pool: " + printSymbols(pool, emojiServerID);
                sendMessages(channelID, [roller.diceResults[0].code, returnMessage, poolMessage]);
            });            
        });
    }

    if (message.match(clearMatch)) {
        let destinyPool = new DestinyPool(channelID, []);
        destinyPool.setPool([]).then(function(result){
            sendMessages(channelID, ["Destiny Pool reset for this channel."]);
        });        
    }

    if (message.match(showMatch)) {	
        let destinyPool = new DestinyPool(channelID, []);
        destinyPool.getPool().then(function(pool){
            if (pool.length == 0){
                sendMessages(channelID, ["No Destiny points have been rolled for this channel. Use `!Destiny Roll` to begin."]);
                return;
            } else {
                var poolMessage = "Current destiny pool: " + printSymbols(pool, emojiServerID);
                sendMessages(channelID, [poolMessage]);
            }                
        });
    }

    if (message.match(destinyHelpMatch)){
        var message = "```Available Commands:\n";
        message += "!Destiny Roll\n";
        message += "!Destiny Flip (Dark|Light)\n";
        message += "!Destiny Add (Dark|Light)\n";
        message += "!Destiny Show\n";
        message += "!Destiny Reset\n";
        message += "!Destiny Set [DL]\n";
        message += " ^ This can be in any combination of (D)ark and (L)ight```";
        sendMessages(channelID, [message]);
    }

    if (message.match(destinyMatch)) {
        let destinyPool = new DestinyPool(channelID, []);

        destinyPool.getPool().then(function(pool){
            var returnMessage = "";

            var match = destinyMatch.exec(message);

            if (match[1].toLowerCase() === "dark") {
                if (pool.indexOf(dark) !== -1) {
                    returnMessage += "Flipping a Dark Side point.";
                    pool[pool.indexOf(dark)] = light;
                } else {
                    returnMessage += "No Dark Side points to flip.";
                }
            } else if (match[1].toLowerCase() === "light") {
                if (pool.indexOf(light) !== -1) {
                    returnMessage += "Flipping a Light Side point.";
                    pool[pool.indexOf(light)] = dark;
                } else {
                    returnMessage += "No Light Side points to flip."; 
                }
            } else {
                returnMessage += "The Force is confused.";
            }

            destinyPool.setPool(pool).then(function(result){
                var poolMessage = "Current destiny pool: " + printSymbols(pool, emojiServerID);
                sendMessages(channelID, [returnMessage + "\n" + poolMessage]);
            });
        });
    }

    if (message.match(destinyAddMatch)) {
        
        let destinyPool = new DestinyPool(channelID, []);

        destinyPool.getPool().then(function(pool){
            var match = destinyAddMatch.exec(message);
            var symbols = [];
            symbols.push(match[1]);
            returnMessage += "Adding " + printSymbols(symbols, emojiServerID) + " to the destiny pool.";

            pool = pool.concat(symbols);

            destinyPool.setPool(pool).then(function(result){
                var returnMessage =  "Adding " + printSymbols(symbols, emojiServerID) + " to destiny pool";
                var poolMessage = "Current destiny pool: " + printSymbols(pool, emojiServerID);
                sendMessages(channelID, [returnMessage, poolMessage]);
            });            
        }).catch(function(err){
            console.log(err);
        });
    }

    if (message.match(destinySetMatch)) {
        let destinyPool = new DestinyPool(channelID, []);

        var returnMessage = "";
        var pool = [];

        var match = destinySetMatch.exec(message);

        var destinyTokens = match[1].split('');
        destinyTokens.forEach(function(token) {
            token = token.toLocaleLowerCase();
            if (token == 'd') {
                pool.push('Dark');
            } else if (token == 'l') {
                pool.push('Light');
            }

        });
        destinyPool.setPool(pool).then(function(result){
            var poolMessage = "Destiny Pool set as specified: " + printSymbols(pool, emojiServerID);
            sendMessages(channelID, [returnMessage + "\n" + poolMessage]);
        });        
    }
}