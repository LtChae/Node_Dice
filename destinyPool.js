'use strict';
const poolDB = require('./db.js');

class DestinyPool {
    constructor(channelID, newPool) {
        this.channelID = channelID;
    }

    setPool(pool) {
        var channelID = this.channelID;
        return new Promise((resolve, reject) => {
            poolDB.query("delete from channel where id = $1::text", [channelID], function(err, res) {
                if(err) {
                    console.error('error running query', err);
                    reject(err);
                }
                poolDB.query("insert into channel (id, config) values ($1::text, $2::text);", [channelID, JSON.stringify(pool)], function(err, res) {
                    if(err) {
                        console.error('error running query', err);
                        reject(err);
                    }
                    resolve(true);
                });
            });
        });
    }

    getPool() {
        var channelID = this.channelID;
        return new Promise((resolve, reject) => {
            poolDB.query("select * from channel where id = $1::text", [channelID], function(err, res) {
                var pool;
                if(err) {
                    console.error('error running query', err);
                    reject(err);
                }
                if (res && res.rows[0]){
                    pool = JSON.parse(res.rows[0].config);
                } else {
                    pool = [];
                }
                resolve(pool);
            });    
        });
    }
};

module.exports = DestinyPool;