import {Cell} from './cell';
import {Unresolvable} from './unresolvable'

export class Decision {
    cell: Cell;
    index = 0;
    parent: Decision = null;
    affectedCells = new Array<Cell>();

    constructor(_cell: Cell, _parent: Decision)
    {
        this.cell = _cell;
        this.parent = _parent;
    }
    
    public isNextAvailable()
    {
        return this.index < this.cell.allowedValues.length;
    }

    public nextValue()
    {
        return this.cell.allowedValues[this.index];
    }

    public next()
    {
        this.cell.val = this.nextValue();
    }
    
    public change()
    {
        this.reset();
        if (this.isNextAvailable())
        {
            this.perform();
            return this;
        }
        else
        {
            if (this.isRoot())
                throw new Unresolvable("Unresolvable Sudoku");
            return this.parent.change();
        }
    }

    public reset()
    {
        this.cell.resetVal();
        for(var i = 0; i < this.affectedCells.length; i++)
        {
            let affectedCell = this.affectedCells[i];
            affectedCell.resetVal();
        }
    }

    public perform()
    {
        this.cell.val = this.nextValue();
        this.index++;
    }

    public isRoot()
    {
        return this.parent == null;
    }    
    
}