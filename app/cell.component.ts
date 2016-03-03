import {Component} from 'angular2/core';

import {Cell} from '../model/cell'

@Component({
    selector: 'cell-cmp',
	providers: [],
    template: `
        <div    [class.cellWithBottomBorder]="showBottomBorder()" 
                [class.cellWithRightBorder]="showRightBorder()">
            <input type="number" min="1" max="9" maxlength="1" class="cellClass"
                [class.inconsistent]="isInconsistent()"
                [class.hasNoAllowedValues]="cell.hasNoAllowedValues"
                [class.setAsInput]="cell.valSetAsInput"
                [value]="getCellVal()" (keyup)="setCellVal($event)" (change)="setCellValOnChange($event)">
        </div>
    `,
    styleUrls: ['../styles/sudoku.css'],
	directives: [],
    inputs: ['cell']
})
export class CellComponent {
    public cell: Cell;
    
    getCellVal() {
        let cellVal;
        if (this.cell.val > 0) {
            cellVal = this.cell.val;
        }
        return cellVal;
    }
    
    setCellVal(inEvent) {
        let lastKey = inEvent.keyCode;
        if (lastKey >= 49 && lastKey < 59) {
            this.cell.val = lastKey - 48;
            inEvent.target.value = this.cell.val;
            this.cell.valSetAsInput = true;
        } else {
            //inEvent.target.value = '1';
            inEvent.target.value = null;
            this.cell.val = 0;
        }
    }
    
    setCellValOnChange(inEvent) {
        let cellVal = inEvent.target.valueAsNumber;
        if (cellVal >= 0 && cellVal < 10) {
            this.cell.val = cellVal;
            this.cell.valSetAsInput = true;
        } else {
            this.cell.val = 0;
            var thisCell = this.cell;
            setTimeout(function() {
             thisCell.valSetAsInput = false;
            }, 0);
        }
    }
    
    showBottomBorder() {
        // the third and the sixth row need to have the bottom border drawn in order to show the inner boxes of the board
        // these rows have index 0 and 5
        return this.cell.row.index == 2 || this.cell.row.index == 5
    }
    
    showRightBorder() {
        // the third and the sixth column need to have the right border drawn in order to show the inner boxes of the board
        // these rows have index 0 and 5
        return this.cell.column.index == 2 || this.cell.column.index == 5
    }
    
    isInconsistent() {
        return this.cell.row.isInconsistent || this.cell.column.isInconsistent || this.cell.squareSet.isInconsistent;
    }
    
}