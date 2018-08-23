var DiceRoller = require('./diceRoller.js');
var Initiative = require('./initiative.js');

var initiativeHelpMatch = /^!Init Help/i;
var initiativeRollMatch = /^!Init (PC|NPC)[ ]?\[([adpcfbs]*)\][ ]?\[?([sfatrdkl]*)\]?/i;
var initiativeAddMatch = /^!Init (?:Add|A) (PC|NPC) (\d+):\s?(\d+)?/i;
var initiativeRemoveMatch = /^!Init (?:Remove|R|Delete|D) (PC|NPC) (\d+)/i;
var initiativeShowMatch = /^!Init (?:Show|S|View|V)$/i;
var initiativeNextMatch = /^!Init (?:Next|N)$/i;
var initiativeStartMatch = /^!Init (?:Start)$/i;
var initiativeClearMatch = /^!Init (?:Clear|C|Reset)/i;

var channelInit = {};

exports.handleMessage = function(message, channelID, serverDice, serverSymbols, emojiServerID, sendMessages, printSymbols) {
    if (message.match(initiativeRollMatch)) {
        if (!channelInit[channelID]){
            channelInit[channelID] = new Initiative();
        }

        let roller = new DiceRoller(serverDice, serverSymbols);
        var initRollMatch = initiativeRollMatch.exec(message);
        roller.roll(initRollMatch[2].toLowerCase(), initRollMatch[3].toLowerCase());
        var symbols = DiceRoller.countSymbols(roller.cancelledSymbols);
        channelInit[channelID].addSlot(initRollMatch[1], symbols['Success'], symbols['Advantage']);

        var returnMessage = "";
        roller.diceResults.forEach(function(result) {
            returnMessage += result.code + " ";	
        });
        resultsMessage = printSymbols(roller.cancelledSymbols, emojiServerID);

        sendMessages(channelID, [returnMessage + '\n\n' + resultsMessage, 'Adding '+ initRollMatch[1] +' slot to initative. New order: ' + '\n\n' + channelInit[channelID].unicodeOrder]);

    }

    if (message.match(initiativeAddMatch)) {
        if (!channelInit[channelID]){
            channelInit[channelID] = new Initiative();
        }

        var addMatch = initiativeAddMatch.exec(message);
        channelInit[channelID].addSlot(addMatch[1], parseInt(addMatch[2]), parseInt(addMatch[3]));
        sendMessages(channelID, ['Adding '+ addMatch[1] +' slot to initative. New order: ' + '\n\n' + channelInit[channelID].unicodeOrder]);
        
    }

    if (message.match(initiativeRemoveMatch)) {
        if (!channelInit[channelID]){
            sendMessages(channelID, ['No initiative is currently being tracked for this channel. Use `!Init (PC|NPC) []` to get started']);
        } else {
            var removeMatch = initiativeRemoveMatch.exec(message);
            if (channelInit[channelID].deleteSlot(removeMatch[1], parseInt(removeMatch[2]))) {
                sendMessages(channelID, ['Removing ' + removeMatch[1] + ' ' + removeMatch[2] + ' from initative. New order: ' + '\n\n' + channelInit[channelID].unicodeOrder]);
            } else {
                sendMessages(channelID, ['No '+ removeMatch[1] + ' ' + removeMatch[2] + ' to remove.']);
            }
        }
    }

    if (message.match(initiativeShowMatch)) {
        if (!channelInit[channelID]){
            sendMessages(channelID, ['No initiative is currently being tracked for this channel. Use `!Init (PC|NPC) []` to get started']);
        } else {
            sendMessages(channelID, ['Round: ' + channelInit[channelID].currentRound + ' | ' + channelInit[channelID].unicodeOrder]);
        }
    }

    if (message.match(initiativeNextMatch)) {
        if (!channelInit[channelID]){
            sendMessages(channelID, ['No initiative is currently being tracked for this channel. Use `!Init (PC|NPC) []` to get started']);
        } else {
            channelInit[channelID].nextSlot();
            sendMessages(channelID, ['Round: ' + channelInit[channelID].currentRound + ' | ' + channelInit[channelID].unicodeOrder]);
        }
    }

    if (message.match(initiativeStartMatch)) {
        if (!channelInit[channelID]){
            sendMessages(channelID, ['No initiative is currently being tracked for this channel. Use `!Init (PC|NPC) []` to get started']);
        } else {
            channelInit[channelID].beginInitiative();
            sendMessages(channelID, ['Round: ' + channelInit[channelID].currentRound + ' | ' + channelInit[channelID].unicodeOrder]);
        }
    }

    if (message.match(initiativeClearMatch)) {
        if (!channelInit[channelID]){
            sendMessages(channelID, ['No initiative is currently being tracked for this channel. Use `!Init (PC|NPC) []` to get started']);
        } else {
            channelInit[channelID] = null;
            sendMessages(channelID, ['Initiative for this channel has been cleared']);
        }
    }

    if (message.match(initiativeHelpMatch)) {
        var message = "```\n";
        message += "Init Help:\n";
        message += "To add a slot: !Init (PC|NPC) [Some Dice Characters]\n";
        message += "See '!Roll Help' for more details on the dice characters\n";
        message += "* Example: !Init PC [aa]\n";
        message += "Init supports rolling Additional Symbols as well.\n";
        message += "* Example: !Init PC [aa][sa]\n\n";
        message += "!Init Add (PC|NPC) Successes:Advantages\n";
        message += "* Example: !Init Add PC 1:2\n\n";
        message += "!Init Remove (PC|NPC) Occurrence\n";
        message += "* Example: !Init Remove NPC 3\n";
        message += "This will remove the 3rd NPC slot in the order.\n\n";
        message += "!Init Next\n";
        message += "!Init Start\n";
        message += "!Init Show\n";
        message += "!Init Clear```";
        sendMessages(channelID, [message]);
    }
}