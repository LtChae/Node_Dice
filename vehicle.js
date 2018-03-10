var _ = require('lodash');

class Vehicle {
    constructor(vehicleJSON) {
        this.vehJSON = vehicleJSON;
        var attributeHash = {};
        for (var attribute in this.vehJSON) {
            if (this.vehJSON.hasOwnProperty(attribute)) {
                if (this.vehJSON[attribute].length == 1) {
                    attributeHash[attribute.toLowerCase()] = this.vehJSON[attribute][0];
                } else if (this.vehJSON[attribute].length == 0){
                    attributeHash[attribute.toLowerCase()] = undefined;
                } else {
                    attributeHash[attribute.toLowerCase()] = this.vehJSON[attribute];
                }
            }
        }
        this.attributesHash = attributeHash;
    }

    get attributes() {
        return this.attributesHash;   
    }

    uglifier(vehicleList) {
        var parts = {
            hull:['armor', 'hulltrauma', 'encumberancecapacity','passengers','crew'],
            engines:['speed', 'handling'],
            weapons:['vehicleweapons'],
            systems:['systemstrain', 'navicomputer', 'hyperdriveprimary', 'hypderdrivebackup','sensorrangevalue'],
            shields:['deffore','defaft','defport','defstarboard']
        };
        var newVehicle = vehicleList[Math.floor(Math.random()*vehicleList.length)];
        var filteredVehicles = vehicleList.filter(function(vehicle) {
            return ((vehicle.attributes.silhouette == newVehicle.attributes.silhouette) &&
                    (vehicle.attributes.type == newVehicle.attributes.type));
        });
        for (var key in parts){
            var donorVehicle = filteredVehicles[Math.floor(Math.random()*filteredVehicles.length)];
            for (var attribute in parts[key]){
                newVehicle.attributes[parts[key][attribute]] = donorVehicle.attributes[parts[key][attribute]];
            }
        }
    }  
}

module.exports = Vehicle;