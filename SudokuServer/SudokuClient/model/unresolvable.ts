import {SudokuException} from './sudokuException';

export class Unresolvable extends SudokuException
{
    constructor(_message: string) {
        super(_message);
    }
}