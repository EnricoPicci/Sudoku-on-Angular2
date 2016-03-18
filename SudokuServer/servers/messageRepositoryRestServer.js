"use strict";
var dbManager_1 = require('./dbManager');
//var DbManager = require('./dbManager');
var MessageRepositoryRestServer = (function () {
    function MessageRepositoryRestServer() {
    }
    MessageRepositoryRestServer.getSingleton = function () {
        if (!this.singleton) {
            this.singleton = new MessageRepositoryRestServer();
        }
        return this.singleton;
    };
    MessageRepositoryRestServer.prototype.getNastyPlayerMessageRandom = function (req, res) {
        var nastyPlayerMessageModel = dbManager_1.DbManager.getNastyPlayerMessageModel();
        nastyPlayerMessageModel.aggregate({ $sample: { size: 1 } }, function (err, messageModels) {
            if (err) {
                return console.error(err);
            }
            else {
                res.json(messageModels);
            }
        });
        /*nastyPlayerMessageModel.find({ 'id': +inId }, function (err, messageModels) {
                if (err) {
                    return console.error(err);
                } else {
                    res.json(messageModels);
                }
            }
        )*/
    };
    return MessageRepositoryRestServer;
}());
exports.MessageRepositoryRestServer = MessageRepositoryRestServer;
module.exports = MessageRepositoryRestServer;
//# sourceMappingURL=messageRepositoryRestServer.js.map