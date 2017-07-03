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
    
    describe('GenerateResult', function() {
        it('should return no more than two results when rolling a single ability die', function() {
            let roller = new DiceRoller(diceEM);
            roller.roll('a');
            console.log(roller.result);
            assert.equal(roller.result.length <= 2,true)
        });
        
         it('should return no more than two results when rolling a single ability die', function() {
            let roller = new DiceRoller(diceEM);
            roller.roll('a');
            console.log(roller.result);
            assert.equal(roller.result.length <= 2,true)
        });
    });
});