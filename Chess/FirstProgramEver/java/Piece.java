import java.util.ArrayList;

/**
 * A chess piece
 *
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class Piece {
    private volatile Chess game;
    private volatile String pieceName;
    private volatile String pieceColor;
    private volatile int row;
    private volatile int column;
    private volatile Square currentSquare;
    private volatile ArrayList<Square> pieceRange;

    /**
     * Constructor of class Piece
     *
     * @param name-   name of this Piece
     * @param square- Square on which this piece is located
     * @param game-   game to which this piece belongs
     */
    Piece(String name, Square square, Chess game) {
        this.pieceColor = name.split(" ")[0];
        this.pieceName = name;
        this.currentSquare = square;
        this.pieceRange = new ArrayList<>();
        this.game = game;
        this.row = square.getRow();
        this.column = square.getColumn();
    }

    /**
     * Determines the legality of a move
     *
     * @param sqEnd- square to which the player desires to move his piece
     * @return returns whether or not the proposed move is valid and legal
     */
    boolean isValidMove(Square sqEnd) {
        this.updateAllRanges();
        game.updateCheck();
        if (this.getPieceColor().equals("BLACK") && !this.game.isBlackInCheck() || this.getPieceColor().equals("WHITE") && !this.game.isWhiteInCheck()) {
            return this.getPieceRange().contains(sqEnd);
        } else if (this.getPieceColor().equals("WHITE") && this.game.isWhiteInCheck() || this.getPieceColor().equals("BLACK") && this.game.isBlackInCheck()) {
            if (this.getPieceRange().contains(sqEnd)) {
                int tempR = this.getRow();
                int tempC = this.getCol();
                Piece tempEnd = sqEnd.getCurPiece();
                Square tempSquare = this.getCurrentSquare();
                int endR = sqEnd.getRow();
                int endC = sqEnd.getColumn();
                this.getCurrentSquare().setOccupied(false);
                this.getCurrentSquare().setCurPiece(null);
                this.setCurrentSquare(sqEnd);
                sqEnd.setCurPiece(this);
                sqEnd.setOccupied(true);
                this.setRow(endR);
                this.setColumn(endC);
                this.updateAllRanges();
                this.game.updateCheck();
                if (this.getPieceColor().equals("WHITE") && this.game.isWhiteInCheck() || this.getPieceColor().equals("BLACK") && this.game.isBlackInCheck()) {
                    this.setCurrentSquare(tempSquare);
                    this.setRow(tempR);
                    this.setColumn(tempC);
                    tempSquare.setCurPiece(this);
                    tempSquare.setOccupied(true);
                    sqEnd.setCurPiece(tempEnd);
                    sqEnd.setOccupied(tempEnd != null);
                    this.updateAllRanges();
                    this.game.updateCheck();
                    return false;
                } else {
                    this.setCurrentSquare(tempSquare);
                    this.setRow(tempR);
                    this.setColumn(tempC);
                    tempSquare.setCurPiece(this);
                    tempSquare.setOccupied(true);
                    sqEnd.setCurPiece(tempEnd);
                    sqEnd.setOccupied(tempEnd != null);
                    this.updateAllRanges();
                    this.game.updateCheck();
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Updates the stored valid moves for each piece
     */
    void updateAllRanges() {
        int whiteKingRow = 0, whiteKingColumn = 0, blackKingRow = 0, blackKingColumn = 0;
        for (int r = 1; r <= 8; r++) {
            for (int c = 1; c <= 8; c++) {
                if (!this.game.getBoard().getBoard()[r][c].isOccupied()) {
                    continue;
                }
                switch (this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName()) {
                    case "BLACK KING":
                        blackKingColumn = c;
                        blackKingRow = r;
                        break;
                    case "WHITE KING":
                        whiteKingColumn = c;
                        whiteKingRow = r;
                        break;
                    default:
                        this.game.getBoard().getBoard()[r][c].getCurPiece().updateRange();
                        break;
                }
            }
        }
        this.game.getBoard().getBoard()[whiteKingRow][whiteKingColumn].getCurPiece().updateRange();
        this.game.getBoard().getBoard()[blackKingRow][blackKingColumn].getCurPiece().updateRange();
    }

    private void updateRange() {
        switch (this.getPieceName()) {
            case "WHITE PAWN":
                ArrayList<Square> pRange = new ArrayList<>();
                pRange.clear();
                if (game.getConditionalRange().keySet().contains(this)) {
                    pRange.add(game.getConditionalRange().get(this));
                }
                if (this.getRow() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()].isOccupied()) {
                    pRange.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()]);
                }
                if (this.getRow() == 2 && !this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol()].isOccupied()) {
                    pRange.add(this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol()]);
                }
                if (this.getRow() + 1 <= 8 && this.getCol() + 1 <= 8 && this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1].isOccupied() && this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1].getCurPiece().getPieceColor().equals("BLACK")) {
                    pRange.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1]);
                }
                if (this.getRow() + 1 <= 8 && this.getCol() - 1 >= 1 && this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1].isOccupied() && this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1].getCurPiece().getPieceColor().equals("BLACK")) {
                    pRange.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1]);
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange);
                this.getPieceRange().retainAll(pRange);
                break;
            case "BLACK PAWN":
                ArrayList<Square> pRange1 = new ArrayList<>();
                pRange1.clear();
                if (game.getConditionalRange().keySet().contains(this)) {
                    pRange1.add(game.getConditionalRange().get(this));
                }
                if (this.getRow() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()].isOccupied()) {
                    pRange1.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()]);
                }
                if (this.getRow() == 7 && !this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol()].isOccupied()) {
                    pRange1.add(this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol()]);
                }
                if (this.getRow() - 1 >= 1 && this.getCol() + 1 <= 8 && this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1].isOccupied() && this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1].getCurPiece().getPieceColor().equals("WHITE")) {
                    pRange1.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1]);
                }
                if (this.getRow() - 1 >= 1 && this.getCol() - 1 >= 1 && this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1].isOccupied() && this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1].getCurPiece().getPieceColor().equals("WHITE")) {
                    pRange1.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1]);
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange1);
                this.getPieceRange().retainAll(pRange1);
                break;
            case "WHITE KNIGHT":
            case "BLACK KNIGHT":
                ArrayList<Square> pRange3 = new ArrayList<>();
                pRange3.clear();

                if (this.getRow() + 2 <= 8 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() + 1].isOccupied() || this.getRow() + 2 <= 8 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() + 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() + 1]);
                }
                if (this.getRow() + 2 <= 8 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() - 1].isOccupied() || this.getRow() + 2 <= 8 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() - 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() + 2][this.getCol() - 1]);
                }
                if (this.getRow() - 2 >= 1 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() + 1].isOccupied() || this.getRow() - 2 >= 1 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() + 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() + 1]);
                }
                if (this.getRow() - 2 >= 1 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() - 1].isOccupied() || this.getRow() - 2 >= 1 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() - 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() - 2][this.getCol() - 1]);
                }
                if (this.getRow() + 1 <= 8 && this.getCol() + 2 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 2].isOccupied() || this.getRow() + 1 <= 8 && this.getCol() + 2 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 2].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 2]);
                }
                if (this.getRow() - 1 >= 1 && this.getCol() + 2 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 2].isOccupied() || this.getRow() - 1 >= 1 && this.getCol() + 2 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 2].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 2]);
                }
                if (this.getRow() + 1 <= 8 && this.getCol() - 2 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 2].isOccupied() || this.getRow() + 1 <= 8 && this.getCol() - 2 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 2].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 2]);
                }
                if (this.getRow() - 1 >= 1 && this.getCol() - 2 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 2].isOccupied() || this.getRow() - 1 >= 1 && this.getCol() - 2 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 2].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    pRange3.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 2]);
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange3);
                this.getPieceRange().retainAll(pRange3);
                break;
            case "WHITE BISHOP":
            case "BLACK BISHOP":
                ArrayList<Square> pRange5 = new ArrayList<>();
                pRange5.clear();
                for (int right = 1; right + this.getCol() <= 8 && right + this.getRow() <= 8; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange5.add(this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int right = 1; right + this.getCol() <= 8 && this.getRow() - right >= 1; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange5.add(this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1 && left + this.getRow() <= 8; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange5.add(this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1 && this.getRow() - left >= 1; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange5.add(this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange5);
                this.getPieceRange().retainAll(pRange5);
                break;
            case "WHITE ROOK":
            case "BLACK ROOK":
                ArrayList<Square> pRange7 = new ArrayList<>();
                pRange7.clear();
                for (int right = 1; right + this.getCol() <= 8; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange7.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange7.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int up = 1; this.getRow() + up <= 8; up++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange7.add(this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()]);
                        if (this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int down = 1; this.getRow() - down >= 1; down++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange7.add(this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()]);
                        if (this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange7);
                this.getPieceRange().retainAll(pRange7);
                break;
            case "WHITE QUEEN":
            case "BLACK QUEEN":
                ArrayList<Square> pRange9 = new ArrayList<>();
                pRange9.clear();
                for (int right = 1; right + this.getCol() <= 8; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int up = 1; this.getRow() + up <= 8; up++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()]);
                        if (this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + up][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int down = 1; this.getRow() - down >= 1; down++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()]);
                        if (this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - down][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int right = 1; right + this.getCol() <= 8 && right + this.getRow() <= 8; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int right = 1; right + this.getCol() <= 8 && this.getRow() - right >= 1; right++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right]);
                        if (this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - right][this.getCol() + right].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1 && left + this.getRow() <= 8; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() + left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                for (int left = 1; this.getCol() - left >= 1 && this.getRow() - left >= 1; left++) {
                    if (!this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].isOccupied() || !this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                        pRange9.add(this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left]);
                        if (this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].isOccupied() && !this.game.getBoard().getBoard()[this.getRow() - left][this.getCol() - left].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange9);
                this.getPieceRange().retainAll(pRange9);
                break;
            case "WHITE KING":
            case "BLACK KING":
                ArrayList<Square> pRange11 = new ArrayList<>();
                pRange11.clear();
                boolean isC1 = false;
                if (this.getRow() + 1 <= 8 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1].isOccupied() || this.getRow() + 1 <= 8 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() + 1 && square.getColumn() == this.getCol() - 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() - 1]);
                    }
                }
                isC1 = false;
                if (this.getRow() + 1 <= 8 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1].isOccupied() || this.getRow() + 1 <= 8 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() + 1 && square.getColumn() == this.getCol() + 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol() + 1]);
                    }
                }
                isC1 = false;
                if (this.getRow() - 1 >= 1 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1].isOccupied() || this.getRow() - 1 >= 1 && this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() - 1 && square.getColumn() == this.getCol() - 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() - 1]);
                    }
                }
                isC1 = false;
                if (this.getRow() - 1 >= 1 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1].isOccupied() || this.getRow() - 1 >= 1 && this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() - 1 && square.getColumn() == this.getCol() + 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol() + 1]);
                    }
                }
                isC1 = false;
                if (this.getRow() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()].isOccupied() || this.getRow() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() + 1 && square.getColumn() == this.getCol())) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() + 1][this.getCol()]);
                    }
                }
                isC1 = false;
                if (this.getRow() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()].isOccupied() || this.getRow() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() - 1 && square.getColumn() == this.getCol())) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow() - 1][this.getCol()]);
                    }
                }
                isC1 = false;
                if (this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - 1].isOccupied() || this.getCol() - 1 >= 1 && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() - 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow()][this.getCol() - 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() && square.getColumn() == this.getCol() - 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() - 1]);
                    }
                }
                isC1 = false;
                if (this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + 1].isOccupied() || this.getCol() + 1 <= 8 && !this.game.getBoard().getBoard()[this.getRow()][this.getCol() + 1].getCurPiece().getPieceColor().equals(this.getPieceColor())) {
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.game.getBoard().getBoard()[r][c].getCurPiece() != null && !this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(this.getPieceColor()) && this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(this.game.getBoard().getBoard()[this.getRow()][this.getCol() + 1])) {
                                final int x = r;
                                final int y = c;
                                if (!this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") || this.game.getBoard().getBoard()[r][c].getCurPiece().getPieceRange().stream().anyMatch(square -> square.getColumn() != y && square.getRow() == this.getRow() && square.getColumn() == this.getCol() + 1)) {
                                    isC1 = true;
                                }
                            }
                        }
                    }
                    if (!isC1) {
                        pRange11.add(this.game.getBoard().getBoard()[this.getRow()][this.getCol() + 1]);
                    }
                }
                this.getPieceRange().removeAll(this.getPieceRange());
                this.getPieceRange().addAll(pRange11);
                this.getPieceRange().retainAll(pRange11);
                break;
        }
    }

    /**
     * Gets and returns the list of possible moves for a piece at the current time
     *
     * @return returns the list of possible moves for a piece at the current time
     */
    ArrayList<Square> getPieceRange() {
        return pieceRange;
    }

    /**
     * Gets and returns the current square on which this piece is located
     *
     * @return returns the current square on which this piece is located
     */
    Square getCurrentSquare() {
        return currentSquare;
    }

    /**
     * Sets the square on which this piece is currently located
     *
     * @param currentSquare- the square on which this piece is currently located
     */
    void setCurrentSquare(Square currentSquare) {
        this.currentSquare = currentSquare;
    }

    /**
     * Gets and returns the color of this piece
     *
     * @return returns the color of this piece
     */
    String getPieceColor() {
        return pieceColor;
    }

    /**
     * Gets and returns the name of this piece
     *
     * @return returns the name of this piece
     */
    String getPieceName() {
        return pieceName;
    }

    /**
     * Sets the column on which this piece is located
     *
     * @param column- the column on which this piece is located
     */
    void setColumn(int column) {
        this.column = column;
    }

    /**
     * Returns the row of the piece's current square
     *
     * @return the row of the piece's current square
     */
    int getRow() {
        return row;
    }

    /**
     * Sets the row in which this piece is located
     *
     * @param row the row in which this piece is located
     */
    void setRow(int row) {
        this.row = row;
    }

    /**
     * Returns the column of the piece's current square
     *
     * @return the column of the piece's current square
     */
    int getCol() {
        return column;
    }
}

