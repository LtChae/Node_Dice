var assert = require('assert');
var Initiative = require('../initiative.js');
describe('Initiative Tracker', function() {
    
    describe('Add Slot', function() {
        it('should add a pc slot to the initiative', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 1);
            assert.deepEqual(initiative.order, [{type: 'PC', successes:1, advantages: 1}]);
        });
    });

    describe('Get Order', function() {
        it('should display all added slots', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 3);
            initiative.addSlot('NPC', 1, 2);
            initiative.addSlot('PC', 1, 1);
            assert.deepEqual(initiative.order, [{type: 'PC', successes:1, advantages: 3}, {type: 'NPC', successes:1, advantages: 2}, {type: 'PC', successes:1, advantages: 1}]);
        });
    });

    describe('Get Unicode Order', function() {
        it('should display all added slots as a unicode string, indicating the active slot', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 1);
            initiative.addSlot('NPC', 1, 1);
            assert.equal(initiative.unicodeOrder, '{:low_brightness:}:anger:');
        });
    });

    describe('Sort Order', function() {
        it('should sort all slots by success and advantage', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 1);
            initiative.addSlot('NPC', 2, 1);
            initiative.sort();
            assert.deepEqual(initiative.order, [{type: 'NPC', successes:2, advantages: 1}, {type: 'PC', successes:1, advantages: 1}]);
        });
    });

    describe('Next Slot', function() {
        it('should move the currently active slot to the next', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 2);
            initiative.addSlot('PC', 1, 1);
            initiative.nextSlot();
            assert.equal(initiative.unicodeOrder, ':low_brightness:{:low_brightness:}');
        });

        it('should return the currently active slot to the first when next is called at the end of the round', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 2);
            initiative.addSlot('PC', 1, 1);
            initiative.nextSlot();
            initiative.nextSlot();
            assert.equal(initiative.unicodeOrder, '{:low_brightness:}:low_brightness:');
        });

        it('should increment the round when next is called at the end of the round', function() {
            let initiative = new Initiative();
            initiative.addSlot('PC', 1, 2);
            initiative.addSlot('PC', 1, 1);
            initiative.nextSlot();
            initiative.nextSlot();
            assert.equal(initiative.currentRound, 2);
        });
    });
});