import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

/**
 * Converts a game to a .out file which can be opened with a standard text editor, written in PGN complying format
 * <p>
 * Ref: https://www.chessclub.com/user/help/PGN-spec
 *
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class gamePGN {
    private int turnN = 0;
    private Chess game;
    private HashMap<Integer, String> pgn = new HashMap<>();

    gamePGN(Chess gameR) {
        this.game = gameR;
    }

    /**
     * Takes information on the last turn, and converts and stores it in PGN complying format
     *
     * @param startPiece            the piece being moved
     * @param wasCapture            whether or not a piece was captured during this turn
     * @param wasKingSideCastle     whether or not it was a king side castle move
     * @param wasQueenSideCastle    whether or not it was a queen side castle move
     * @param isInRangeOfOtherPiece whether the move was made that could have been made by another piece
     * @param startSquare           the starting square of the move
     */
    void addMoveToMap(boolean isCol, boolean isRow, Piece startPiece, boolean wasCapture, boolean wasKingSideCastle, boolean wasQueenSideCastle, boolean isInRangeOfOtherPiece, Square startSquare) {
        if (startPiece.getPieceColor().equals("WHITE")) {
            this.turnN++;
        }
        pgn.put(turnN, formatMoveAsPGN(isCol, isRow, startPiece, wasCapture, wasKingSideCastle, wasQueenSideCastle, isInRangeOfOtherPiece, startSquare));
    }

    private String formatMoveAsPGN(boolean isCol, boolean isRow, Piece startPiece, boolean wasCapture, boolean wasKingSideCastle, boolean wasQueenSideCastle, boolean isInRangeOfOtherPiece, Square startSquare) {
        int endRow = startPiece.getRow();
        int endColumn = startPiece.getCol();
        int startColumn = startSquare.getColumn();
        String moveText = startPiece.getPieceColor().equals("BLACK") ? pgn.get(turnN) + " " : String.format("%d.", turnN);
        if (!game.getBoard().getBoard()[endRow][endColumn].getCurPiece().getPieceName().equals(startPiece.getPieceName())) {
            return moveText + "" + (char) ((char) startSquare.getColumn() + 'a' - 1) + (startPiece.getPieceColor().equals("WHITE") ? "8" : "1") + "=" + (game.getBoard().getBoard()[endRow][endColumn].getCurPiece().getPieceName().endsWith("KNIGHT") ? "N" : game.getBoard().getBoard()[endRow][endColumn].getCurPiece().getPieceName().split(" ")[1].charAt(0));
        }
        if (wasKingSideCastle) {
            return moveText + "O-O";
        } else if (wasQueenSideCastle) {
            return moveText + "O-O-O";
        }
        char piece;
        switch (startPiece.getPieceName().split(" ")[1]) {
            case "KNIGHT":
                piece = 'N';
                break;
            default:
                piece = startPiece.getPieceName().split(" ")[1].charAt(0);
                break;
        }
        if (piece != 'P') {
            moveText = moveText + piece + "" + (isInRangeOfOtherPiece && isCol && !isRow ? startSquare.getRow() : isInRangeOfOtherPiece && isRow && !isCol ? ((char) ((char) (startColumn) + 'a' - 1)) : isInRangeOfOtherPiece && isCol && isRow ? ((char) ((char) (startColumn) + 'a' - 1)) + startSquare.getRow():"");
        } else if (wasCapture) {
            moveText = moveText + ((char) ((char) (startColumn) + 'a' - 1));
        }
        if (wasCapture) {
            moveText = moveText + 'x';
        }
        moveText = moveText + "" + ((char) ((char) (endColumn) + 'a' - 1)) + "" + endRow + "" + (game.isGameOver() && (game.isWhiteInCheck() || game.isBlackInCheck()) ? "#" : game.isGameOver() ? "*" : game.isWhiteInCheck() || game.isBlackInCheck() ? "+" : "");
        return moveText;
    }

    /**
     * Writes the current game in PGN complying format to a file named "LastGamePGN.out"
     *
     * @throws IOException Standard Error Declaration for methods which use Java I/O
     */
    void writePGNToFile() throws IOException {
        PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("LastGamePGN.out")));
        for (int i = 1; i <= turnN; ++i) {
            out.println(pgn.get(i));
        }
        if (game.isGameOver()) {
            if (game.isBlackInCheck()) {
                out.println("0-1");
            } else if (game.isWhiteInCheck()) {
                out.println("1-0");
            } else {
                out.println("1/2-1/2");
            }
        }
        out.close();
    }
}

