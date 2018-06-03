import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class Board {
    final String COLOR_1;
    final String COLOR_2;
    private volatile Square[][] board = new Square[9][9];

    /**
     * Constructor of class Board
     *
     * @param game the game to which this getBoard() belongs
     */
    Board(Chess game, String color1, String color2) {
        boolean isBlack = true;
        COLOR_1 = color1;
        COLOR_2 = color2;
        for (int row = 1; row <= 8; ++row) {
            for (int column = 1; column <= 8; ++column) {
                String color;
                if (row <= 2) {
                    color = "WHITE ";
                } else {
                    color = "BLACK ";
                }
                getBoard()[row][column] = new Square(row, column, isBlack ? "BLACK" : "WHITE");
                switch (row) {
                    case 1:
                    case 8:
                        switch (column) {
                            case 1:
                            case 8:
                                getBoard()[row][column].setCurPiece(new Piece(color + "ROOK", getBoard()[row][column], game));
                                break;
                            case 2:
                            case 7:
                                getBoard()[row][column].setCurPiece(new Piece(color + "KNIGHT", getBoard()[row][column], game));
                                break;
                            case 3:
                            case 6:
                                getBoard()[row][column].setCurPiece(new Piece(color + "BISHOP", getBoard()[row][column], game));
                                break;
                            case 4:
                                getBoard()[row][column].setCurPiece(new Piece(color + "QUEEN", getBoard()[row][column], game));
                                break;
                            case 5:
                                getBoard()[row][column].setCurPiece(new Piece(color + "KING", getBoard()[row][column], game));
                                break;
                        }
                        getBoard()[row][column].setOccupied(true);
                        break;
                    case 2:
                    case 7:
                        getBoard()[row][column].setCurPiece(new Piece(color + "PAWN", getBoard()[row][column], game));
                        getBoard()[row][column].setOccupied(true);
                        break;
                }
                isBlack = !isBlack;
            }
            isBlack = !isBlack;
        }
    }

    /**
     * If the square indicated has a piece, returns true. Otherwise, returns false.
     *
     * @param row The given row number of the square.
     * @param col The given column number of the square.
     * @return Returns true if the square selected has a piece. Otherwise, returns false.
     */
    boolean isSqFilled(int row, int col) {
        return getBoard()[row][col].isOccupied();
    }

    /**
     * Finds the piece that occupies the given square. Retrieves the image of that
     * piece.
     *
     * @param row The given row number of the square.
     * @param col The given column number of the square.
     * @return The image at the given square. If a piece does not occupy the square or if the image
     * cannot be found, returns null.
     */
    BufferedImage getImage(int row, int col) {
        try {
            String imgStr = "";
            Square sq = getBoard()[row][col];
            Piece piece = sq.getCurPiece();
            String name = piece.getPieceName();
            String pieceType = piece.getPieceName().substring(name.indexOf(" ") + 1, name.length());
            String pieceColor = piece.getPieceColor();
            imgStr += pieceColor + "_" + pieceType;
            if ((row) % 2 == (col) % 2) {
                imgStr += "_" + COLOR_1;
            } else {
                imgStr += "_" + COLOR_2;
            }
            imgStr += ".jpg";
            try {
                return ImageIO.read(new File(imgStr));
            } catch (IOException ex) {
                ex.printStackTrace();
                return null;
            } catch (NullPointerException e) {
                return null;
            }
        } catch (NullPointerException e) {
            return null;
        }
    }

    /**
     * Gets the getBoard() that belongs to this game
     *
     * @return returns the getBoard() that belongs to this game
     */
    Square[][] getBoard() {
        return this.board;
    }

    /**
     * Converts the given point to the square that point is in on the chess getBoard().
     *
     * @param row The given row number of the point.
     * @param col The given column number of the column.
     * @return The square that the given point is in on the chess getBoard().
     */
    Square pointToSquare(int row, int col) {
        return getBoard()[row][col];
    }
}

