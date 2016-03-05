import {Component, ViewChild} from 'angular2/core';

import {Board} from '../model/board';
import {Cell} from '../model/cell'
import {Player} from '../model/player';
import {Inconsistency} from '../model/inconsistency';
import {Contraddiction} from '../model/contraddiction';

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
    
    public selectedFiles;
    
    public mode;
    
    constructor(private _smartPlayer: Player) {
        this.resetBoard();
    };
    
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
        } else {
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
    
    resetBoard() {
        this.errorMessage = null;
        this.board = new Board();
        this.setDrawMode();
        this.selectedFiles = null;
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
    
    getTitleMessage() {
        let message;
        if (this.isDrawMode()) {
            message = 'Draw your Sudoku';
        } else if (this.isPlayMode()) {
            message = 'Play this thing';
        } else if (this.isFinishedMode()) {
            message = 'Good job!!!! Sudoku solved';
        } else if (this.isNoOtherSolutionsAvailableMode()) {
            message = 'No other solution is possible';
        }
        return message;
    }
    
    imageSelected(inEvent) {
        console.log(inEvent);
        console.log(inEvent.value);
        console.log(inEvent.target.value);
        console.log(inEvent.target.files[0].name);
        console.log(URL.createObjectURL(inEvent.target.files[0]));
        //var theBoard = this.board;
        var theBoardComponent = this;
        this.renderer.renderBoardImage(URL.createObjectURL(inEvent.target.files[0]), processRenderedInfo, theBoardComponent);
    }

}

    
    function processRenderedInfo(inDigits: any) {
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
    }