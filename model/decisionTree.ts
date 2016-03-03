import {Board} from './board';
import {Decision} from './decision'

export class DecisionTree {
    board: Board;
    root: Decision;
    currentDecision: Decision;
    decisionLog = new Array<string>();

    constructor(_board: Board)
    {
        this.board = _board;
    }
    
    public reset()
    {
        while(this.currentDecision != null)
        {
            this.currentDecision.reset();
            this.currentDecision = this.currentDecision.parent;
        }
        this.currentDecision = this.root;
    }

    public undoLastDecision()
    {
        if(this.currentDecision != null)
        {
            this.currentDecision.reset();
            this.currentDecision = this.currentDecision.parent;
        }
    }

    public nextDecision()
    {
        this.currentDecision = new Decision(this.board.getFirstUndefinedCell(), this.currentDecision);
        if (this.root == null)
            this.root = this.currentDecision;
        this.currentDecision.perform();
        this.decisionLog.push("N " + this.currentDecision.cell.toString());
        return this.currentDecision;
    }

    public changeDecision()
    {
        this.currentDecision = this.currentDecision.change();
        this.decisionLog.push("C " + this.currentDecision.cell.toString());
        return this.currentDecision;
    }

    public isForBoard(_board: Board)
    {
        return this.board == _board;
    }
    
}