System.register(['./cell', './rowColumnSet'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var cell_1, rowColumnSet_1;
    var Board;
    return {
        setters:[
            function (cell_1_1) {
                cell_1 = cell_1_1;
            },
            function (rowColumnSet_1_1) {
                rowColumnSet_1 = rowColumnSet_1_1;
            }],
        execute: function() {
            Board = (function () {
                function Board() {
                    this.rows = new Array(9);
                    this.columns = new Array(9);
                    this.squareSets = new Array(9);
                    for (var i = 0; i < 9; i++) {
                        var row = new rowColumnSet_1.RowColumnSet(i);
                        var column = new rowColumnSet_1.RowColumnSet(i);
                        var squareSet = new rowColumnSet_1.RowColumnSet(i);
                        this.rows[i] = row;
                        this.columns[i] = column;
                        this.squareSets[i] = squareSet;
                    }
                    this.cells = [];
                    for (var i = 0; i < 9; i++) {
                        this.cells[i] = [];
                        for (var j = 0; j < 9; j++) {
                            var row = this.rows[i];
                            var column = this.columns[j];
                            var squareSetIndex = this.getSquareSetIndex(i, j);
                            var squareSet = this.squareSets[squareSetIndex];
                            var cell = new cell_1.Cell(this, row, column, squareSet);
                            this.cells[i][j] = cell;
                        }
                    }
                }
                Board.prototype.setValue = function (row, column, val) {
                    this.checkRowColumn(row, column);
                    var cell = this.cells[row][column];
                    if (cell.val > 0)
                        throw new Error("Value for cell(" + row + "," + column + ") already set");
                    cell.val = val;
                };
                Board.prototype.getSquareSetIndex = function (row, column) {
                    this.checkRowColumn(row, column);
                    return Math.floor((row) / 3) * 3 + Math.floor((column) / 3);
                };
                Board.prototype.checkRowColumn = function (row, column) {
                    if (row < 0 || row > 8)
                        throw new Error("Row must be in the range 0-8. The value is " + row);
                    if (column < 0 || column > 8)
                        throw new Error("Column must be in the range 0-8. The value is " + column);
                };
                Board.prototype.getFirstUndefinedCell = function () {
                    var resp = null;
                    for (var i = 0; i < this.cells.length; i++) {
                        for (var j = 0; j < this.cells.length; j++) {
                            var cell = this.cells[i][j];
                            if (cell.val == 0) {
                                resp = cell;
                                return resp;
                            }
                        }
                    }
                    return resp;
                };
                Board.prototype.isFinished = function () {
                    return this.getFirstUndefinedCell() == null;
                };
                Board.prototype.notFinished = function () {
                    return !this.isFinished();
                };
                return Board;
            }());
            exports_1("Board", Board);
        }
    }
});
//# sourceMappingURL=board.js.map