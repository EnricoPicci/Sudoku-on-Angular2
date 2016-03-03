using System;
using System.Collections;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Row_Column_Set.
	/// </summary>
	public class Row_Column_Set
	{
		protected Cell[] cells = new Cell[9];
		protected int index;

		public Row_Column_Set(int _index)
		{
			index = _index;
		}

		public void AddCell(Cell cell)
		{
			bool foundEmpty = false;
			for (int i = 0; i < 9; i ++)
			{
				if (cells[i] == null)
				{
					foundEmpty = true;
					cells[i] = cell;
					break;
				}
			}
			if (!foundEmpty)
				throw new Exception("Row_Column_Set already full");
		}

		public Cell[] Cells
		{
			get {return cells;}
		}

		public ArrayList ValuesSet()
		{
			ArrayList resp = new ArrayList();
			foreach (Cell cell in Cells)
			{
				resp.Add(cell.Val);
			}
			return resp;
		}

		public int Index
		{
			get{return index;}
		}
	}
}
