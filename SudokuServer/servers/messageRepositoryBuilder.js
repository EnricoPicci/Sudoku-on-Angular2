"use strict";
var dbManager_1 = require('./dbManager');
var MessageRepositoryBuilder = (function () {
    function MessageRepositoryBuilder() {
    }
    MessageRepositoryBuilder.fillMessageRepository = function () {
        var messageJSONs = this.getMessageJSONs();
        var messageModel = dbManager_1.DbManager.getNastyPlayerMessageModel();
        for (var i = 0; i < messageJSONs.length; i++) {
            var oneMessageModel = new messageModel(messageJSONs[i]);
            oneMessageModel.save(function (err, oneSheetModel) {
                if (err) {
                    return console.error(err);
                }
                else {
                    console.log('Message saved: ' + oneMessageModel.text);
                }
            });
        }
    };
    MessageRepositoryBuilder.getMessageJSONs = function () {
        var messages = new Array();
        var message;
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
    };
    return MessageRepositoryBuilder;
}());
exports.MessageRepositoryBuilder = MessageRepositoryBuilder;
var Main = (function () {
    function Main() {
        //var builder = new MessageRepositoryBuilder();
        MessageRepositoryBuilder.fillMessageRepository();
    }
    return Main;
}());
var main = new Main();
module.exports = main;
//# sourceMappingURL=messageRepositoryBuilder.js.map