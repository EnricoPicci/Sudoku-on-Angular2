import {Component, ViewChild} from 'angular2/core';

import {BoardComponent} from './board.component'
import {Board} from '../model/board'
import {Player} from '../model/player'

@Component({
    selector: 'double-board-cmp',
	providers: [],
    templateUrl: '../templates/doubleBoard.html',
    styleUrls: ['../styles/sudoku.css'],
    inputs: [],
	directives: [BoardComponent],
})
export class DoubleBoardComponent {
    public isNastyPlay = false;
    public boards = new Array<Board>();
    public nastyPlayer: Player;
    
    @ViewChild('boardComponent1') boardComponent1: BoardComponent;
    //@ViewChild('boardComponent2') boardComponent2: BoardComponent;
    
    ngOnInit() {
        this.boards[0] = new Board();
    }
    
    startPlayNasty() {
        this.boards[1] = this.boards[0].copy();
        this.isNastyPlay = true;
        this.nastyPlayer = new Player();
        this.nastyPlayer.setMessage('I am the nasty player');
        this.nastyPlayer.isAutomaticPlayer = true;
        //this.nastyPlayer.playNasty(this.boards[1]);
        setTimeout(() => {
            this.nastyPlayer.playNasty(this.boards[1]);
        }, 1
        )
        this.boardComponent1.displayConsole = false;
        this.boardComponent1.setPlayMode();
    }
}