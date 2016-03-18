///<reference path="../typings/mongodb/mongodb.d.ts" />
///<reference path="../typings/mongoose/mongoose.d.ts" />
"use strict";
var mongoose = require("mongoose");
var DbManager = (function () {
    function DbManager() {
    }
    DbManager.connectAndOpen = function () {
        if (!this.db) {
            mongoose.connect('mongodb://localhost/' + this.dbName);
            //mongoose.connect('mongodb://ec2-54-213-172-98.us-west-2.compute.amazonaws.com/' + this.dbName);
            ////////mongoose.connect('mongodb://Enrico:immiammi@ec2-54-213-172-98.us-west-2.compute.amazonaws.com:27017/' + this.dbName));
            this.db = mongoose.connection;
            this.db.on('error', console.error.bind(console, 'connection error:'));
            this.db.once('open', function () {
                console.log('connected!');
            });
        }
        //return this.db;
    };
    DbManager.getNastyPlayerMessageModel = function () {
        this.connectAndOpen();
        if (!this.nastyPlayerMessageModel) {
            this.nastyPlayerMessageModel = mongoose.model('NastyPlayerMessageSchema', this.getNastyPlayerMessageSchema());
        }
        return this.nastyPlayerMessageModel;
    };
    DbManager.getNastyPlayerMessageSchema = function () {
        if (!this.nastyPlayerMessageSchema) {
            this.nastyPlayerMessageSchema = new mongoose.Schema({
                id: String,
                text: String
            });
        }
        return this.nastyPlayerMessageSchema;
    };
    DbManager.dbName = 'SudokuServerDB';
    return DbManager;
}());
exports.DbManager = DbManager;
//# sourceMappingURL=dbManager.js.map