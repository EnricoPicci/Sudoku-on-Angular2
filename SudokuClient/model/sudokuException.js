System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SudokuException;
    return {
        setters:[],
        execute: function() {
            SudokuException = (function (_super) {
                __extends(SudokuException, _super);
                function SudokuException(_message) {
                    _super.call(this, _message);
                }
                return SudokuException;
            }(Error));
            exports_1("SudokuException", SudokuException);
        }
    }
});
//# sourceMappingURL=sudokuException.js.map