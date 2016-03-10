import {Player} from '../model/player'
import {Board} from '../model/board'
import {Cell} from '../model/cell'

export class TestPlayer {
    
    constructor() {
        this.createBoardAndSetValues();
        this.calculateAllowedValues();
        this.identifyAndSetValues();
        this.solve_1();
        this.solve_2();
        this.solve_3();
        this.solve_4();
        this.checkInconsistency();
        //this.solve_5();
        //this.solve_6();
        this.solve_7();
        this.solve_8();
        console.log('Test suite completed');
    }
    
    public createBoardAndSetValues() {
        let board = new Board();
        board.setValue(0,0,1);
        board.setValue(8,8,2);
        let cell: Cell;
        cell = board.rows[0].cells[0];
        if (cell.val != 1)
            throw new Error("Error in test");
        cell = board.columns[8].cells[8];
        if (cell.val != 2)
            throw new Error("Error in test");
        cell = board.squareSets[8].cells[8];
        if (cell.val != 2)
            throw new Error("Error in test");

        return board;
    }
    
    public calculateAllowedValues()
    {
        let allowedValues = this.createBoardAndSetValues().columns[8].cells[7].calculateAllowedValues();
        if (allowedValues.indexOf(2) >= 0)
            throw new Error("Error in test");
        if (allowedValues.length != 8)
            throw new Error("Error in test");
    }

    // create a board where the value of cell (0,7) is determined by the values present in row 0 and column 7
    protected createBoard1()
    {
        let board = new Board();
        // set the first 7 cells of row 0 with values from 1 to 7
        for (var i = 0; i < 7; i++)
        {
            board.setValue(0,i,i+1);
        }
        // set the 7th cell of row 4 with value 8
        board.setValue(4,7,8);
        return board;
    }

    public identifyAndSetValues()
    {
        let board = this.createBoard1();
        let cell = board.rows[0].cells[7];
        if(!cell.identifyAndSetValue())
            throw new Error("Error in test");
        if (cell.val != 9)
            throw new Error("Error in test");

        cell = board.rows[0].cells[8];
        if (cell.val != 0)
            throw new Error("Error in test");
    }
    
    public solve_1()
    {
        let player = new Player();
        let board = this.createBoard1();
        player.solve(board);

        let cell: Cell;
        cell = board.rows[0].cells[7];
        if (cell.val != 9)
            throw new Error("Error in test");
        cell = board.rows[0].cells[8];
        if (cell.val != 8)
            throw new Error("Error in test");
    }
    
    protected createBoard2()
    {
        let board = new Board();
        board.setValue(0,2,7);
        board.setValue(0,4,1);
        board.setValue(0,5,9);
        board.setValue(0,7,4);
        board.setValue(2,0,3);
        board.setValue(5,0,2);
        board.setValue(8,0,6);
        board.setValue(1,1,5);
        board.setValue(1,4,8);
        board.setValue(3,5,3);
        board.setValue(5,5,4);
        board.setValue(5,6,9);
        board.setValue(5,8,5);
        board.setValue(8,4,7);

        return board;
    }

    public solve_2()
    {
        let player = new Player();
        let board = this.createBoard2();
        player.solve(board);

        let cell: Cell;
        cell = board.rows[0].cells[0];
        if (cell.val != 8)
            throw new Error("Error in test");
        cell = board.rows[5].cells[4];
        if (cell.val != 6)
            throw new Error("Error in test");

    }
    
    protected createBoard3()
		{
			let board = new Board();
			board.setValue(2,1,5);
			board.setValue(2,3,3);
			board.setValue(2,4,2);
			board.setValue(2,5,7);
			board.setValue(3,2,3);
			board.setValue(3,3,9);
			board.setValue(3,4,8);
			board.setValue(3,5,4);
			board.setValue(3,6,7);
			board.setValue(3,7,6);
			board.setValue(4,3,7);
			board.setValue(4,5,1);
			board.setValue(5,2,7);
			board.setValue(5,3,2);
			board.setValue(5,5,5);
			board.setValue(5,6,1);
			board.setValue(6,1,2);
			board.setValue(6,7,3);
			board.setValue(7,0,5);
			board.setValue(7,1,7);
			board.setValue(7,7,8);
			board.setValue(7,8,6);

			return board;
		}

		public solve_3()
		{
			let player = new Player();
			let board = this.createBoard3();
			player.solve(board);
		}

		protected createBoard4()
		{
			let board = new Board();
			board.setValue(0,0,4);
			board.setValue(0,8,7);
			board.setValue(1,1,8);
			board.setValue(1,2,2);
			board.setValue(1,6,1);
			board.setValue(1,7,9);
			board.setValue(2,0,1);
			board.setValue(2,2,9);
			board.setValue(2,6,4);
			board.setValue(2,8,6);
			board.setValue(3,3,5);
			board.setValue(3,5,1);
			board.setValue(4,3,8);
			board.setValue(4,5,6);
			board.setValue(6,1,1);
			board.setValue(6,2,5);
			board.setValue(6,6,2);
			board.setValue(6,7,6);
			board.setValue(7,3,4);
			board.setValue(7,5,9);
			board.setValue(8,0,6);
			board.setValue(8,4,1);
			board.setValue(8,5,5);
			board.setValue(8,8,9);
			return board;
		}

		public solve_4()
		{
			let player = new Player();
			let board = this.createBoard4();
			player.solve(board);
			player.tryAnotherSolution(board);
		}
        
