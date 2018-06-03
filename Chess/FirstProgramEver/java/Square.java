/**
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class Square {
    private Piece curPiece;
    private int row;
    private int column;
    private String color;
    private String name;
    private boolean isOccupied;

    /**
     * Constructor of class Square
     *
     * @param row-    row in which this square is located
     * @param column- column in which this square is located
     * @param color-  color of this square
     */
    Square(int row, int column, String color) {
        this.row = row;
        this.column = column;
        this.color = color;
        this.name = (row + "" + column);
        isOccupied = false;
        this.curPiece = null;
    }

    /**
     * Gets and returns the piece on this square or lack thereof
     *
     * @return returns the piece on this square or lack thereof
     */
    Piece getCurPiece() {
        return curPiece;
    }

    /**
     * Sets the current piece, or lack thereof on this square
     *
     * @param curPiece Piece, or lack thereof, to be set on this square
     */
    void setCurPiece(Piece curPiece) {
        this.curPiece = curPiece;
    }

    /**
     * Gets and returns the row on which the square is located
     *
     * @return returns the row on which the square is located
     */
    int getRow() {
        return row;
    }

    /**
     * Gets and returns whether or not this square has a piece on it
     *
     * @return returns whether or not this square has a piece on it
     */
    boolean isOccupied() {
        return isOccupied;
    }

    /**
     * Sets whether or not this square has a piece on it
     *
     * @param occupied- whether or not this square has a piece on it
     */
    void setOccupied(boolean occupied) {
        this.isOccupied = occupied;
    }

    /**
     * Gets and returns the column on which the square is located
     *
     * @return returns the column on which the square is located
     */
    int getColumn() {
        return column;
    }
}

