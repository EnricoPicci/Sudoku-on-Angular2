using System;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Board.
	/// </summary>
	public class Board
	{
		protected Cell[,] cells = new Cell[9,9];
		protected Row_Column_Set[] rows = new Row_Column_Set[9];
		protected Row_Column_Set[] columns = new Row_Column_Set[9];
		protected Row_Column_Set[] squareSets = new Row_Column_Set[9];

		public Board()
		{
			for (int i = 0; i < 9; i++)
			{
				Row_Column_Set row = new Row_Column_Set(i);
				Row_Column_Set column = new Row_Column_Set(i);
				Row_Column_Set squareSet = new Row_Column_Set(i);
				rows[i] = row;
				columns[i] = column;
				squareSets[i] = squareSet;
			}
			for (int i = 0; i < 9; i++)
			{
				for (int j = 0; j < 9; j++)
				{
					Row_Column_Set row = rows[i];
					Row_Column_Set column = columns[j];
					int squareSetIndex = GetSquareSetIndex(i,j);
					Row_Column_Set squareSet = squareSets[squareSetIndex];
					Cell cell = new Cell(row, column, squareSet);
					cells[i,j] = cell;
				}
			}
		}

		public void SetValue(int row, int column, int val)
		{
			CheckRowColumn(row, column);

			Cell cell = cells[row, column];
			if (cell.Val > 0)
				throw new Exception("Value for cell(" + row + "," + column + ") already set");

			cell.Val = val;
		}

		protected int GetSquareSetIndex(int row, int column)
		{
			CheckRowColumn(row, column);

			return (int)(Math.Floor((row)/3)*3+Math.Floor((column)/3));
		}

		protected void CheckRowColumn(int row, int column)
		{
			if (row < 0 || row > 8)
				throw new Exception("Row must be in the range 0-8. The value is " + row);
			if (column < 0 || column > 8)
				throw new Exception("Column must be in the range 0-8. The value is " + column);
		}

		public Row_Column_Set[] Rows
		{
			get{return rows;}
		}

		public Row_Column_Set[] Columns
		{
			get{return columns;}
		}

		public Row_Column_Set[] SquareSets
		{
			get{return squareSets;}
		}

		public Cell[,] Cells
		{
			get{return cells;}
		}

		public Cell GetFirstUndefinedCell()
		{
			Cell resp = null;
			foreach(Cell cell in Cells)
			{
				if (cell.Val == 0)
				{
					resp = cell;
					break;
				}
			}
			return resp;
		}

		public bool IsFinished()
		{
			return GetFirstUndefinedCell() == null;
		}

		public bool NotFinished()
		{
			return !IsFinished();
		}
	}
}
