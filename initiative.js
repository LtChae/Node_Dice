class Initiative {
    constructor(channelID) {
        this.initiative = [];
        this.currentSlotIndex = -1;
        this.round = 0;
    }

    get npc() {
        return ':anger:';
    }

    get pc() {
        return ':low_brightness:';
    }

    get order(){
        return this.initiative;
    }

    get currentRound(){
        console.log(`Getting round as: ${this.round}`);
        return this.round;
    }

    set currentRound(round){
        console.log(`Setting ${this.round} to ${round}`);
        this.round = round;
    }

    get unicodeOrder(){
        console.log('   unicodeOrder');
        var newOrder = '';
        this.initiative.forEach(function(slot, index) {
            var slotSymbol;
            if (slot.type.toUpperCase() == 'PC') {
                slotSymbol = this.pc;
            } else if (slot.type.toUpperCase() == 'NPC') {
                slotSymbol = this.npc;
            } else {
                slotSymbol = '?';
            }

            if (index == this.currentSlotIndex) {
                newOrder += '{' + slotSymbol + '}';
            } else {
                newOrder += slotSymbol;
            }
            
        }, this);
        return newOrder;
    }

    addSlot(type, successes, advantages){
        console.log('   addSlot');
        this.initiative.push({type:type, successes:successes, advantages:advantages});
        this.sort();
        if (this.currentRound <= 0) {
            this.currentSlotIndex = -1;
        }
    }

    deleteSlot(type, occurrence){
        console.log('   deleteSlot');
        var pos = -1;
        var occurences = 0;
        this.initiative.forEach(function(slot, index) {
            if (slot.type == type) {
                occurences++;
                if (occurences == occurrence){
                    console.log("Index of " + type, index);
                    pos = index;
                }
            }
        });
        if (pos >= 0) {
            if (pos < this.currentSlotIndex) {
                this.currentSlotIndex--;
            }
            this.initiative.splice(pos, 1);
            this.sort();
            return true;
        } else {
            return false;
        }
        
    }

    sort(){
        console.log('   sort');
        this.initiative.sort(function(slot1, slot2){
            var tempValue1 = slot1.successes + slot1.advantages / 10;
            var tempValue2 = slot2.successes + slot2.advantages / 10;
            var result = tempValue2 - tempValue1;
            if (result == 0) {
                if (slot1.type === "PC") {
                    return -1;
                } else if (slot2.type === "PC") {
                    return 1;
                }
            }
            return result;
        });
    }

    nextSlot(){
        console.log('   nextSlot');
        if (this.currentRound <= 0) {
            this.beginInitiative();
        }
        if (this.currentSlotIndex + 1 >= this.initiative.length) {
            this.round += 1;
            this.currentSlotIndex = 0;
        } else {
            this.currentSlotIndex += 1;
        }
    }

    beginInitiative(){
        console.log('   beginInitiative');
        this.currentSlotIndex = 0;
        this.round = 1;
    }
}

module.exports = Initiative;