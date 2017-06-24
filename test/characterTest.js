var assert = require('assert');
var FileReader = require('filereader');
var FileAPI = require('file-api')
, File = FileAPI.File
, FileList = FileAPI.FileList
, FileReader = FileAPI.FileReader
;
var parseString = require('xml2js').parseString;

var Character = require('../character.js');

describe('Character', function() {
    describe('characteristics', function() {
        this.timeout(60000);
        it('should have a native presence rating of 2 with', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.characteristics.presence, 2);
                    done();
                });
            });
        });
        
        it('should have a brawn rating of 2 with a purchased rank', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.characteristics.brawn, 2);
                    done();
                });
            });
        });
        
        it('should have an intellect rating of 6 via a talent', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testADVXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.characteristics.intellect, 6);
                    done();
                });
            });
        });
    });
    
    describe('skills', function() {
        this.timeout(60000);
        it('should have one rank of discipline', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testSkillXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.skills.discipline, 1);
                    done();
                });
            });
        });
    });
    
    describe('dicePool', function() {
        this.timeout(60000);
        it('should be one proficiency and two ability dice for discipline', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testSkillXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.getDicePool('discipline'), 'paa');
                    done();
                });
            });
        });
        it('should be three ability dice for coercion', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testSkillXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.getDicePool('coercion'), 'aaa');
                    done();
                });
            });
        });
        it('should be two ability dice for perception', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./testSkillXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let character = new Character(result.Character);
                    assert.equal(character.getDicePool('perception'), 'aa');
                    done();
                });
            });
        });
    });
});