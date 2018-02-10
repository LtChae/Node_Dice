class Initiative {
    constructor(channelID) {
        this.initiative = [];
        this.currentSlotIndex = 0;
    }

    get npc() {
        return '\u1F4A2';
    }

    get pc() {
        return '\u1F464';
    }

    get order(){
        return this.initiative;
    }

    get unicodeOrder(){
        var newOrder = '';
        this.initiative.forEach(function(slot, index) {
            var slotSymbol;
            if (slot.type == 'PC') {
                slotSymbol = this.pc;
            } else if (slot.type == 'NPC') {
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
            this.currentSlotIndex = 0;
        } else {
            this.currentSlotIndex += 1;
        }
    }

}

module.exports = Initiative;