System.register(['angular2/core', '../model/board', '../model/player', '../model/inconsistency', '../model/contraddiction', '../model/unresolvable', './cell.component', './boardRenderer.component'], function(exports_1, context_1) {
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
    var core_1, board_1, player_1, inconsistency_1, contraddiction_1, unresolvable_1, cell_component_1, boardRenderer_component_1;
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
            function (unresolvable_1_1) {
                unresolvable_1 = unresolvable_1_1;
            },
            function (cell_component_1_1) {
                cell_component_1 = cell_component_1_1;
            },
            function (boardRenderer_component_1_1) {
                boardRenderer_component_1 = boardRenderer_component_1_1;
            }],
        execute: function() {
            BoardComponent = (function () {
                function BoardComponent(_smartPlayer) {
                    var _this = this;
                    this._smartPlayer = _smartPlayer;
                    this.enableTryAnotherSolutionButton = false;
                    this.enableSolveButton = true;
                    this.enablePlayButton = true;
                    this.processRenderedInfo = function (inDigits) {
                        console.log('this digits -- ' + inDigits);
                        if (inDigits) {
                            for (var i = 0; i < _this.board.rows.length; i++) {
                                var thisRow = _this.board.rows[i];
                                for (var j = 0; j < thisRow.cells.length; j++) {
                                    if (inDigits[i][j]) {
                                        thisRow.cells[j].val = inDigits[i][j];
                                        thisRow.cells[j].setSetAsInput(true);
                                    }
                                }
                            }
                        }
                        else {
                            _this.errorMessage = "Couldn't find a sudoku board in that image.";
                        }
                    };
                    this.board = new board_1.Board();
                }
                ;
                BoardComponent.prototype.ngOnInit = function () {
                    this.initializeBoard();
                };
                BoardComponent.prototype.solve = function () {
                    this.errorMessage = null;
                    try {
                        this._smartPlayer.solve(this.board);
                        this.setFinishedMode();
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                };
                BoardComponent.prototype.tryAnotherSolution = function () {
                    try {
                        var iterations = this._smartPlayer.tryAnotherSolution(this.board);
                        if (iterations == 0) {
                            this.setNoOtherSolutionsAvailableMode();
                        }
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                };
                BoardComponent.prototype.cellValChanged = function (inCell) {
                    if (this.isDrawMode()) {
                        this.enablePlayButton = false;
                    }
                    this.errorMessage = null;
                    this.enablePlayButton = true;
                    if (!this.isDrawMode()) {
                        inCell.setSetAsInput(false);
                    }
                    try {
                        this._smartPlayer.checkConsistency(this.board);
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                };
                BoardComponent.prototype.handleError = function (inError) {
                    if (this.isDrawMode()) {
                        this.resetInput();
                        this.enablePlayButton = false;
                    }
                    if (inError instanceof inconsistency_1.Inconsistency) {
                        this.errorMessage = 'This Sudoku does not respect the rules of the game. Check and correct.';
                    }
                    else if (inError instanceof contraddiction_1.Contraddiction) {
                        this.errorMessage = 'Some cells have no allowed values.';
                    }
                    else if (inError instanceof unresolvable_1.Unresolvable) {
                        // if we get an Unresolvable exception while we attempt to find another solution, it means that
                        // the Sudoku has a solution (the one which we are starting from) but we do not find a new one
                        if (this.isFinishedMode()) {
                            this.setNoOtherSolutionsAvailableMode();
                        }
                        else {
                            this.errorMessage = 'This Sudoku can not be solved by me; check somewhere else if it has a solution';
                        }
                    }
                    else {
                        this.errorMessage = 'An unexpected error has occurred (' + inError.message + '). Insult the programmer.';
                    }
                };
                BoardComponent.prototype.resetInput = function () {
                    for (var i = 0; i < this.board.rows.length; i++) {
                        for (var j = 0; j < this.board.columns.length; j++) {
                            var thisCell = this.board.cells[i][j];
                            if (!thisCell.getSetAsInput()) {
                                thisCell.resetVal();
                            }
                        }
                    }
                };
                BoardComponent.prototype.initializeBoard = function () {
                    console.log('Initialize board');
                    this.errorMessage = null;
                    this.setDrawMode();
                };
                BoardComponent.prototype.resetBoard = function () {
                    console.log('Reset board');
                    this.board = new board_1.Board();
                    this.selectedImageFiles.nativeElement.value = '';
                    this.initializeBoard();
                };
                BoardComponent.prototype.setPlayMode = function () {
                    this.enablePlayButton = false;
                    this.mode = 'play';
                    for (var i = 0; i < this.board.rows.length; i++) {
                        for (var j = 0; j < this.board.columns.length; j++) {
                            var thisCell = this.board.cells[i][j];
                            if (thisCell.getSetAsInput()) {
                                thisCell.disabled = true;
                            }
                        }
                    }
                };
                BoardComponent.prototype.isPlayMode = function () {
                    return this.mode == 'play';
                };
                BoardComponent.prototype.setDrawMode = function () {
                    this.enableSolveButton = true;
                    this.enablePlayButton = true;
                    this.enableTryAnotherSolutionButton = false;
                    this.mode = 'draw';
                };
                BoardComponent.prototype.isDrawMode = function () {
                    return this.mode == 'draw';
                };
                BoardComponent.prototype.setFinishedMode = function () {
                    this.enablePlayButton = false;
                    this.enableSolveButton = false;
                    this.enableTryAnotherSolutionButton = true;
                    this.mode = 'finished';
                };
                BoardComponent.prototype.isFinishedMode = function () {
                    return this.mode == 'finished';
                };
                BoardComponent.prototype.setNoOtherSolutionsAvailableMode = function () {
                    this.enablePlayButton = false;
                    this.enableSolveButton = false;
                    this.enableTryAnotherSolutionButton = false;
                    this.mode = 'noOtherSolutionsAvailableMode';
                };
                BoardComponent.prototype.isNoOtherSolutionsAvailableMode = function () {
                    return this.mode == 'noOtherSolutionsAvailableMode';
                };
                BoardComponent.prototype.setUnresolvableMode = function () {
                    this.enablePlayButton = false;
                    this.enableSolveButton = false;
                    this.enableTryAnotherSolutionButton = false;
                    this.mode = 'unresolvableMode';
                };
                BoardComponent.prototype.isUnresolvableMode = function () {
                    return this.mode == 'unresolvableMode';
                };
                BoardComponent.prototype.getTitleMessage = function () {
                    var message;
                    if (this.isDrawMode()) {
                        message = 'Draw your Sudoku';
                    }
                    else if (this.isPlayMode()) {
                        message = 'Play this thing';
                    }
                    else if (this.isFinishedMode()) {
                        message = 'Good job!!!! Sudoku solved';
                    }
                    else if (this.isNoOtherSolutionsAvailableMode()) {
                        message = 'I tried hard, but I did not find any other solution. Sorry.';
                    }
                    return message;
                };
                BoardComponent.prototype.imageSelected = function (inEvent) {
                    console.log('file selected' + inEvent.target.value);
                    this.renderer.renderBoardImage(URL.createObjectURL(inEvent.target.files[0]), this.processRenderedInfo);
                };
                __decorate([
                    core_1.ViewChild('renderer'), 
                    __metadata('design:type', boardRenderer_component_1.SudokuRendererComponent)
                ], BoardComponent.prototype, "renderer", void 0);
                __decorate([
                    core_1.ViewChild('selectedImage'), 
                    __metadata('design:type', Object)
                ], BoardComponent.prototype, "selectedImageFiles", void 0);
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'board-cmp',
                        providers: [],
                        templateUrl: '../templates/board.html',
                        styleUrls: ['../styles/sudoku.css'],
                        inputs: ['board'],
                        directives: [cell_component_1.CellComponent, boardRenderer_component_1.SudokuRendererComponent],
                    }), 
                    __metadata('design:paramtypes', [player_1.Player])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});
/*function processRenderedInfo(inDigits: any) {
    console.log('digits -- ' + inDigits);
    if (inDigits) {
        for (var i = 0; i < this.boardComponent.board.rows.length; i++) {
            let thisRow = this.boardComponent.board.rows[i];
            for (var j = 0; j < thisRow.cells.length; j++) {
                if (inDigits[i][j]) {
                    thisRow.cells[j].val = inDigits[i][j];
                    thisRow.cells[j].setSetAsInput(true);
                }
            }
        }
    } else {
        this.boardComponent.errorMessage = "Couldn't find a sudoku board in that image.";
    }
}*/ 
//# sourceMappingURL=board.component.js.map