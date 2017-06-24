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
        it('should have a brawn rating of 2', function(done) {
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
});