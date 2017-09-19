var assert = require('assert');
var FileReader = require('filereader');
var FileAPI = require('file-api')
, File = FileAPI.File
, FileList = FileAPI.FileList
, FileReader = FileAPI.FileReader
;
var fs = require('fs');

var parseString = require('xml2js').parseString;

var Vehicle = require('../vehicle.js');

describe('Vehicle', function() {
    describe('attributes', function() {
        this.timeout(60000);
        it('should have a type of Freighter', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./freighterXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let vehicle = new Vehicle(result.Vehicle);
                    assert.equal(vehicle.attributes.type, 'Freighter');
                    done();
                });
            });
        });

        it('should have a price of 75000', function(done) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(new File('./freighterXML.xml'));
            fileReader.on('data', function (data) {
                parseString(data, function (err, result) {
                    let vehicle = new Vehicle(result.Vehicle);
                    assert.equal(vehicle.attributes.price, '75000');
                    done();
                });
            });
        });
    });

    describe('uglifier', function() {
        this.timeout(60000);
        it('should be able to load multiple vehicles', function(done) {
            var path = 'C:/Users/Timothy/ShipTest/';
            var vehicles = [];
            fs.readdir(path, function(err, items) {
                expectedVehicles = items.length;
                for (var i=0; i<items.length; i++) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(new File(path + items[i]));
                    fileReader.on('data', function (data) {
                        parseString(data, function (err, result) {
                            let vehicle = new Vehicle(result.Vehicle);
                            vehicles.push(vehicle);
                            if (vehicles.length == items.length) {
                                var filteredVehicles = vehicles.filter(function(vehicle) {
                                    return vehicle.attributes.type == 'Starfighter';
                                });
                                vehicle.uglifier(filteredVehicles);
                                done();
                            }
                        });
                    });
                }
            });
            console.log(vehicles.length);
        });
    });
});