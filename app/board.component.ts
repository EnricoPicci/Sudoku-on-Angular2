import {Component} from 'angular2/core';

import {Board} from '../model/board';
import {Cell} from '../model/cell'
import {Player} from '../model/player';
import {Inconsistency} from '../model/inconsistency';
import {Contraddiction} from '../model/contraddiction';

import {CellComponent} from './cell.component'

@Component({
    selector: 'board-cmp',
	providers: [],
    templateUrl: '../templates/board.html',
    styleUrls: ['../styles/sudoku.css'],
    inputs: ['board'],
	directives: [CellComponent],
})
export class BoardComponent {
    public board: Board;
    public errorMessage: string;
    
    public enableTryAnotherSolutionButton = false;
    public enablePlayButton = true;
    
    public mode;
    
    constructor(private _smartPlayer: Player) {
        this.resetBoard();
    };
    
    solve() {
        this.errorMessage = null;
        try {
            this._smartPlayer.solve(this.board);
            this.enableTryAnotherSolutionButton = true;
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    tryAnotherSolution() {
        try {
            this._smartPlayer.tryAnotherSolution(this.board);
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    cellValChanged(inCell: Cell) {
        this.errorMessage = null;
        this.enablePlayButton = true;
        if (!this.isDrawMode()) {
            inCell.setSetAsInput(false);
            /*var thisCell = inCell;
            setTimeout(function() {
                console.log('ddd');
                thisCell.setSetAsInput(false);
            }, 0);*/
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
        }
        this.enablePlayButton = false;
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
    }
    
    setPlayMode() {
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
        this.mode = 'draw';
    }
    isDrawMode() {
        return this.mode == 'draw';
    }
    
    getTitleMessage() {
        let message;
        if (this.isDrawMode()) {
            message = 'Draw your Sudoku';
        } else if (this.isPlayMode()) {
            message = 'Play this thing';
        }
        return message;
    }

}