        protected createInconsistentBoard()
		{
			let board = new Board();
			board.setValue(0,0,4);
			board.setValue(0,8,7);
			board.setValue(0,3,4);
			return board;
		}

		public checkInconsistency()
		{
			let inconsistencyCought = false;
			let player = new Player();
			let board = this.createInconsistentBoard();
			try
			{
				player.solve(board);
			}
			catch(ex)
			{
				inconsistencyCought = true;
			}
			if (!inconsistencyCought)
				throw new Error("Error in test");
		}

		protected createBoard5()
		{
			let board = new Board();
			board.setValue(0,0,3);
			board.setValue(0,2,2);
			board.setValue(0,6,5);
			board.setValue(1,0,9);
			board.setValue(2,5,9);
			board.setValue(2,6,3);
			board.setValue(2,7,8);
			board.setValue(2,8,6);
			board.setValue(3,0,5);
			board.setValue(3,1,4);
			board.setValue(3,2,3);
			board.setValue(3,4,1);
			board.setValue(4,2,6);
			board.setValue(4,4,8);
			board.setValue(4,6,2);
			board.setValue(5,4,7);
			board.setValue(5,6,4);
			board.setValue(5,8,3);
			board.setValue(6,0,6);
			board.setValue(6,1,1);
			board.setValue(6,3,3);
			board.setValue(6,5,7);
			board.setValue(7,6,9);
			board.setValue(7,7,6);
			board.setValue(7,8,4);
//			board.setValue(8,2,8);
//			board.setValue(8,6,7);
//			board.setValue(8,8,1);

			return board;
		}

		public solve_5()
		{
			let player = new Player();
			let board = this.createBoard5();
			player.solve(board);
			let i = 0;
			while (true)
			{
				player.tryAnotherSolution(board);
				i++;
			}
		}

		protected createBoard6()
		{
			let board = new Board();
			board.setValue(0,0,8);
			board.setValue(0,1,4);
			board.setValue(0,7,9);
			board.setValue(0,8,7);
			board.setValue(1,3,8);
			board.setValue(1,5,9);
			board.setValue(2,3,6);
			board.setValue(2,5,5);
			board.setValue(3,4,1);
			board.setValue(4,0,3);
			board.setValue(4,1,5);
			board.setValue(4,3,9);
			board.setValue(4,5,8);
			board.setValue(4,7,2);
			board.setValue(4,8,1);
			board.setValue(5,1,2);
			board.setValue(5,2,6);
			board.setValue(5,6,9);
			board.setValue(5,7,7);
			board.setValue(7,2,4);
			board.setValue(7,6,1);
			board.setValue(8,2,9);
			board.setValue(8,6,7);

			return board;
		}

		public solve_6()
		{
			let player = new Player();
			let board = this.createBoard6();
			player.solve(board);
			let i = 0;
			while (true)
			{
				player.tryAnotherSolution(board);
				i++;
			}
		}
        
        protected createBoard7()
		{
			let board = new Board();
			board.setValue(0,3,6);
			board.setValue(0,5,4);
			board.setValue(0,7,9);
			board.setValue(1,4,5);
			board.setValue(1,6,1);
			board.setValue(1,8,6);
			board.setValue(2,0,6);
			board.setValue(2,1,3);
			board.setValue(2,5,8);
			board.setValue(2,6,5);
			board.setValue(2,7,7);
			board.setValue(3,1,1);
			board.setValue(3,3,8);
			board.setValue(3,4,4);
			board.setValue(3,6,9);
			board.setValue(3,8,7);
			board.setValue(4,0,3);
			board.setValue(4,3,1);
			board.setValue(4,5,6);
			board.setValue(4,8,2);
			board.setValue(5,0,8);
			board.setValue(5,2,4);
			board.setValue(5,4,7);
            board.setValue(5,5,5);
            board.setValue(5,7,3);
            board.setValue(6,1,2);
            board.setValue(6,2,3);
            board.setValue(6,3,5);
            board.setValue(6,7,1);
            board.setValue(6,8,8);
            board.setValue(7,0,5);
            board.setValue(7,2,7);
            board.setValue(7,4,8);
            board.setValue(8,1,8);
            board.setValue(8,3,7);
            board.setValue(8,5,2);

			return board;
		}
        
        public solve_7()
		{
			let player = new Player();
			let board = this.createBoard7();
			player.solve(board);
		}
        
        protected createBoard8()
		{
			let board = new Board();
			board.setValue(0,0,5);
			board.setValue(0,1,1);
			board.setValue(0,8,2);
            
            board.setValue(1,0,7);
            board.setValue(1,1,4);
            board.setValue(1,4,2);
            board.setValue(1,5,8);
            
            board.setValue(2,1,6);
            
            board.setValue(3,2,8);
            board.setValue(3,3,3);
            board.setValue(3,7,6);
            board.setValue(3,8,7);
            
            board.setValue(4,3,5);
            board.setValue(4,5,2);
            
            board.setValue(5,0,6);
            board.setValue(5,1,5);
            board.setValue(5,5,7);
            board.setValue(5,6,2);
            
            board.setValue(6,7,7);
            
            board.setValue(7,3,1);
            board.setValue(7,4,7);
            board.setValue(7,7,2);
            board.setValue(7,8,4);
            
            board.setValue(8,0,3);
            board.setValue(8,7,9);
            board.setValue(8,8,5);
			
			return board;
		}
        
        public solve_8()
		{
			let player = new Player();
			let board = this.createBoard8();
			player.solve(board);
		}
    
}

var testPlayer = new TestPlayer();

//module.exports = testPlayer;