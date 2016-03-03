System.register(['angular2/core', '../model/board', '../model/player', '../model/inconsistency', '../model/contraddiction', './cell.component'], function(exports_1, context_1) {
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
    var core_1, board_1, player_1, inconsistency_1, contraddiction_1, cell_component_1;
    var BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (board_1_1) {
                board_1 = board_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (inconsistency_1_1) {
                inconsistency_1 = inconsistency_1_1;
            },
            function (contraddiction_1_1) {
                contraddiction_1 = contraddiction_1_1;
            },
            function (cell_component_1_1) {
                cell_component_1 = cell_component_1_1;
            }],
        execute: function() {
            BoardComponent = (function () {
                function BoardComponent(_smartPlayer) {
                    this._smartPlayer = _smartPlayer;
                    this.board = new board_1.Board();
                }
                ;
                BoardComponent.prototype.solve = function () {
                    try {
                        this._smartPlayer.solve(this.board);
                    }
                    catch (ex) {
                        if (ex instanceof inconsistency_1.Inconsistency) {
                            this.errorMessage = 'This Sudoku does not respect the rules of the game. Check and correct.';
                        }
                        else if (ex instanceof contraddiction_1.Contraddiction) {
                            this.errorMessage = 'Some cells have no allowed values.';
                        }
                        else {
                            this.errorMessage = 'An unexpected error has occurred. Insult the programmer.';
                        }
                    }
                };
                BoardComponent.prototype.resetInput = function () {
                    for (var i = 0; i < this.board.rows.length; i++) {
                        for (var j = 0; j < this.board.columns.length; j++) {
                            var thisCell = this.board.cells[i][j];
                            if (!thisCell.valSetAsInput) {
                                thisCell.resetVal();
                            }
                        }
                    }
                    this.board = new board_1.Board();
                };
                BoardComponent.prototype.resetBoard = function () {
                    this.errorMessage = null;
                    this.board = new board_1.Board();
                };
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'board-cmp',
                        providers: [],
                        templateUrl: '../templates/board.html',
                        styleUrls: ['../styles/sudoku.css'],
                        inputs: ['board'],
                        directives: [cell_component_1.CellComponent],
                    }), 
                    __metadata('design:paramtypes', [player_1.Player])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});
//# sourceMappingURL=board.component.js.map