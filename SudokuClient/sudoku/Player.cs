using System;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Player.
	/// </summary>
	public class Player
	{
		protected DecisionTree decisionTree;

		protected static int MaxIterations = 10000;

		public Player()
		{
			//
			// TODO: Add constructor logic here
			//
		}

		public int Solve(Board _board)
		{
			return Solve(_board, MaxIterations);
		}

		public int Solve(Board _board, int _maxIterations)
		{
			return Solve(_board, _maxIterations, true);
		}

		public int TryAnotherSolution(Board _board)
		{
			return TryAnotherSolution(_board, MaxIterations);
		}

		public int TryAnotherSolution(Board _board, int _maxIterations)
		{
			if (decisionTree != null)
			{
				if (!decisionTree.IsForBoard(_board))
					throw new Exception("Decision tree for a different board");
				else
					decisionTree.ChangeDecision();
			}
			return IterateSolution(_board, _maxIterations);
		}

		public void BringBackToOriginalBoardLayout(Board _board)
		{
			if (decisionTree != null)
			{
				if (!decisionTree.IsForBoard(_board))
					throw new Exception("Decision tree for a different board");
				decisionTree.Reset();
			}
		}

		public void UndoLastDecision(Board _board)
		{
			if (decisionTree != null)
			{
				if (!decisionTree.IsForBoard(_board))
					throw new Exception("Decision tree for a different board");
				decisionTree.UndoLastDecision();
			}
		}

		protected int Solve(Board _board, int _maxIterations, bool _resetDecisionTree)
		{
			int iterations = 0;

			CheckConsistency(_board);

			SetIdentifiedValues(_board);
			if (_board.IsFinished())
				return iterations;

			if (_resetDecisionTree || decisionTree == null)
				decisionTree = new DecisionTree(_board);
			
			iterations = IterateSolution(_board, _maxIterations);

			CheckConsistency(_board);

			return iterations;
		}

		public int IterateSolution(Board _board, int _maxIterations)
		{
			int iterations = 0;
			while (_board.NotFinished())
			{
				if (iterations > _maxIterations)
				{
					throw new IterationExcess("Max number of iterations exceeded (" + iterations + ")");
				}
				iterations++;
				PerformNextDecision(_board);
			}
			return iterations;
		}

		public void PerformNextDecision(Board _board)
		{
			Decision decision = decisionTree.NextDecision();
			bool hasContraddiction = false;
			do
			{
				try
				{
					hasContraddiction = false;
					SetIdentifiedValues(_board, decision);
				}
				catch (Contraddiction contraddiction)
				{
					Console.Out.WriteLine(contraddiction.Message);
					decision = decisionTree.ChangeDecision();
					hasContraddiction = true;
				}
			}
			while (hasContraddiction);
		}

		public void SetIdentifiedValues(Board _board, Decision _decision)
		{
			bool performLoop;
			do 
			{
				performLoop = false;
				foreach (Cell cell in _board.Cells)
					performLoop = performLoop || cell.IdentifyAndSetValue(_decision);
			}
			while(performLoop);
		}

		public void SetIdentifiedValues(Board _board)
		{
			SetIdentifiedValues(_board, null);
		}

		public void CheckConsistency(Board _board)
		{
			foreach (Row_Column_Set row in _board.Rows)
			{
				CheckConsistencyInRowColumnSet(row, "row");
			}
			foreach (Row_Column_Set column in _board.Columns)
			{
				CheckConsistencyInRowColumnSet(column, "column");
			}
			foreach (Row_Column_Set squareSet in _board.SquareSets)
			{
				CheckConsistencyInRowColumnSet(squareSet, "squareSet");
			}
		}

		protected void CheckConsistencyInRowColumnSet(Row_Column_Set _rowColumnSet, string _type)
		{
			string[] oneToNine = new string[9];
			foreach (Cell cell in _rowColumnSet.Cells)
			{
				if (cell.IsValueSet())
				{
					int val = cell.Val;
					if (oneToNine[val-1] != null)
						throw new Inconsistency("Inconsistency in " + _type + " " + _rowColumnSet.Index);
					else
						oneToNine[val-1] = val.ToString();
				}
			}
		}
	}
}
