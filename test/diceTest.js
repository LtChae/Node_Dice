var assert = require('assert');
var DiceRoller = require('../diceRoller');
describe('DiceRoller', function() {
    
    var newConfig = JSON.parse(JSON.stringify(require('../dice.js')));
    var diceEM = {
        "a":newConfig.ability,
        "d":newConfig.difficulty,
        "s":newConfig.setback,
        "b":newConfig.boost,
        "p":newConfig.proficiency,
        "c":newConfig.challenge,
        "f":newConfig.force
    }
    var symbolHash = newConfig.symbols;
    
    describe('GenerateResult', function() {
        it('should return no more than two results when rolling a single ability die', function() {
            let roller = new DiceRoller(diceEM, symbolHash);
            roller.roll('a');
            assert.equal(roller.symbolResults.length <= 2,true)
        });
        
        it('should return precisely one dice result when rolling a single ability die', function() {
            let roller = new DiceRoller(diceEM, symbolHash);
            roller.roll('a');
            assert.equal(roller.diceResults.length == 1,true)
        });

        it('should return a symbol result that includes the additional threat symbol specified', function() {
            let roller = new DiceRoller(diceEM, symbolHash);
            roller.roll('a', 't');
            console.log(roller.symbolResults);
            assert.equal(roller.symbolResults.includes('Threat'),true)
        });
    });

    describe('Cancel Symbols', function() {
        it('should cancel advantages with threats', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Advantage', 'Threat', 'Threat']);
            assert.deepEqual(cancelledResult, ['Threat']);
        });

        it('should cancel threats with advantages', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Advantage', 'Advantage', 'Advantage', 'Threat', 'Threat']);
            assert.deepEqual(cancelledResult, ['Advantage']);
        });

        it('should cancel successes with failures', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Success', 'Failure', 'Failure']);
            assert.deepEqual(cancelledResult, ['Failure']);
        });

        it('should cancel failures with successes', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Success', 'Success', 'Failure']);
            assert.deepEqual(cancelledResult, ['Success']);
        });

        it('should cancel successes with failures, leaving advantage and success', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Success', 'Success', 'Success', 'Failure', 'Failure', 'Advantage']);
            assert.deepEqual(cancelledResult, ['Advantage', 'Success']);
        });

        it('should cancel successes with failures, leaving advantage and success with a triumph', function() {
            var cancelledResult = DiceRoller.cancelSymbols(['Success', 'Success', 'Success', 'Failure', 'Failure', 'Advantage', 'Triumph']);
            assert.deepEqual(cancelledResult, ['Advantage', 'Success', 'Triumph']);
        });
    });

    describe('Count Symbols', function() {
        it('should count successes', function() {
            var counts = DiceRoller.countSymbols(['Success', 'Success', 'Success']);
            assert.equal(counts['Success'], 3);
        });

        it('should count failures', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Failure', 'Threat']);
            assert.equal(counts['Failure'], 2);
        });

        it('should count threats', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Failure', 'Threat']);
            assert.equal(counts['Threat'], 1);
        });

        it('should count advantages', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Advantage', 'Threat']);
            assert.equal(counts['Advantage'], 1);
        });

        it('should count despairs', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Advantage', 'Despair']);
            assert.equal(counts['Despair'], 1);
        });

        it('should count triumphs', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Advantage', 'Triumph']);
            assert.equal(counts['Triumph'], 1);
        });

        it('should show zero results for symbols that are not present', function() {
            var counts = DiceRoller.countSymbols(['Failure', 'Success', 'Triumph']);
            assert.equal(counts['Advantage'], 0);
        });
    });

    describe('Symbol Types', function() {
        it('should return a list of symbol types', function() {
            var symbols = DiceRoller.symbolTypes;
            assert.deepEqual(symbols, ['Success', 'Failure', 'Threat', 'Advantage', 'Despair', 'Triumph', 'Light', 'Dark', 'Blank']);
        });
    });

    describe('Remove Symbols', function() {
        it('should remove three symbols from a list of symbols', function() {
            var symbols = DiceRoller.removeSymbols(['Threat', 'Threat', 'Threat', 'Advantage', 'Advantage', 'Advantage', 'Advantage'], 'Threat', 3);
            assert.deepEqual(symbols, ['Advantage', 'Advantage', 'Advantage', 'Advantage']);
        });
    });
});