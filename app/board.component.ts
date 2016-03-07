import {Component, ViewChild} from 'angular2/core';

import {Board} from '../model/board';
import {Cell} from '../model/cell'
import {Player} from '../model/player';
import {Inconsistency} from '../model/inconsistency';
import {Contraddiction} from '../model/contraddiction';
import {Unresolvable} from '../model/unresolvable'

import {CellComponent} from './cell.component'
import {SudokuRendererComponent} from './boardRenderer.component'

@Component({
    selector: 'board-cmp',
	providers: [],
    templateUrl: '../templates/board.html',
    styleUrls: ['../styles/sudoku.css'],
    inputs: ['board'],
	directives: [CellComponent, SudokuRendererComponent],
})
export class BoardComponent {
    @ViewChild('renderer') renderer: SudokuRendererComponent;
    public board: Board;
    public errorMessage: string;
    
    public enableTryAnotherSolutionButton = false;
    public enableSolveButton = true;
    public enablePlayButton = true;
    
    @ViewChild('selectedImage') selectedImageFiles;
    
    public mode;
    
    constructor(private _smartPlayer: Player) {
        this.board = new Board();
    };
    
    ngOnInit() {
        this.initializeBoard();
    }
    
    solve() {
        this.errorMessage = null;
        try {
            this._smartPlayer.solve(this.board);
            this.setFinishedMode();
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    tryAnotherSolution() {
        try {
            let iterations = this._smartPlayer.tryAnotherSolution(this.board);
            if (iterations == 0) {
                this.setNoOtherSolutionsAvailableMode();
            }
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    cellValChanged(inCell: Cell) {
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
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    private handleError(inError) {
        if (this.isDrawMode()) {
            this.resetInput();
            this.enablePlayButton = false;
        }
        if (inError instanceof Inconsistency) {
            this.errorMessage = 'This Sudoku does not respect the rules of the game. Check and correct.'
        } else if(inError instanceof Contraddiction) {
            this.errorMessage = 'Some cells have no allowed values.'
        } else if(inError instanceof Unresolvable) 
        {
            // if we get an Unresolvable exception while we attempt to find another solution, it means that
            // the Sudoku has a solution (the one which we are starting from) but we do not find a new one
            if (this.isFinishedMode()) {
                this.setNoOtherSolutionsAvailableMode();
            } else {
                this.errorMessage = 'This Sudoku can not be solved by me; check somewhere else if it has a solution'
            }
        } else
        {
            this.errorMessage = 'An unexpected error has occurred ('+inError.message+'). Insult the programmer.'
        }
    }
    
    resetInput() {
        for (var i = 0; i < this.board.rows.length; i++) {
            for (var j = 0; j < this.board.columns.length; j++) {
                let thisCell = this.board.cells[i][j];
                if (!thisCell.getSetAsInput()) {
                    thisCell.resetVal();
                }
            }
        }
    }
    
    initializeBoard() {
        console.log('Initialize board');
        this.errorMessage = null;
        this.setDrawMode();
    }
    
    resetBoard() {
        console.log('Reset board');
        this.board = new Board();
        this.selectedImageFiles.nativeElement.value = '';
        this.initializeBoard();
    }
    
    setPlayMode() {
        this.enablePlayButton = false;
        this.mode = 'play';
        for (var i = 0; i < this.board.rows.length; i++) {
            for (var j = 0; j < this.board.columns.length; j++) {
                let thisCell = this.board.cells[i][j];
                if (thisCell.getSetAsInput()) {
                    thisCell.disabled = true;
                }
            }
        }
    }
    isPlayMode() {
        return this.mode == 'play';
    }
    setDrawMode() {
        this.enableSolveButton = true;
        this.enablePlayButton = true;
        this.enableTryAnotherSolutionButton = false;
        this.mode = 'draw';
    }
    isDrawMode() {
        return this.mode == 'draw';
    }
    setFinishedMode() {
        this.enablePlayButton = false;
        this.enableSolveButton = false;
        this.enableTryAnotherSolutionButton = true;
        this.mode = 'finished';
    }
    isFinishedMode() {
        return this.mode == 'finished';
    }
    setNoOtherSolutionsAvailableMode() {
        this.enablePlayButton = false;
        this.enableSolveButton = false;
        this.enableTryAnotherSolutionButton = false;
        this.mode = 'noOtherSolutionsAvailableMode';
    }
    isNoOtherSolutionsAvailableMode() {
        return this.mode == 'noOtherSolutionsAvailableMode';
    }
    setUnresolvableMode() {
        this.enablePlayButton = false;
        this.enableSolveButton = false;
        this.enableTryAnotherSolutionButton = false;
        this.mode = 'unresolvableMode';
    }
    isUnresolvableMode() {
        return this.mode == 'unresolvableMode';
    }
    
    getTitleMessage() {
        let message;
        if (this.isDrawMode()) {
            message = 'Draw your Sudoku';
        } else if (this.isPlayMode()) {
            message = 'Play this thing';
        } else if (this.isFinishedMode()) {
            message = 'Good job!!!! Sudoku solved';
        } else if (this.isNoOtherSolutionsAvailableMode()) {
            message = 'I tried hard, but I did not find any other solution. Sorry.';
        }
        return message;
    }
    
    imageSelected(inEvent) {
        console.log('file selected' + inEvent.target.value);
        var theBoardComponent = this;
        this.renderer.renderBoardImage(URL.createObjectURL(inEvent.target.files[0]), this.processRenderedInfo, theBoardComponent);
    }
    
    public processRenderedInfo = (inDigits: any[]) => {
        console.log('this digits -- ' + inDigits);
        if (inDigits) {
            for (var i = 0; i < this.board.rows.length; i++) {
                let thisRow = this.board.rows[i];
                for (var j = 0; j < thisRow.cells.length; j++) {
                    if (inDigits[i][j]) {
                        thisRow.cells[j].val = inDigits[i][j];
                        thisRow.cells[j].setSetAsInput(true);
                    }
                }
            }
        } else {
            this.errorMessage = "Couldn't find a sudoku board in that image.";
        }
    }

}

    
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