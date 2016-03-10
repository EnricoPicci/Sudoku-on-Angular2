import {SudokuException} from './sudokuException';

export class Inconsistency extends SudokuException
{
    constructor(_message: string) {
        super(_message);
    }
}