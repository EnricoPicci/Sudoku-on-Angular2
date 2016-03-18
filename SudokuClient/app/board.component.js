System.register(['angular2/core', 'angular2/http', '../model/board', '../model/player', '../model/inconsistency', '../model/contraddiction', '../model/unresolvable', './cell.component', './boardRenderer.component', '../environmentSettings/environment.service'], function(exports_1, context_1) {
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
    var core_1, http_1, board_1, player_1, inconsistency_1, contraddiction_1, unresolvable_1, cell_component_1, boardRenderer_component_1, environment_service_1;
    var BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
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
            },
            function (environment_service_1_1) {
                environment_service_1 = environment_service_1_1;
            }],
        execute: function() {
            BoardComponent = (function () {
                function BoardComponent(_environment, _http) {
                    var _this = this;
                    this._environment = _environment;
                    this._http = _http;
                    this.enableTryAnotherSolutionButton = false;
                    this.enableSolveButton = true;
                    this.enablePlayButton = true;
                    this.isAutomaticPlayer = false;
                    this.displayConsole = true;
                    this.iterations = 0;
                    this.processRenderedInfo = function (inDigits) {
                        console.log('this digits -- ' + inDigits);
                        if (inDigits) {
                            for (var i = 0; i < _this.board.rows.length; i++) {
                                var thisRow = _this.board.rows[i];
                                for (var j = 0; j < thisRow.cells.length; j++) {
                                    if (inDigits[i][j]) {
                                        thisRow.cells[j].val = inDigits[i][j];
                                        thisRow.cells[j].setValSetAsInput(true);
                                    }
                                }
                            }
                        }
                        else {
                            _this.errorMessage = "Couldn't find a sudoku board in that image.";
                        }
                    };
                }
                Object.defineProperty(BoardComponent.prototype, "setProposal", {
                    set: function (inPlayer) {
                        this.player = inPlayer;
                        if (inPlayer.isAutomaticPlayer) {
                            this.setAutomaticPlayerMode();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                BoardComponent.prototype.ngOnInit = function () {
                    if (!this.board) {
                        this.board = new board_1.Board();
                    }
                    if (!this.player) {
                        this.player = new player_1.Player();
                    }
                    this.initializeBoard();
                };
                BoardComponent.prototype.solve = function () {
                    this.errorMessage = null;
                    try {
                        this.iterations = this.player.solve(this.board);
                        this.setFinishedMode();
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                };
                BoardComponent.prototype.tryAnotherSolution = function () {
                    try {
                        this.iterations = this.player.tryAnotherSolution(this.board);
                        if (this.iterations == 0) {
                            this.setNoOtherSolutionsAvailableMode();
                        }
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                };
                BoardComponent.prototype.cellValChanged = function (inCell) {
                    /*if (this.isDrawMode()) {
                        this.enablePlayButton = false;
                    }*/
                    this.errorMessage = null;
                    this.enablePlayButton = true;
                    if (!this.isDrawMode()) {
                        inCell.setValSetAsInput(false);
                    }
                    try {
                        this.player.checkConsistency(this.board);
                    }
                    catch (ex) {
                        this.handleError(ex);
                    }
                    if (this.board.isFinished()) {
                        this.setFinishedMode();
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
                            if (!thisCell.isValSetAsInput()) {
                                thisCell.resetVal();
                            }
                        }
                    }
                };
                BoardComponent.prototype.initializeBoard = function () {
                    console.log('Initialize board');
                    this.errorMessage = null;
                    // the mode of the board could be set when setting the player
                    // this happens if the player is an utomatic player
                    if (!this.mode) {
                        this.setDrawMode();
                    }
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
                            if (thisCell.isValSetAsInput()) {
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
                BoardComponent.prototype.setAutomaticPlayerMode = function () {
                    this.isAutomaticPlayer = true;
                    this.mode = 'automaticPlayerMode';
                };
                BoardComponent.prototype.isAutomaticPlayerMode = function () {
                    return this.mode == 'automaticPlayerMode';
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
                    else if (this.isAutomaticPlayerMode()) {
                        message = this.player.getMessage();
                    }
                    return message;
                };
                BoardComponent.prototype.imageSelected = function (inEvent) {
                    console.log('file selected' + inEvent.target.value);
                    this.renderer.renderBoardImage(URL.createObjectURL(inEvent.target.files[0]), this.processRenderedInfo);
                };
                BoardComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var thisHtmlFormElement = this.imageForm.nativeElement;
                    var thisFormData = new FormData(thisHtmlFormElement);
                    //let thisFormData = new FormData(this.selectedImageFiles.nativeElement);
                    var selectedFileNativeElement = this.selectedImageFiles.nativeElement;
                    thisFormData.append('imageFile', selectedFileNativeElement.files[0], 'this.jpg');
                    console.log(this.imageForm);
                    console.log(thisHtmlFormElement);
                    console.log(thisFormData);
                    // need to use XMLHttpRequest (https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript)
                    // and not Angular2 Http client since support for FormData is not yet implemented
                    // http://stackoverflow.com/questions/35516110/http-post-binary-file-in-angular2
                    var XHR = new XMLHttpRequest();
                    // We define what will happen if the data are successfully sent
                    var resCB = function (event) {
                        console.log('response CB');
                        console.log('cb --- ' + event);
                        console.log(XHR.responseText);
                        var responseJSON = JSON.parse(XHR.responseText);
                        console.log('e' + responseJSON.error);
                        console.log('d' + responseJSON.digits);
                        if (responseJSON.error) {
                            console.log('em1 -- ' + _this.errorMessage);
                            _this.errorMessage = responseJSON.error;
                            console.log('em2 -- ' + _this.errorMessage);
                        }
                        else {
                            _this.processRenderedInfo(responseJSON.digits);
                        }
                    };
                    XHR.addEventListener("load", resCB);
                    /*XHR.addEventListener("load", function(event) {
                        //alert(event.target.responseText);
                        //alert('OK');
                        console.log('response');
                        console.log(event);
                        console.log(XHR.responseText);
                        let responseJSON = JSON.parse(XHR.responseText);
                        if (responseJSON.error.length > 0) {
                            this
                        } else {
                            
                        }
                    });*/
                    // We define what will happen in case of error
                    XHR.addEventListener("error", function (event) {
                        alert('Oups! Something goes wrong.');
                    });
                    // We setup our request
                    XHR.open("POST", this._environment.baseServiceUrl + 'ocrFile');
                    // The data sent are the one the user provide in the form
                    XHR.send(thisFormData);
                };
                __decorate([
                    core_1.ViewChild('renderer'), 
                    __metadata('design:type', boardRenderer_component_1.SudokuRendererComponent)
                ], BoardComponent.prototype, "renderer", void 0);
                __decorate([
                    core_1.ViewChild('imageForm'), 
                    __metadata('design:type', Object)
                ], BoardComponent.prototype, "imageForm", void 0);
                __decorate([
                    core_1.ViewChild('selectedImage'), 
                    __metadata('design:type', Object)
                ], BoardComponent.prototype, "selectedImageFiles", void 0);
                __decorate([
                    core_1.Input('player'), 
                    __metadata('design:type', player_1.Player), 
                    __metadata('design:paramtypes', [player_1.Player])
                ], BoardComponent.prototype, "setProposal", null);
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'board-cmp',
                        providers: [],
                        templateUrl: '../templates/board.html',
                        styleUrls: ['../styles/sudoku.css'],
                        inputs: ['board', 'player'],
                        directives: [cell_component_1.CellComponent, boardRenderer_component_1.SudokuRendererComponent],
                    }), 
                    __metadata('design:paramtypes', [environment_service_1.Environment, http_1.Http])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});
//# sourceMappingURL=board.component.js.map