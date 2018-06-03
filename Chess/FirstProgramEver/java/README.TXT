This is a fully functional, two player, graphics based, interactive chess game/program.

Specifications:

	This game complies with all standard Chess rules as regulated by the World Chess Federation (FIDE)
		Ref: https://www.fide.com/

	This game features all standard Chess moves including pawn promotion, en-passant, castling and more!

	This game includes a user-defined timer, or lack thereof*
		!possible game times range from 1 minute per player to ~two billion minutes per player!

	This game features fully functional, elegantly designed Graphics, including 84 custom made pieces**
		7 color choices, a total of 42*** possible color combinations!
	
	Fully functional and very efficient Check, CheckMate and StaleMate detection

	Fully functional move validity detection

	A REAL TIME GAME to PGN converter, outputs in file named "LastGamePGN.out"
		Fully**** complies with standard PGN format 
			Ref: https://en.wikipedia.org/wiki/Portable_Game_Notation
		Example Output:
			1.f3 e5
			2.g4 Qh4#
			1-0
	
	
**** this PGN formatter does not include a header, this was a design choice by the creators of this program, email mj17.russell.personal@gmail.com to find out more!
*** 21 when not choosing the same color for both sides
**84 Pieces with 7 different possible background colors - 12 different pieces exist in a game of Chess
*choosing the option "NO" in the timer query results in a maximum game time of 1x10^9 minutes, for the longest game answer 2147483647