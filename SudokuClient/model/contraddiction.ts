import {SudokuException} from './sudokuException';

export class Contraddiction extends SudokuException
{
    constructor(_message: string) {
        super(_message);
    }
}