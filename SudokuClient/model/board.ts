import {Cell} from './cell';
import {RowColumnSet} from './rowColumnSet'

export class Board {
    //cells = new Array<Cell>();
    cells: Cell[][];
    rows = new Array<RowColumnSet>(9);
    columns = new Array<RowColumnSet>(9);
    squareSets = new Array<RowColumnSet>(9);

    constructor()
    {
        for (var i = 0; i < 9; i++)
        {
            let row = new RowColumnSet(i);
            let column = new RowColumnSet(i);
            let squareSet = new RowColumnSet(i);
            this.rows[i] = row;
            this.columns[i] = column;
            this.squareSets[i] = squareSet;
        }
        
        this.cells = [];
        for (var i = 0; i < 9; i++)
        {
            this.cells[i] = [];
            for (var j = 0; j < 9; j++)
            {
                let row = this.rows[i];
                let column = this.columns[j];
                let squareSetIndex = this.getSquareSetIndex(i,j);
                let squareSet = this.squareSets[squareSetIndex];
                let cell = new Cell(this, row, column, squareSet);
                this.cells[i][j] = cell;
            }
        }
    }
    
    public setValue(row: number, column: number, val: number)
    {
        this.checkRowColumn(row, column);

        let cell = this.cells[row][column];
        if (cell.val > 0)
            throw new Error("Value for cell(" + row + "," + column + ") already set");

        cell.val = val;
    }

    protected getSquareSetIndex(row: number, column: number)
    {
        this.checkRowColumn(row, column);

        return Math.floor((row)/3)*3+Math.floor((column)/3);
    }

    protected checkRowColumn(row: number, column: number)
    {
        if (row < 0 || row > 8)
            throw new Error("Row must be in the range 0-8. The value is " + row);
        if (column < 0 || column > 8)
            throw new Error("Column must be in the range 0-8. The value is " + column);
    }
    
    public getFirstUndefinedCell()
    {
        let resp = null;
        for(var i = 0; i < this.rows.length; i++)
        {
            for(var j = 0; j < this.columns.length; j++) {
                let cell = this.cells[i][j];
                if (cell.val == 0)
                {
                    resp = cell;
                    return resp;
                }
            }
        }
        return resp;
    }
    
    public getFirstUndefinedCellSorted()
    {
        let resp = null;
        let cellsOrderedByDecresingComplexity = new Array<Cell>();
        for(var i = 0; i < this.rows.length; i++)
        {
            for(var j = 0; j < this.columns.length; j++) {
                let cell = this.cells[i][j];
                if (cell.val == 0)
                {
                    cellsOrderedByDecresingComplexity.push(this.cells[i][j]);
                }
            }
        }
        cellsOrderedByDecresingComplexity = cellsOrderedByDecresingComplexity.sort(function(a, b){
                return a.allowedValues.length - b.allowedValues.length;
            }
        );
        if (cellsOrderedByDecresingComplexity.length > 0) {
            resp = cellsOrderedByDecresingComplexity[0];
        }
        return resp;
        /*for(var i = 0; i < this.rows.length; i++)
        {
            for(var j = 0; j < this.columns.length; j++) {
                let cell = this.cells[i][j];
                if (cell.val == 0)
                {
                    resp = cell;
                    return resp;
                }
            }
        }
        return resp;*/
    }

    public isFinished()
    {
        return this.getFirstUndefinedCell() == null;
    }

    public notFinished()
    {
        return !this.isFinished();
    }
    
    public copy() {
        let copiedBoard = new Board();
        for (var i = 0; i < this.rows.length; i++) {
            let thisRow = this.rows[i];
            let copiedBoardRow = copiedBoard.rows[i];
            for (var j = 0; j < thisRow.cells.length; j++) {
                copiedBoardRow.cells[j].val = thisRow.cells[j].val;
                copiedBoardRow.cells[j].setValSetAsInput(thisRow.cells[j].isValSetAsInput());
            }
        }
        return copiedBoard;
    }
    
}