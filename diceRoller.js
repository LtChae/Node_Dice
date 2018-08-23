class DiceRoller {
    
    constructor(dice, symbolHash) {
        this.dice = dice;
        this.symbolList = [];
        if (!symbolHash) {
            var newConfig = JSON.parse(JSON.stringify(require('./dice.js')));
            symbolHash = newConfig.symbols;
        }
        
        Object.keys(symbolHash).forEach(key => {
            this.symbolList.push(symbolHash[key]);
        });
        this.rollResult = [];
    }

    roll(poolString, symbolString) {
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
        this.additionalSymbols = symbolString;
        this.rollResult = results;
    }

    static get symbolTypes() {
        return ['Success', 'Failure', 'Threat', 'Advantage', 'Despair', 'Triumph', 'Light', 'Dark', 'Blank'];
    }

    static cancelSymbols(symbols) {
        symbols.sort();
        var cancelledSymbols = [];
        var symbolCounts = this.countSymbols(symbols);

        this.removeSymbols(symbols, 'Success', Math.min(symbolCounts['Failure'], symbolCounts['Success']));
        this.removeSymbols(symbols, 'Failure', Math.min(symbolCounts['Failure'], symbolCounts['Success']));

        this.removeSymbols(symbols, 'Advantage', Math.min(symbolCounts['Advantage'], symbolCounts['Threat']));
        this.removeSymbols(symbols, 'Threat', Math.min(symbolCounts['Advantage'], symbolCounts['Threat']));

        this.removeSymbols(symbols, 'Blank', symbolCounts['Blank']);

        return symbols;
    }

    static removeSymbols(symbols, symbolToRemove, number) {
        var index = symbols.indexOf(symbolToRemove);
        if (index > -1) {
            symbols.splice(index, number);
        }
        return symbols;
    }

    static countSymbols(symbols) {
        var symbolTypes = this.symbolTypes;
        var counts = {};
        symbolTypes.forEach(function(type){
            counts[type] = symbols.filter(symbol => symbol == type).length;
        });

        return counts;
    }

    get symbolResults() {
        var symbolResults = [];
        this.rollResult.forEach(function(result) {
            symbolResults = symbolResults.concat(result.results)
        });
        if (this.additionalSymbols){
            var additionalSymbols = this.additionalSymbols.split('');
            additionalSymbols.forEach(addSymbol => {
                var newSymbol = this.symbolList.find(symbol => {
                    return symbol.character == addSymbol;
                });
                symbolResults.push(newSymbol.name);
            });
        }
        return symbolResults;
    }

    get diceResults() {
        return this.rollResult;
    }

    get cancelledSymbols() {
        return DiceRoller.cancelSymbols(this.symbolResults);
    }
}

module.exports = DiceRoller;