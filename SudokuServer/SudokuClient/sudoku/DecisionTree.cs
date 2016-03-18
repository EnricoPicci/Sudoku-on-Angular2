using System;
using System.Collections;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for DecisionTree.
	/// </summary>
	public class DecisionTree
	{
		Board board;
		Decision root;
		Decision currentDecision;
		ArrayList decisionLog = new ArrayList();

		public DecisionTree(Board _board)
		{
			board = _board;
//			Cell cell = board.GetFirstUndefinedCell();
//			root = new Decision(cell);
//			currentDecision = root;
		}

		public void Reset()
		{
			while(currentDecision != null)
			{
				currentDecision.Reset();
				currentDecision = currentDecision.Parent;
			}
			currentDecision = root;
		}

		public void UndoLastDecision()
		{
			if(currentDecision != null)
			{
				currentDecision.Reset();
				currentDecision = currentDecision.Parent;
			}
		}

		public Decision NextDecision()
		{
			currentDecision = new Decision(board.GetFirstUndefinedCell(), currentDecision);
			if (root == null)
				root = currentDecision;
			currentDecision.Perform();
			decisionLog.Add("N " + currentDecision.Cell.ToString());
			return currentDecision;
		}

		public Decision ChangeDecision()
		{
			currentDecision = currentDecision.Change();
			decisionLog.Add("C " + currentDecision.Cell.ToString());
			return currentDecision;
		}

		public Decision Root
		{
			get {return root;}
		}

		public bool IsForBoard(Board _board)
		{
			return board == _board;
		}
	}
}
