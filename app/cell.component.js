System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var CellComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CellComponent = (function () {
                function CellComponent() {
                }
                CellComponent.prototype.getCellVal = function () {
                    var cellVal = '';
                    if (this.cell.val > 0) {
                        cellVal = this.cell.val.toString();
                    }
                    return cellVal;
                };
                CellComponent.prototype.setCellVal = function (inEvent) {
                    this.cell.valSetAsInput = true;
                    this.cell.val = inEvent.srcElement.value;
                };
                CellComponent.prototype.showBottomBorder = function () {
                    // the third and the sixth row need to have the bottom border drawn in order to show the inner boxes of the board
                    // these rows have index 0 and 5
                    return this.cell.row.index == 2 || this.cell.row.index == 5;
                };
                CellComponent.prototype.showRightBorder = function () {
                    // the third and the sixth column need to have the right border drawn in order to show the inner boxes of the board
                    // these rows have index 0 and 5
                    return this.cell.column.index == 2 || this.cell.column.index == 5;
                };
                CellComponent.prototype.isInconsistent = function () {
                    return this.cell.row.isInconsistent || this.cell.column.isInconsistent || this.cell.squareSet.isInconsistent;
                };
                CellComponent = __decorate([
                    core_1.Component({
                        selector: 'cell-cmp',
                        providers: [],
                        template: "\n        <div    [class.cellWithBottomBorder]=\"showBottomBorder()\" \n                [class.cellWithRightBorder]=\"showRightBorder()\">\n            <input type=\"number\" min=\"1\" max=\"9\" maxlength=\"1\" class=\"cellClass\"\n                [class.inconsistent]=\"isInconsistent()\"\n                [class.hasNoAllowedValues]=\"cell.hasNoAllowedValues\"\n                [value]=\"getCellVal()\" (change)=\"setCellVal($event)\">\n        </div>\n    ",
                        styleUrls: ['../styles/sudoku.css'],
                        directives: [],
                        inputs: ['cell']
                    }), 
                    __metadata('design:paramtypes', [])
                ], CellComponent);
                return CellComponent;
            }());
            exports_1("CellComponent", CellComponent);
        }
    }
});
//# sourceMappingURL=cell.component.js.map