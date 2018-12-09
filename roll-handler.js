var DiceRoller = require('./diceRoller.js');
var diceMatch = /!Roll[ ]?\[([adpcfbs]*)\][ ]?\[?([sfatrdkl]*)\]?/i;
var diceHelpMatch = /^!Roll Help/i;

exports.handleMessage = function(message, channelID, serverDice, serverSymbols, emojiServerID, sendMessages, printSymbols) {
    if (message.match(diceHelpMatch)){
        var message = "```Dice Bot Help:\n";
        message += "Send commands in the form of: !Roll[Some Dice Characters]\n";
        message += "Where 'Some Dice Characters' are any of these:\n";
        message += "a = Ability (Green)\n";
        message += "d = Difficulty (Purple)\n";
        message += "s = Setback (Black)\n";
        message += "b = Boost (Blue)\n";
        message += "p = Proficiency (Yellow)\n";
        message += "c = Challenge (Red)\n";
        message += "f = Force (White)\n";
        message += "Example: !Roll[aadd]\n";
        message += "--------------------\n";
        message += "The dice bot also allows additional symbols to be added to rolls in the form of: !Roll[Some Dice Characters][Some Additional Characters]\n";
        message += "Where 'Some Additional Characters' are any of these:\n";
        message += "s = Success\n";
        message += "f = Failure\n";
        message += "a = Advantage\n";
        message += "t = Threat\n";
        message += "r = Triumph\n";
        message += "d = Despair\n";
        message += "k = Dark\n";
        message += "l = Light\n";
        message += "Example: !Roll[aadd][sa]\n```";
        sendMessages(channelID, [message]);
    }

    if (message.match(diceMatch)) {
        let roller = new DiceRoller(serverDice, serverSymbols);
        roller.roll(diceMatch.exec(message)[1].toLowerCase(), diceMatch.exec(message)[2].toLowerCase());

        var returnMessage = "";

        roller.diceResults.forEach(function(result) {
            returnMessage += result.code + " ";	
        });

        resultsMessage = printSymbols(roller.cancelledSymbols, emojiServerID)

        if (resultsMessage == ""){
            resultsMessage = "`All symbols cancelled out or none were rolled.`"
        }

        if (returnMessage.trim()==='') {
            resultsMessage = ":warning: No dice images could be displayed. Please ensure that Dice Emoji have been uploaded to the server or that the bot has the `Use External Emojis` permission.";
        }

        sendMessages(channelID, [returnMessage + '\n\n' + resultsMessage]);
    }
}