///<reference path="../typings/mongodb/mongodb.d.ts" />
///<reference path="../typings/mongoose/mongoose.d.ts" />

import * as mongodb from "mongodb";
import * as mongoose from "mongoose";

export class DbManager { 
    private static dbName = 'SudokuServerDB';
    private static db: mongoose.Connection;
    
    private static nastyPlayerMessageSchema;
    private static nastyPlayerMessageModel;
    
    private static connectAndOpen() {
        if (!this.db) {
        mongoose.connect('mongodb://localhost/' + this.dbName);
        //mongoose.connect('mongodb://ec2-54-213-172-98.us-west-2.compute.amazonaws.com/' + this.dbName);
        ////////mongoose.connect('mongodb://Enrico:immiammi@ec2-54-213-172-98.us-west-2.compute.amazonaws.com:27017/' + this.dbName));
            this.db = mongoose.connection;
            this.db.on('error', console.error.bind(console, 'connection error:'));
            this.db.once('open', () => {
                console.log('connected!');
            })
        }
        //return this.db;
    }
    
    static getNastyPlayerMessageModel() {
        this.connectAndOpen();
        if (!this.nastyPlayerMessageModel) {
            this.nastyPlayerMessageModel = mongoose.model('NastyPlayerMessageSchema', this.getNastyPlayerMessageSchema());
        }
        return this.nastyPlayerMessageModel;
    }
    
    private static getNastyPlayerMessageSchema() {
        if (!this.nastyPlayerMessageSchema) {
            this.nastyPlayerMessageSchema  = new mongoose.Schema( {
                    id: String,
                    text: String
                }
            )
        }
        return this.nastyPlayerMessageSchema;
    }
    
}