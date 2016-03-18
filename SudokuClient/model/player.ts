import {DecisionTree} from './decisionTree'
import {Decision} from './decision'
import {Board} from './board'
import {RowColumnSet} from './rowColumnSet'
import {Cell} from './cell'
import {IterationExcess} from './iterationExcess'
import {Contraddiction} from './contraddiction'
import {Inconsistency} from './inconsistency'

import {MessageRepositoryService} from '../app/messageRepository.service'

export class Player {
    decisionTree: DecisionTree;
    
    maxIterations = 1000000;
    
    // this is the array of the cells whose value has been identified 
    // during the solution process
    cellsSolved: Array<Cell>;
    // this is the index of the last cell that this player has set on the Board 
    // that represents the Sudoku we are playing
    lastCellSetIndex = -1;
    playInterval;
    
    myBoard: Board;
    
    message = "I am programmed to be a Sudoku player"
    isAutomaticPlayer = false;
    
    constructor(private _messageRepositoryService: MessageRepositoryService) {}
    
    public solve(_board: Board, _maxIterations?: number, _resetDecisionTree?: boolean)
    {
        if (_maxIterations == null) {
            _maxIterations = this.maxIterations;
        }
        if (_resetDecisionTree == null) {
            _resetDecisionTree = true;
        }
        let iterations = 0;
        
        this.checkConsistency(_board);

        this.setIdentifiedValues(_board);
        if (_board.isFinished())
            return iterations;

        if (_resetDecisionTree || this.decisionTree == null)
            this.decisionTree = new DecisionTree(_board);
        
        iterations = this.iterateSolution(_board, _maxIterations);

        this.checkConsistency(_board);

        return iterations;
    }
    
    public playNasty(_board: Board) {
        let shadowBoard = _board.copy();
        this.solve(shadowBoard);
        this.cellsSolved = this.getCellsSolvedShuffled(shadowBoard);
        this.myBoard = _board;
        this.isAutomaticPlayer = true;
        this.playInterval = setInterval(() => {
            this.lastCellSetIndex++;
            let thisCell = this.cellsSolved[this.lastCellSetIndex];
            this.myBoard.rows[thisCell.row.index].cells[thisCell.column.index].val = thisCell.val;
            if (this.lastCellSetIndex == (this.cellsSolved.length - 1)) {
                clearInterval(this.playInterval);
            }
            if (this.myBoard.isFinished()) {
                this.setMessage('I am done. Finished.');
            }
        }, 200 
        )
    }
    private getCellsSolvedShuffled(_board: Board) {
        let theCellsSolved = new Array<Cell>();
        for (var i = 0; i < _board.rows.length; i++) {
            let thisRow = _board.rows[i];
            for (var j = 0; j < thisRow.cells.length; j++) {
                // if the val of the cell has not been set as input (while drawing the Sudoku) then
                // it means that the val of the cell has been determined while solving the Sudoku
                if (!thisRow.cells[j].isValSetAsInput()) {
                    theCellsSolved.push(thisRow.cells[j]);
                }
            }
        }
        return this.shuffle(theCellsSolved);
    }
    //http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    public tryAnotherSolution(_board: Board, _maxIterations?: number)
    {
        if (_maxIterations == null) {
            _maxIterations = this.maxIterations;
        }
        if (this.decisionTree != null)
        {
            if (!this.decisionTree.isForBoard(_board))
                throw new Error("Decision tree for a different board");
            else
                this.decisionTree.changeDecision();
        }
        return this.iterateSolution(_board, _maxIterations);
    }
        
    public bringBackToOriginalBoardLayout(_board: Board)
    {
        if (this.decisionTree != null)
        {
            if (!this.decisionTree.isForBoard(_board))
                throw new Error("Decision tree for a different board");
            this.decisionTree.reset();
        }
    }

    public undoLastDecision(_board: Board)
    {
        if (this.decisionTree != null)
        {
            if (!this.decisionTree.isForBoard(_board))
                throw new Error("Decision tree for a different board");
            this.decisionTree.undoLastDecision();
        }
    }

    public iterateSolution(_board: Board, _maxIterations: number)
    {
        let iterations = 0;
        if (_maxIterations == null) {
            _maxIterations = this.maxIterations;
        }
        while (_board.notFinished())
        {
            if (iterations > _maxIterations)
            {
                throw new IterationExcess("Max number of iterations exceeded (" + iterations + ")");
            }
            iterations++;
            this.performNextDecision(_board);
        }
        return iterations;
    }

    public performNextDecision(_board: Board)
    {
        let decision = this.decisionTree.nextDecision();
        let hasContraddiction = false;
        do
        {
            try
            {
                hasContraddiction = false;
                this.setIdentifiedValues(_board, decision);
            }
            catch (ex)
            {
                if (ex instanceof Contraddiction) {
                    //console.log(ex.message);
                    decision = this.decisionTree.changeDecision();
                    hasContraddiction = true;                    
                } else {
                    throw(ex);
                }
            }
        }
        while (hasContraddiction);
    }

    public setIdentifiedValues(_board: Board, _decision?: Decision)
    {
        let performLoop;
        do 
        {
            performLoop = false;
            for (var i = 0; i < _board.cells.length; i++) {
                for(var j = 0; j < _board.cells.length; j++) {
                    let cell = _board.cells[i][j];
                    performLoop = performLoop || cell.identifyAndSetValue(_decision);
                }                
            }
        }
        while(performLoop);
    }

    public checkConsistency(_board: Board)
    {
        // first of all clean previous states
        for (var i = 0; i < _board.rows.length; i++)
        {
            _board.rows[i].isInconsistent = false;
        }
        for (var i = 0; i < _board.columns.length; i++)
        {
            _board.columns[i].isInconsistent = false;
        }
        for (var i = 0; i < _board.squareSets.length; i++)
        {
            _board.squareSets[i].isInconsistent = false;
        }
        // then check the consistency
        for (var i = 0; i < _board.rows.length; i++)
        {
            let row = _board.rows[i];
            this.checkConsistencyInRowColumnSet(row, "row");
        }
        for (var i = 0; i < _board.columns.length; i++)
        {
            let column = _board.columns[i];
            this.checkConsistencyInRowColumnSet(column, "column");
        }
        for (var i = 0; i < _board.squareSets.length; i++)
        {
            let squareSet = _board.squareSets[i];
            this.checkConsistencyInRowColumnSet(squareSet, "squareSet");
        }
    }
    
    protected checkConsistencyInRowColumnSet(_rowColumnSet: RowColumnSet, _type: string)
    {
        let oneToNine = new Array<string>(9);
        for (var i = 0; i < _rowColumnSet.cells.length; i++)
        {
            let cell = _rowColumnSet.cells[i];
            if (cell.isValueSet())
            {
                let val = cell.val;
                if (oneToNine[val-1] != null) {
                    _rowColumnSet.isInconsistent = true;
                    throw new Inconsistency("Inconsistency in " + _type + " " + _rowColumnSet.index);
                }
                else
                    oneToNine[val-1] = val.toString();
            }
        }
    }
    
    public getMessage() {
        return this.message;
    }
    public setMessage(inMessage: string) {
        this.message = inMessage;
    }
        
}