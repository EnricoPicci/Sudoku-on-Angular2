System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var RowColumnSet;
    return {
        setters:[],
        execute: function() {
            RowColumnSet = (function () {
                function RowColumnSet(_index) {
                    this.cells = new Array(9);
                    this.isInconsistent = false;
                    this.index = _index;
                }
                RowColumnSet.prototype.addCell = function (_cell) {
                    var foundEmpty = false;
                    for (var i = 0; i < 9; i++) {
                        if (this.cells[i] == null) {
                            foundEmpty = true;
                            this.cells[i] = _cell;
                            break;
                        }
                    }
                    if (!foundEmpty)
                        throw new Error("Row_Column_Set already full");
                };
                RowColumnSet.prototype.valuesSet = function () {
                    var resp = new Array();
                    for (var i = 0; i < this.cells.length; i++) {
                        var cell = this.cells[i];
                        resp.push(cell.val);
                    }
                    return resp;
                };
                return RowColumnSet;
            }());
            exports_1("RowColumnSet", RowColumnSet);
        }
    }
});
//# sourceMappingURL=rowColumnSet.js.map