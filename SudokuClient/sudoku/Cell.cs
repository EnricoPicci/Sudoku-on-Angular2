using System;
using System.Collections;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Cell.
	/// </summary>
	public class Cell
	{
		protected int val = 0;
		protected Row_Column_Set row;
		protected Row_Column_Set column;
		protected Row_Column_Set squareSet;
		protected ArrayList allowedValues;

		public Cell(Row_Column_Set _row, Row_Column_Set _column, Row_Column_Set _squareSet)
		{
			row = _row;
			column = _column;
			squareSet = _squareSet;
			row.AddCell(this);
			column.AddCell(this);
			squareSet.AddCell(this);
		}

		public int Val
		{
			get{return val;}
//			set{val = value;}
			set
			{
				string a = "";
				if (row.Index == 5 && column.Index == 3)
					a = "";
				val = value;
			}
		}

		public ArrayList CalculateAllowedValues()
		{
			allowedValues = new ArrayList();
			if (IsValueSet())
				return allowedValues;

			ArrayList valuesInRow = row.ValuesSet();
			ArrayList valuesInColumn = column.ValuesSet();
			ArrayList valuesInSquareSet = squareSet.ValuesSet();
			for (int i = 1; i < 10; i++)
			{
				if (!valuesInRow.Contains(i) && 
					!valuesInColumn.Contains(i) && 
					!valuesInSquareSet.Contains(i))
						allowedValues.Add(i);
			}
			return allowedValues;
		}

		// returns true if the value of the cell is identified and set
		public bool IdentifyAndSetValue(Decision _decision)
		{
			if (IsValueSet())
				return false;
			CalculateAllowedValues();
			if (allowedValues.Count == 0)
				throw new Contraddiction("The cell (" + row.Index + "," + column.Index + ") has no allowed value") ;
			if (allowedValues.Count == 1)
			{
				Val = (int)allowedValues[0];
				if (_decision != null)
				{
					_decision.AffectedCells.Add(this);
				}
				return true;
			}
			return false;
		}

		public bool IdentifyAndSetValue()
		{
			return IdentifyAndSetValue(null);
		}

		public bool IsValueSet()
		{
			return Val > 0;
		}

		public void ResetVal()
		{
			Val = 0;
		}

		public ArrayList AllowedValues
		{
			get{return allowedValues;}
		}

		public override string ToString()
		{
			return row.Index + "," + column.Index + ", " + Val;
		}

		public string DisplayValue
		{
			get
			{
				string resp = "";
				if (Val > 0)
					resp = Val.ToString();
				return resp;
			}
		}
	}
}
