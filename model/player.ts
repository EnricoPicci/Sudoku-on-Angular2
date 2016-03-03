import {DecisionTree} from './decisionTree'
import {Decision} from './decision'
import {Board} from './board'
import {RowColumnSet} from './rowColumnSet'
import {IterationExcess} from './iterationExcess'
import {Contraddiction} from './contraddiction'
import {Inconsistency} from './inconsistency'

export class Player {
    decisionTree: DecisionTree;
    
    maxIterations = 10000;
    
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
                    console.log(ex.message);
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
        
}