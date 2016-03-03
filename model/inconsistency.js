System.register(['./sudokuException'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sudokuException_1;
    var Inconsistency;
    return {
        setters:[
            function (sudokuException_1_1) {
                sudokuException_1 = sudokuException_1_1;
            }],
        execute: function() {
            Inconsistency = (function (_super) {
                __extends(Inconsistency, _super);
                function Inconsistency(_message) {
                    _super.call(this, _message);
                }
                return Inconsistency;
            }(sudokuException_1.SudokuException));
            exports_1("Inconsistency", Inconsistency);
        }
    }
});
//# sourceMappingURL=inconsistency.js.map