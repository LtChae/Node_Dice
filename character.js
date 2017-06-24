var _ = require('lodash');

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
            if (c.Rank[0].TalentRanks) {
                rank += parseInt(c.Rank[0].TalentRanks[0]);
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
            skillList[this.skillByKey(s.Key[0]).name] = rank;
        }

        return skillList;
    }

    getDicePool(skillName) {
        var skill = _.findKey(this.skillDict, function(o) {return o.name == skillName;});
        var max = Math.max(this.characteristics[this.skillDict[skill].char], this.skills[skillName]);
        var min = Math.min(this.characteristics[this.skillDict[skill].char], this.skills[skillName]);
        return (Array(min+1).join("p") + Array(max-min+1).join("a"));
    }

    skillByKey(skillKey) {
        return this.skillDict[skillKey];
    }

    get skillDict(){ 
        return {
            'ASTRO':{name:'astrogation', char:'intellect'},
            'ATHL':{name:'athletics', char:'brawn'},
            'BRAWL':{name:'brawl', char:'brawn'},
            'CHARM':{name:'charm', char:'presence'},
            'COERC':{name:'coercion', char:'willpower'},
            'COMP':{name:'computers', char:'intellect'},
            'COOL':{name:'cool', char:'presence'},
            'COORD':{name:'coordination', char:'agility'},
            'CORE':{name:'coreWorlds', char:'intellect'},
            'DECEP':{name:'deception', char:'cunning'},
            'DISC':{name:'discipline', char:'willpower'},
            'EDU':{name:'education', char:'intellect'},
            'GUNN':{name:'gunnery', char:'agility'},
            'LEAD':{name:'leadership', char:'presence'},
            'LTSABER':{name:'lightsaber', char:'brawn'}, //Figure out Jedi stuff
            'LORE':{name:'lore', char:'intellect'},
            'MECH':{name:'mechanics', char:'intellect'},
            'MED':{name:'medicine', char:'intellect'},
            'MELEE':{name:'melee', char:'brawn'},
            'NEG':{name:'negotiation', char:'presence'},
            'OUT':{name:'outerRim', char:'intellect'},
            'PERC':{name:'perception', char:'cunning'},
            'PILOTPL':{name:'pilotingSpace', char:'agility'},
            'PILOTSP':{name:'pilotingPlanetary', char:'agility'},
            'RANGHVY':{name:'rangedHeavy', char:'agility'},
            'RANGLT':{name:'rangedLight', char:'agility'},
            'RESIL':{name:'resilience', char:'brawn'},
            'SKUL':{name:'skullduggery', char:'cunning'},
            'STEAL':{name:'stealth', char:'agility'},
            'SW':{name:'streetwise', char:'cunning'},
            'SURV':{name:'survival', char:'cunning'},
            'UND':{name:'underworld', char:'intellect'},
            'VIGIL':{name:'vigilance', char:'willpower'},
            'XEN':{name:'xenology', char:'intellect'},
            'WARF':{name:'warfare', char:'intellect'}
        };
    }
}

module.exports = Character;