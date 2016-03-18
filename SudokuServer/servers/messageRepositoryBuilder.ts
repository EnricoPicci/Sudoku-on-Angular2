 import {DbManager} from './dbManager';
 
 export class MessageRepositoryBuilder {  
       
    static fillMessageRepository() {
        let messageJSONs = this.getMessageJSONs();
        let messageModel = DbManager.getNastyPlayerMessageModel();
        for (var i = 0; i < messageJSONs.length; i++) {
            var oneMessageModel:any = new messageModel(messageJSONs[i]);
            oneMessageModel.save(function (err, oneSheetModel) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log('Message saved: ' + oneMessageModel.text);
                }
            });
        }
    }
    
    private static getMessageJSONs() {
        let messages = new Array<string>();
        let message;
        message = {
                id: '1',
                text: 'first message'
            };
        messages.push(message);
        message = {
                id: '2',
                text: 'second message'
            };
        messages.push(message);
        
        return messages;
    }
    
 }
 
 
class Main {
    constructor() {
        //var builder = new MessageRepositoryBuilder();
        MessageRepositoryBuilder.fillMessageRepository();
    }
}

var main = new Main();

module.exports = main;