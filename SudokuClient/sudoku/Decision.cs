using System;
using System.Collections;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Decision.
	/// </summary>
	public class Decision
	{
		protected Cell cell;
		protected int index = 0;
		protected Decision parent = null;
		protected ArrayList affectedCells = new ArrayList();

		public Decision(Cell _cell, Decision _parent)
		{
			cell = _cell;
			parent = _parent;
		}

		public Decision(Cell _cell)
		{
			cell = _cell;
		}

		public bool IsNextAvailable()
		{
			return index < cell.AllowedValues.Count;
		}

		public int NextValue()
		{
			return (int)cell.AllowedValues[index];
		}

		public void Next()
		{
			cell.Val = NextValue();
		}

		public Decision Parent
		{
			get{return parent;}
		}

		public Decision Change()
		{
			Reset();
			if (IsNextAvailable())
			{
				Perform();
				return this;
			}
			else
			{
				if (IsRoot())
					throw new Unresolvable("Unresolvable Sudoku");
				return parent.Change();
			}
		}

		public void Reset()
		{
			cell.ResetVal();
			foreach (Cell affectedCell in AffectedCells)
			{
				affectedCell.ResetVal();
			}
		}

		public void Perform()
		{
			cell.Val = NextValue();
			index++;
		}

		public Cell Cell
		{
			get{return cell;}
		}

		public ArrayList AffectedCells
		{
			get{return affectedCells;}
		}

		public bool IsRoot()
		{
			return parent == null;
		}
	}
}
