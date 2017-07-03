class DiceRoller {
    constructor(dice) {
        this.dice = dice;
        this.rollResult = [];
    }

    roll(poolString) {
        var diceToRoll = poolString.split('');
        var dice = this.dice;
        var results = [];
        diceToRoll.forEach(function(die) {
            die = die.toLocaleLowerCase();
            if (dice[die]) {                
                var roll = Math.floor(Math.random() * dice[die].length);
                results = results.concat(dice[die][roll]);
            }
        });
        console.log(results);
        this.rollResult = results;
    }

    get result() {
        var diceResults = [];
        this.rollResult.forEach(function(result) {
            diceResults = diceResults.concat(result.results)
        });
        return diceResults;
    }
}

module.exports = DiceRoller;