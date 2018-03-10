class Initiative {
    constructor(channelID) {
        this.initiative = [];
        this.currentSlotIndex = 0;
        this.round = 1;
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
        return this.round;
    }

    get unicodeOrder(){
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
        this.initiative.push({type:type, successes:successes, advantages:advantages});
        this.sort();
    }

    deleteSlot(type, occurrence){
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
        this.initiative.sort(function(slot1, slot2){
            var tempValue1 = slot1.successes + slot1.advantages / 10;
            var tempValue2 = slot2.successes + slot2.advantages / 10;
            
            return tempValue2 - tempValue1;
        });
    }

    nextSlot(){
        if (this.currentSlotIndex + 1 >= this.initiative.length) {
            this.round += 1;
            this.currentSlotIndex = 0;
        } else {
            this.currentSlotIndex += 1;
        }
    }
}

module.exports = Initiative;