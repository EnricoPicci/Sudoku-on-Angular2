System.register(['angular2/core', 'angular2/platform/browser', 'angular2/http', 'rxjs/Rx', './app.component', '../environmentSettings/environment.service', './messageRepository.service', '../externalServicesRest/messageRepositoryRest.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, browser_1, http_1, app_component_1, environment_service_1, messageRepository_service_1, messageRepositoryRest_service_1;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (environment_service_1_1) {
                environment_service_1 = environment_service_1_1;
            },
            function (messageRepository_service_1_1) {
                messageRepository_service_1 = messageRepository_service_1_1;
            },
            function (messageRepositoryRest_service_1_1) {
                messageRepositoryRest_service_1 = messageRepositoryRest_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [environment_service_1.Environment, http_1.HTTP_PROVIDERS,
                core_1.provide(messageRepository_service_1.MessageRepositoryService, { useClass: messageRepositoryRest_service_1.MessageRepositoryRestService })]);
        }
    }
});
//# sourceMappingURL=boot.js.map