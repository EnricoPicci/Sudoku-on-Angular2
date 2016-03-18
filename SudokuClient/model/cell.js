System.register(['./contraddiction'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var contraddiction_1;
    var Cell;
    return {
        setters:[
            function (contraddiction_1_1) {
                contraddiction_1 = contraddiction_1_1;
            }],
        execute: function() {
            Cell = (function () {
                function Cell(_board, _row, _column, _squareSet) {
                    this.val = 0;
                    this.hasNoAllowedValue = false;
                    this.valSetAsInput = false;
                    this.disabled = false;
                    this.board = _board;
                    this.row = _row;
                    this.column = _column;
                    this.squareSet = _squareSet;
                    this.row.addCell(this);
                    this.column.addCell(this);
                    this.squareSet.addCell(this);
                }
                Cell.prototype.calculateAllowedValues = function () {
                    this.allowedValues = new Array();
                    if (this.isValueSet())
                        return this.allowedValues;
                    var valuesInRow = this.row.valuesSet();
                    var valuesInColumn = this.column.valuesSet();
                    var valuesInSquareSet = this.squareSet.valuesSet();
                    for (var i = 1; i < 10; i++) {
                        if (valuesInRow.indexOf(i) < 0 &&
                            valuesInColumn.indexOf(i) < 0 &&
                            valuesInSquareSet.indexOf(i) < 0)
                            this.allowedValues.push(i);
                    }
                    return this.allowedValues;
                };
                // returns true if the value of the cell is identified and set
                Cell.prototype.identifyAndSetValue = function (_decision) {
                    this.hasNoAllowedValue = false;
                    if (this.isValueSet())
                        return false;
                    this.calculateAllowedValues();
                    if (this.allowedValues.length == 0) {
                        this.hasNoAllowedValue = true;
                        throw new contraddiction_1.Contraddiction("The cell (" + this.row.index + "," + this.column.index + ") has no allowed value");
                    }
                    if (this.allowedValues.length == 1) {
                        this.val = this.allowedValues[0];
                        if (_decision != null) {
                            _decision.affectedCells.push(this);
                        }
                        return true;
                    }
                    return false;
                };
                Cell.prototype.isValueSet = function () {
                    return this.val > 0;
                };
                Cell.prototype.resetVal = function () {
                    this.val = 0;
                };
                Cell.prototype.isValSetAsInput = function () {
                    return this.valSetAsInput;
                };
                Cell.prototype.setValSetAsInput = function (inBool) {
                    this.valSetAsInput = inBool;
                };
                Cell.prototype.toString = function () {
                    return this.row.index + "," + this.column.index + ", " + this.val;
                };
                Cell.prototype.displayValue = function () {
                    var resp = "";
                    if (this.val > 0)
                        resp = this.val.toString();
                    return resp;
                };
                Cell.prototype.getBoard = function () {
                    return this.board;
                };
                return Cell;
            }());
            exports_1("Cell", Cell);
        }
    }
});
//# sourceMappingURL=cell.js.map