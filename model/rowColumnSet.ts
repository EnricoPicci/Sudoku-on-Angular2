import {Cell} from './cell';

export class RowColumnSet {
    cells = new Array<Cell>(9);
    index: number;
    isInconsistent = false;

    constructor(_index: number)
    {
        this.index = _index;
    }

    public addCell(_cell: Cell)
    {
        let foundEmpty = false;
        for (var i = 0; i < 9; i ++)
        {
            if (this.cells[i] == null)
            {
                foundEmpty = true;
                this.cells[i] = _cell;
                break;
            }
        }
        if (!foundEmpty)
            throw new Error("Row_Column_Set already full");
    }

    public valuesSet()
    {
        let resp = new Array<number>();
        for (var i = 0; i < this.cells.length; i++)
        {
            let cell = this.cells[i];
            resp.push(cell.val);
        }
        return resp;
    }
 
}