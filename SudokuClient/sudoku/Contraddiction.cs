using System;

namespace Sudoku_Core
{
	/// <summary>
	/// Summary description for Contraddiction.
	/// </summary>
	public class Contraddiction : SudokuException
	{
		public Contraddiction(string _message) : base(_message)
		{
		}
	}
}
