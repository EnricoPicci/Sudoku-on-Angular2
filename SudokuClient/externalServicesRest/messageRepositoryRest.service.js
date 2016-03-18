System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', '../environmentSettings/environment.service', '../app/messageRepository.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1, environment_service_1, messageRepository_service_1;
    var MessageRepositoryRestService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (environment_service_1_1) {
                environment_service_1 = environment_service_1_1;
            },
            function (messageRepository_service_1_1) {
                messageRepository_service_1 = messageRepository_service_1_1;
            }],
        execute: function() {
            MessageRepositoryRestService = (function (_super) {
                __extends(MessageRepositoryRestService, _super);
                function MessageRepositoryRestService(_http, _environment) {
                    _super.call(this);
                    this._http = _http;
                    this._environment = _environment;
                }
                MessageRepositoryRestService.prototype.getNastyPlayerMessageRandom = function () {
                    var myUrl = this._environment.baseServiceUrl + 'nastyPlayerMessageRandom';
                    return this._http.get(myUrl)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data[0];
                    })
                        .catch(this.handleError);
                };
                ;
                MessageRepositoryRestService.prototype.handleError = function (error) {
                    console.error('http error');
                    console.error(error);
                    var errorText = error.text();
                    if (error.status == 200) {
                        errorText = 'The whole server is down. The connection has been refused.';
                    }
                    return Observable_1.Observable.throw(errorText || 'Server error');
                };
                MessageRepositoryRestService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, environment_service_1.Environment])
                ], MessageRepositoryRestService);
                return MessageRepositoryRestService;
            }(messageRepository_service_1.MessageRepositoryService));
            exports_1("MessageRepositoryRestService", MessageRepositoryRestService);
        }
    }
});
//# sourceMappingURL=messageRepositoryRest.service.js.map