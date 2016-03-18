System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Environment;
    return {
        setters:[],
        execute: function() {
            Environment = (function () {
                function Environment() {
                    this.baseServiceUrl = 'http://localhost:3105/sudoku/';
                }
                return Environment;
            }());
            exports_1("Environment", Environment);
        }
    }
});
//# sourceMappingURL=environment.service.js.map