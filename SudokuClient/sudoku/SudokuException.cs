using System;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for SudokuException.
	/// </summary>
	public class SudokuException : Exception
	{
		public SudokuException(string _message) : base(_message)
		{
		}
	}
}
