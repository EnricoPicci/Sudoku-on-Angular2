import {Board} from './board';
import {RowColumnSet} from './rowColumnSet';
import {Contraddiction} from './contraddiction'
import {Decision} from './decision'

export class Cell {
    val = 0;
    board: Board;
    row: RowColumnSet;
    column: RowColumnSet;
    squareSet: RowColumnSet;
    allowedValues: Array<number>;
    
    hasNoAllowedValue = false;
    private valSetAsInput = false;
    disabled = false;

    constructor(_board: Board, _row: RowColumnSet, _column: RowColumnSet, _squareSet: RowColumnSet)
    {
        this.board = _board;
        this.row = _row;
        this.column = _column;
        this.squareSet = _squareSet;
        this.row.addCell(this);
        this.column.addCell(this);
        this.squareSet.addCell(this);
    }
    
    public calculateAllowedValues()
    {
        this.allowedValues = new Array<number>();
        if (this.isValueSet())
            return this.allowedValues;

        let valuesInRow = this.row.valuesSet();
        let valuesInColumn = this.column.valuesSet();
        let valuesInSquareSet = this.squareSet.valuesSet();
        for (var i = 1; i < 10; i++)
        {
            if (valuesInRow.indexOf(i) < 0 && 
                valuesInColumn.indexOf(i) < 0 && 
                valuesInSquareSet.indexOf(i) < 0)
                    this.allowedValues.push(i);
        }
        return this.allowedValues;
    }
    
    // returns true if the value of the cell is identified and set
    public identifyAndSetValue(_decision?: Decision)
    {
        this.hasNoAllowedValue = false;
        if (this.isValueSet())
            return false;
        this.calculateAllowedValues();
        if (this.allowedValues.length == 0) {
            this.hasNoAllowedValue = true;
            throw new Contraddiction("The cell (" + this.row.index + "," + this.column.index + ") has no allowed value");   
        }
        if (this.allowedValues.length == 1)
        {
            this.val = this.allowedValues[0];
            if (_decision != null)
            {
                _decision.affectedCells.push(this);
            }
            return true;
        }
        return false;
    }

    public isValueSet()
    {
        return this.val > 0;
    }    
    
    public resetVal()
    {
        this.val = 0;
    }
    
    public getSetAsInput() {
        return this.valSetAsInput;
    }
    public setSetAsInput(inBool: boolean) {
        this.valSetAsInput = inBool;
    }

    public toString()
    {
        return this.row.index + "," + this.column.index + ", " + this.val;
    }

    public displayValue()
    {
        let resp = "";
        if (this.val > 0)
            resp = this.val.toString();
        return resp;
    }
    
    public getBoard() {
        return this.board;
    }
    
}