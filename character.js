class Character {
    constructor(characterJSON) {
        this.charJSON = characterJSON;
    }

    get characteristics() {
        var characteristicList = {};
        for(var char in this.charJSON.Characteristics[0].CharCharacteristic) {
            var c = this.charJSON.Characteristics[0].CharCharacteristic[char];
            var rank = parseInt(c.Rank[0].SpeciesRanks[0]); 
            if (c.Rank[0].PurchasedRanks) {
                rank += parseInt(c.Rank[0].PurchasedRanks[0]);
            }
            characteristicList[c.Name[0].toLowerCase()] = rank;
        }
        return characteristicList;
    }

    get skills() {
        var skillList = {};

        for(var skill in this.charJSON.Skills[0].CharSkill) {
            var s = this.charJSON.Skills[0].CharSkill[skill];
            var rank = 0;
            if (s.Rank[0].SpeciesRanks) {
                rank += parseInt(s.Rank[0].SpeciesRanks[0]);
            } 
            if (s.Rank[0].PurchasedRanks) {
                rank += parseInt(s.Rank[0].PurchasedRanks[0]);
            }
            if (s.Rank[0].CareerRanks) {
                rank += parseInt(s.Rank[0].CareerRanks[0]);
            }
            skillList[this.skillDict(s.Key[0])] = rank;
        }

        return skillList;
    }

    skillDict(skillKey) {
        var dict = {
            'ASTRO':'astrogation',
            'ATHL':'athletics',
            'BRAWL':'brawl',
            'CHARM':'charm',
            'COERC':'coercion',
            'COMP':'computers',
            'COOL':'cool',
            'COORD':'coordination',
            'CORE':'coreWorlds',
            'DECEP':'deception',
            'DISC':'discipline',
            'EDU':'education',
            'GUNN':'gunnery',
            'LEAD':'leadership',
            'LTSABER':'lightsaber',
            'LORE':'lore',
            'MECH':'mechanics',
            'MED':'medicine',
            'MELEE':'melee',
            'NEG':'negotiation',
            'OUT':'outerRim',
            'PERC':'perception',
            'PILOTPL':'pilotingSpace',
            'PILOTSP':'pilotingPlanetary',
            'RANGHVY':'rangedHeavy',
            'RANGLT':'rangedLight',
            'RESIL':'resilience',
            'SKUL':'skullduggery',
            'STEAL':'stealth',
            'SW':'streetwise',
            'SURV':'survival',
            'UND':'underworld',
            'VIGIL':'vigilance',
            'XEN':'xenology',
            'WARF':'warfare'
        }
        
        return dict[skillKey]
    }
}

module.exports = Character;