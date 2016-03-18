System.register(['./unresolvable'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var unresolvable_1;
    var Decision;
    return {
        setters:[
            function (unresolvable_1_1) {
                unresolvable_1 = unresolvable_1_1;
            }],
        execute: function() {
            Decision = (function () {
                function Decision(_cell, _parent) {
                    this.index = 0;
                    this.parent = null;
                    this.affectedCells = new Array();
                    this.cell = _cell;
                    this.parent = _parent;
                }
                Decision.prototype.isNextAvailable = function () {
                    return this.index < this.cell.allowedValues.length;
                };
                Decision.prototype.nextValue = function () {
                    return this.cell.allowedValues[this.index];
                };
                Decision.prototype.next = function () {
                    this.cell.val = this.nextValue();
                };
                Decision.prototype.change = function () {
                    this.reset();
                    if (this.isNextAvailable()) {
                        this.perform();
                        return this;
                    }
                    else {
                        if (this.isRoot())
                            throw new unresolvable_1.Unresolvable("Unresolvable Sudoku");
                        return this.parent.change();
                    }
                };
                Decision.prototype.reset = function () {
                    this.cell.resetVal();
                    for (var i = 0; i < this.affectedCells.length; i++) {
                        var affectedCell = this.affectedCells[i];
                        affectedCell.resetVal();
                    }
                };
                Decision.prototype.perform = function () {
                    this.cell.val = this.nextValue();
                    this.index++;
                };
                Decision.prototype.isRoot = function () {
                    return this.parent == null;
                };
                return Decision;
            }());
            exports_1("Decision", Decision);
        }
    }
});
//# sourceMappingURL=decision.js.map