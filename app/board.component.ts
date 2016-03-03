import {Component} from 'angular2/core';

import {Board} from '../model/board';
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
    
    enableTryAnotherSolutionButton = false;
    
    constructor(private _smartPlayer: Player) {
        this.board = new Board()
    };
    
    solve() {
        this.errorMessage = null;
        try {
            this._smartPlayer.solve(this.board);
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
    
    private handleError(inError) {
        this.resetInput();
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
                if (!thisCell.valSetAsInput) {
                    thisCell.resetVal();
                }
            }
        }
    }
    
    resetBoard() {
        this.errorMessage = null;
        this.board = new Board();
    }

}