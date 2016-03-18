System.register(['angular2/platform/browser', 'angular2/http', 'rxjs/Rx', './app.component', '../environmentSettings/environment.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var browser_1, http_1, app_component_1, environment_service_1;
    return {
        setters:[
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
            }],
        execute: function() {
            //import {Board} from '../model/board';
            //import {Player} from '../model/player';
            browser_1.bootstrap(app_component_1.AppComponent, [environment_service_1.Environment, http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=boot.js.map