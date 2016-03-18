import {Component, ViewChild, Input} from 'angular2/core';
import {Http} from 'angular2/http';

import {Board} from '../model/board';
import {Cell} from '../model/cell'
import {Player} from '../model/player';
import {Inconsistency} from '../model/inconsistency';
import {Contraddiction} from '../model/contraddiction';
import {Unresolvable} from '../model/unresolvable'

import {CellComponent} from './cell.component'
import {SudokuRendererComponent} from './boardRenderer.component'

import {Environment} from '../environmentSettings/environment.service';

@Component({
    selector: 'board-cmp',
	providers: [],
    templateUrl: '../templates/board.html',
    styleUrls: ['../styles/sudoku.css'],
    inputs: ['board', 'player'],
	directives: [CellComponent, SudokuRendererComponent],
})
export class BoardComponent {
    @ViewChild('renderer') renderer: SudokuRendererComponent;
    public board: Board;
    public player: Player;
    public errorMessage: string;
    
    public enableTryAnotherSolutionButton = false;
    public enableSolveButton = true;
    public enablePlayButton = true;
    
    @ViewChild('imageForm') imageForm;
    @ViewChild('selectedImage') selectedImageFiles;
    
    public mode;
    
    public isAutomaticPlayer = false;
    public displayConsole = true;
    
    public iterations = 0;
    
    @Input('player') set setProposal(inPlayer: Player) {
        this.player = inPlayer;
        if (inPlayer.isAutomaticPlayer) {
            this.setAutomaticPlayerMode();
        }
    }
    
    constructor(private _environment: Environment, private _http: Http) {
    }
    
    ngOnInit() {
        if (!this.board) {
            this.board = new Board();
        }
        if (!this.player) {
            this.player = new Player();
        }
        this.initializeBoard();
    }
    
    solve() {
        this.errorMessage = null;
        try {
            this.iterations = this.player.solve(this.board);
            this.setFinishedMode();
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    tryAnotherSolution() {
        try {
            this.iterations = this.player.tryAnotherSolution(this.board);
            if (this.iterations == 0) {
                this.setNoOtherSolutionsAvailableMode();
            }
        } catch(ex) {
            this.handleError(ex);
        }
    }
    
    cellValChanged(inCell: Cell) {
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
        } catch(ex) {
            this.handleError(ex);
        }
        if (this.board.isFinished()) {
            this.setFinishedMode();
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
                if (!thisCell.isValSetAsInput()) {
                    thisCell.resetVal();
                }
            }
        }
    }
    
    initializeBoard() {
        console.log('Initialize board');
        this.errorMessage = null;
        // the mode of the board could be set when setting the player
        // this happens if the player is an utomatic player
        if (!this.mode) {
            this.setDrawMode();
        }
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
                if (thisCell.isValSetAsInput()) {
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
    setAutomaticPlayerMode() {
        this.isAutomaticPlayer = true;
        this.mode = 'automaticPlayerMode';
    }
    isAutomaticPlayerMode() {
        return this.mode == 'automaticPlayerMode';
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
        } else if (this.isAutomaticPlayerMode()) {
            message = this.player.getMessage();
        }
        return message;
    }
    
    imageSelected(inEvent) {
        console.log('file selected' + inEvent.target.value);
        this.renderer.renderBoardImage(URL.createObjectURL(inEvent.target.files[0]), this.processRenderedInfo);
    }
    
    public processRenderedInfo = (inDigits: any[]) => {
        console.log('this digits -- ' + inDigits);
        if (inDigits) {
            for (var i = 0; i < this.board.rows.length; i++) {
                let thisRow = this.board.rows[i];
                for (var j = 0; j < thisRow.cells.length; j++) {
                    if (inDigits[i][j]) {
                        thisRow.cells[j].val = inDigits[i][j];
                        thisRow.cells[j].setValSetAsInput(true);
                    }
                }
            }
        } else {
            this.errorMessage = "Couldn't find a sudoku board in that image.";
        }
    }
    
    public onSubmit() {
        let thisHtmlFormElement = this.imageForm.nativeElement;
        let thisFormData = new FormData(thisHtmlFormElement);
        //let thisFormData = new FormData(this.selectedImageFiles.nativeElement);
        let selectedFileNativeElement =this.selectedImageFiles.nativeElement;
        thisFormData.append('imageFile', selectedFileNativeElement.files[0], 'this.jpg')
        console.log(this.imageForm);
        console.log(thisHtmlFormElement);
        console.log(thisFormData);
        
        // need to use XMLHttpRequest (https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_forms_through_JavaScript)
        // and not Angular2 Http client since support for FormData is not yet implemented
        // http://stackoverflow.com/questions/35516110/http-post-binary-file-in-angular2
        var XHR = new XMLHttpRequest();
        // We define what will happen if the data are successfully sent
        var resCB = (event) => {
            console.log('response CB');
            console.log('cb --- ' + event);
            console.log(XHR.responseText);
            let responseJSON = JSON.parse(XHR.responseText);
            console.log('e' + responseJSON.error);
            console.log('d' + responseJSON.digits);
            if (responseJSON.error) {
                console.log('em1 -- ' + this.errorMessage);
                this.errorMessage = responseJSON.error;
                console.log('em2 -- ' + this.errorMessage);
            } else {
                this.processRenderedInfo(responseJSON.digits);
            }
        }
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
        XHR.addEventListener("error", function(event) {
        alert('Oups! Something goes wrong.');
        });
        // We setup our request
        XHR.open("POST", this._environment.baseServiceUrl + 'ocrFile');
        // The data sent are the one the user provide in the form
        XHR.send(thisFormData);
    }
    
    /*public resCB = (event) => {
        console.log('response CB');
        console.log('cb --- ' + event);
        console.log(XHR.responseText);
        let responseJSON = JSON.parse(XHR.responseText);
        if (responseJSON.error.length > 0) {
            this
        } else {
            
        }
    }*/

}

