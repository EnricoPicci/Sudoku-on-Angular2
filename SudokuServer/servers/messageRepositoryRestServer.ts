import {DbManager} from './dbManager';
//var DbManager = require('./dbManager');

export class MessageRepositoryRestServer {
    private static singleton;
    
    public static getSingleton() {
        if (!this.singleton) {
            this.singleton = new MessageRepositoryRestServer()
        }
        return this.singleton;
    }
    
    public getNastyPlayerMessageRandom(req, res) {
        let nastyPlayerMessageModel = DbManager.getNastyPlayerMessageModel();
        nastyPlayerMessageModel.aggregate({$sample: { size: 1 }}, function (err, messageModels) {
                if (err) {
                    return console.error(err);
                } else {
                    res.json(messageModels);
                }
            }
        );      
        /*nastyPlayerMessageModel.find({ 'id': +inId }, function (err, messageModels) {
                if (err) {
                    return console.error(err);
                } else {
                    res.json(messageModels);
                }
            }
        )*/
    }
    
}

module.exports = MessageRepositoryRestServer;