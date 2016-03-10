System.register(['angular2/core', './board.component', '../model/board', '../model/player'], function(exports_1, context_1) {
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
    var core_1, board_component_1, board_1, player_1;
    var DoubleBoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (board_component_1_1) {
                board_component_1 = board_component_1_1;
            },
            function (board_1_1) {
                board_1 = board_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            }],
        execute: function() {
            DoubleBoardComponent = (function () {
                function DoubleBoardComponent() {
                    this.isNastyPlay = false;
                    this.boards = new Array();
                }
                //@ViewChild('boardComponent2') boardComponent2: BoardComponent;
                DoubleBoardComponent.prototype.ngOnInit = function () {
                    this.boards[0] = new board_1.Board();
                };
                DoubleBoardComponent.prototype.startPlayNasty = function () {
                    this.boards[1] = this.boards[0].copy();
                    this.isNastyPlay = true;
                    this.nastyPlayer = new player_1.Player();
                    this.nastyPlayer.setMessage('I am the nasty player');
                    this.nastyPlayer.isAutomaticPlayer = true;
                    this.nastyPlayer.playNasty(this.boards[1]);
                    this.boardComponent1.displayConsole = false;
                    this.boardComponent1.setPlayMode();
                };
                __decorate([
                    core_1.ViewChild('boardComponent1'), 
                    __metadata('design:type', board_component_1.BoardComponent)
                ], DoubleBoardComponent.prototype, "boardComponent1", void 0);
                DoubleBoardComponent = __decorate([
                    core_1.Component({
                        selector: 'double-board-cmp',
                        providers: [],
                        templateUrl: '../templates/doubleBoard.html',
                        styleUrls: ['../styles/sudoku.css'],
                        inputs: [],
                        directives: [board_component_1.BoardComponent],
                    }), 
                    __metadata('design:paramtypes', [])
                ], DoubleBoardComponent);
                return DoubleBoardComponent;
            }());
            exports_1("DoubleBoardComponent", DoubleBoardComponent);
        }
    }
});
//# sourceMappingURL=doubleBoard.component.js.map