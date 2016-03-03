import {SudokuException} from './sudokuException';

export class IterationExcess extends SudokuException
{
    constructor(_message: string) {
        super(_message);
    }
}