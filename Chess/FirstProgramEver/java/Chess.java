import java.io.*;
import java.util.*;

/**
 * @author Mark Russell
 * @author Eric Hansen
 * @version Final
 */
public class Chess {
    private static final ArrayList<String> colors = new ArrayList<>();
    private static volatile SquareGraphic graphic;

    static {
        colors.add("blue");
        colors.add("red");
        colors.add("white");
        colors.add("black");
        colors.add("purple");
        colors.add("green");
        colors.add("brown");
    }

    private Board board;
    private Map<Piece, Square> conditionalRange = new HashMap<>();
    private double currentTurn = 1;
    private boolean isGameOver = false;
    private boolean isWhiteInCheck = false;
    private boolean isBlackInCheck = false;
    private boolean hasBlackKingSideRookMoved = false;
    private boolean hasBlackQueenSideRookMoved = false;
    private boolean hasWhiteKingSideRookMoved = false;
    private boolean hasWhiteQueenSideRookMoved = false;
    private boolean hasWhiteKingMoved = false;
    private boolean hasBlackKingMoved = false;
    private Canvas canvas;
    private gamePGN pgn;

    private Chess(String color1, String color2) {
        board = new Board(this, color1, color2);
        canvas = new Canvas(this, board);
        graphic = canvas.getGraph();
    }

    /**
     * Begins the chess game. Asks for the user input of color.
     */
    public static void main(String[] args) throws IOException {
        String color1, color2;
        Scanner uin1 = new Scanner(System.in);
        do {
            System.out.println("Welcome to Chess. Please input one color you would like your board to be. \nWe have Blue, Green, Red, Purple, Black, White, and Brown");
            color1 = uin1.next().toUpperCase();
            System.out.println("Input a second color");
            color2 = uin1.next().toUpperCase();
        }
        while (!colors.contains(color1.toLowerCase()) || !colors.contains(color2.toLowerCase()));
        Chess game = new Chess(color1, color2);
        game.pgn = new gamePGN(game);
        System.out.println("Please input the number of minutes you would like the players to have, or type NO for no timer");
        String timer = uin1.next();
        if (!timer.equals("NO")) {
            int time = Integer.parseInt(timer);
            graphic.setMinutes1(time);
            graphic.setMinutes2(time);
            graphic.updateTime();
        } else {
            graphic.setMinutes1(1000000000);
            graphic.setMinutes2(1000000000);
            graphic.updateTime();
        }
        System.out.println("By the way, in our chess program, you can only castle by clicking on the king and then the rook, not the square.");
        //uin1.close();
    }

    /**
     * gets amd returns a specific special moves-only range mainly for en passant
     * 
     * @return returns a specific special moves-only range mainly for en passant
     */
    Map<Piece, Square> getConditionalRange() {
        return conditionalRange;
    }

    private boolean castle(Piece king, Piece rook) {
        if ((king.getPieceName().equals("WHITE KING") && (isWhiteInCheck() || isHasWhiteKingMoved() || (isHasWhiteQueenSideRookMoved() && isHasWhiteKingSideRookMoved()))) || (king.getPieceName().equals("BLACK KING") && (isBlackInCheck() || isHasBlackKingMoved() || (isHasBlackQueenSideRookMoved() && isHasBlackKingSideRookMoved())))) {
            return false;
        }
        int r = rook.getCurrentSquare().getRow();
        if ((rook.getCurrentSquare().getColumn() == 1 && rook.getCurrentSquare().getRow() == 1) || (rook.getCurrentSquare().getColumn() == 1 && rook.getCurrentSquare().getRow() == 8)) {
            if ((r == 1 && (isHasWhiteQueenSideRookMoved() || getBoard().getBoard()[r][2].isOccupied() || getBoard().getBoard()[r][3].isOccupied() || getBoard().getBoard()[r][4].isOccupied())) || (r == 8 && (isHasBlackQueenSideRookMoved() || getBoard().getBoard()[r][2].isOccupied() || getBoard().getBoard()[r][3].isOccupied() || getBoard().getBoard()[r][4].isOccupied()))) {
                return false;
            }

            for (int c = 1; c <= 2; c++) {
                move(king, getBoard().getBoard()[r][5 - c]);
                updateCheck();
                if ((r == 1 && isWhiteInCheck()) || (r == 8 && isBlackInCheck())) {
                    move(king, getBoard().getBoard()[r][5]);
                    updateCheck();
                    return false;
                }
            }
            move(rook, getBoard().getBoard()[r][4]);
            king.updateAllRanges();
            return true;
        } else if ((rook.getCurrentSquare().getColumn() == 8 && rook.getCurrentSquare().getRow() == 1) || (rook.getCurrentSquare().getColumn() == 8 && rook.getCurrentSquare().getRow() == 8)) {
            if ((r == 1 && (isHasWhiteKingSideRookMoved() || getBoard().getBoard()[r][6].isOccupied() || getBoard().getBoard()[r][7].isOccupied())) || (r == 8 && (isHasBlackKingSideRookMoved() || getBoard().getBoard()[r][6].isOccupied() || getBoard().getBoard()[r][7].isOccupied()))) {
                return false;
            }
            for (int c = 1; c <= 2; c++) {
                move(king, getBoard().getBoard()[r][5 + c]);
                updateCheck();
                if ((r == 1 && isWhiteInCheck()) || (r == 8 && isBlackInCheck())) {
                    move(king, getBoard().getBoard()[r][5]);
                    updateCheck();
                    return false;
                }
            }
            move(rook, getBoard().getBoard()[r][6]);
            king.updateAllRanges();
            return true;
        }
        return false;
    }

    private void move(Piece startPiece, Square endSquare) {
        startPiece.getCurrentSquare().setOccupied(false);
        startPiece.getCurrentSquare().setCurPiece(null);
        endSquare.setCurPiece(startPiece);
        endSquare.setOccupied(true);
        startPiece.setCurrentSquare(endSquare);
        startPiece.setColumn(endSquare.getColumn());
        startPiece.setRow(endSquare.getRow());
    }

    /**
     * gets and returns the current turn
     *
     * @return returns the current Turn
     */
    private double getCurrentTurn() {
        return currentTurn;
    }

    /**
     * If the game has ended, returns true. If the game is not over, returns false.
     *
     * @return If the game has ended, returns true. If the game is not over, returns false.
     */
    boolean isGameOver() {
        return isGameOver;
    }

    /**
     * Sets the current game state
     *
     * @param gameOver the current game state
     */
    private void setGameOver(boolean gameOver) {
        isGameOver = gameOver;
    }

    /**
     * Returns true if the black king has moved. Returns false otherwise.
     *
     * @return Returns true if the black king has moved. Returns false otherwise.
     */
    private boolean isHasBlackKingMoved() {
        return hasBlackKingMoved;
    }

    /**
     * Sets whether or not black king has moved
     *
     * @param hasBlackKingMoved whether or not black king has moved
     */
    private void setHasBlackKingMoved(boolean hasBlackKingMoved) {
        this.hasBlackKingMoved = hasBlackKingMoved;
    }

    /**
     * Returns true if the black king-side rook has moved. Returns false otherwise.
     *
     * @return Returns true if the black king-side rook has moved. Returns false otherwise.
     */
    private boolean isHasBlackKingSideRookMoved() {
        return hasBlackKingSideRookMoved;
    }

    /**
     * sets whether or not the black king side rook has moved
     *
     * @param hasBlackKingSideRookMoved whether or not black king side rook has moved
     */
    private void setHasBlackKingSideRookMoved(boolean hasBlackKingSideRookMoved) {
        this.hasBlackKingSideRookMoved = hasBlackKingSideRookMoved;
    }

    /**
     * Returns true if the black queen-side rook has moved. Returns false otherwise.
     *
     * @return Returns true if the black queen-side rook has moved. Returns false otherwise.
     */
    private boolean isHasBlackQueenSideRookMoved() {
        return hasBlackQueenSideRookMoved;
    }

    /**
     * sets whether or not the black queen side rook has moved
     *
     * @param hasBlackQueenSideRookMoved whether or not the black queen side rook has moved
     */
    private void setHasBlackQueenSideRookMoved(boolean hasBlackQueenSideRookMoved) {
        this.hasBlackQueenSideRookMoved = hasBlackQueenSideRookMoved;
    }

    /**
     * Returns true if the white king has moved. Returns false otherwise.
     *
     * @return Returns true if the white king has moved. Returns false otherwise.
     */
    private boolean isHasWhiteKingMoved() {
        return hasWhiteKingMoved;
    }

    /**
     * sets whether or not the white king has moved
     *
     * @param hasWhiteKingMoved whether or not the white king has moved
     */
    private void setHasWhiteKingMoved(boolean hasWhiteKingMoved) {
        this.hasWhiteKingMoved = hasWhiteKingMoved;
    }

    /**
     * Returns true if the white king-side rook has moved. Returns false otherwise.
     *
     * @return Returns true if the white king-side rook has moved. Returns false otherwise.
     */
    private boolean isHasWhiteKingSideRookMoved() {
        return hasWhiteKingSideRookMoved;
    }

    /**
     * Sets whether or not the white king side rook has moved
     *
     * @param hasWhiteKingSideRookMoved whether or not the white king side rook has moved
     */
    private void setHasWhiteKingSideRookMoved(boolean hasWhiteKingSideRookMoved) {
        this.hasWhiteKingSideRookMoved = hasWhiteKingSideRookMoved;
    }

    /**
     * Returns true if the white queen-side rook has moved. Returns false otherwise.
     *
     * @return Returns true if the white queen-side rook has moved. Returns false otherwise.
     */
    private boolean isHasWhiteQueenSideRookMoved() {
        return hasWhiteQueenSideRookMoved;
    }

    /**
     * Sets whether or not the white queen side rook has moved
     *
     * @param hasWhiteQueenSideRookMoved whether or not the white queen side rook has moved
     */
    private void setHasWhiteQueenSideRookMoved(boolean hasWhiteQueenSideRookMoved) {
        this.hasWhiteQueenSideRookMoved = hasWhiteQueenSideRookMoved;
    }

    /**
     * Updates the state of Check for Black and White
     */
    void updateCheck() {
        int blackR = 0, whiteR = 0, blackC = 0, whiteC = 0;
        for (int r = 1; r <= 8; r++) {
            for (int c = 1; c <= 8; c++) {
                if (getBoard().getBoard()[r][c].getCurPiece() != null && getBoard().getBoard()[r][c].getCurPiece().getPieceName().equals("BLACK KING")) {
                    blackR = r;
                    blackC = c;
                }
                if (getBoard().getBoard()[r][c].getCurPiece() != null && getBoard().getBoard()[r][c].getCurPiece().getPieceName().equals("WHITE KING")) {
                    whiteR = r;
                    whiteC = c;
                }
            }
        }
        for (int r = 1; r <= 8; r++) {
            for (int c = 1; c <= 8; c++) {
                if (getBoard().getBoard()[r][c].getCurPiece() != null && getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals("WHITE")) {
                    if (!getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") && getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(getBoard().getBoard()[blackR][blackC])) {
                        setBlackInCheck(true);
                        return;
                    } else if (getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") && getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(getBoard().getBoard()[blackR][blackC])) {
                        if (blackC != c) {
                            setBlackInCheck(true);
                            return;
                        }
                    }
                }
                if (getBoard().getBoard()[r][c].getCurPiece() != null && getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals("BLACK")) {
                    if (!getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") && getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(getBoard().getBoard()[whiteR][whiteC])) {
                        setWhiteInCheck(true);
                        return;
                    } else if (getBoard().getBoard()[r][c].getCurPiece().getPieceName().endsWith("PAWN") && getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(getBoard().getBoard()[whiteR][whiteC])) {
                        if (whiteC != c) {
                            setWhiteInCheck(true);
                            return;
                        }
                    }
                }
            }
        }
        setBlackInCheck(false);
        setWhiteInCheck(false);
    }

    /**
     * s
     * Gets and returns the Chess board
     *
     * @return returns the Chess board
     */
    Board getBoard() {
        return board;
    }

    /**
     * Gets and returns whether or not black is in check
     *
     * @return returns whether or not black is in check
     */
    boolean isBlackInCheck() {
        return isBlackInCheck;
    }

    /**
     * Sets whether or not black is in check
     *
     * @param blackInCheck whether or not black is in check
     */
    private void setBlackInCheck(boolean blackInCheck) {
        isBlackInCheck = blackInCheck;
    }

    /**
     * Gets and returns whether or not white is in check
     *
     * @return returns whether or not white is in check
     */
    boolean isWhiteInCheck() {
        return isWhiteInCheck;
    }

    /**
     * Sets whether or not white is in check
     *
     * @param whiteInCheck whether or not white is in check
     */
    private void setWhiteInCheck(boolean whiteInCheck) {
        isWhiteInCheck = whiteInCheck;
    }

    /**
     * Processes a turn. If the start piece and end square constitute a valid move, taking check and the range of <br>
     * the piece into account, completes the move and updates the board squares and pieces. Otherwise, restarts <br>
     * the players turn, keeps the board the same, and tells the player the move was invalid. <br>
     * If checkmate is reached, prints out which side won.
     *
     * @param startPiece The start piece that the player wants to move.
     * @param endSquare  The end square that the player wants to move the piece to.
     */
    void turn(Piece startPiece, Square endSquare) {
        boolean endHasPiece = false;
        boolean inRangeOfOther = false;
        boolean isInRangeRow = false;
        boolean isInRangeColumn = false;
        try {
            int endColumn = endSquare.getColumn();
            Square startSquare1 = startPiece.getCurrentSquare();
            Piece endPiece1;
            if (endSquare.isOccupied()) {
                endHasPiece = true;
                endPiece1 = endSquare.getCurPiece();
            } else {
                endPiece1 = null;
            }
            if (startPiece.getPieceName().equals("WHITE KING") && endSquare.isOccupied() && startPiece.getPieceColor().equals(endSquare.getCurPiece().getPieceColor()) && endSquare.getCurPiece().getPieceName().equals("WHITE ROOK") || startPiece.getPieceName().equals("BLACK KING") && endSquare.isOccupied() && startPiece.getPieceColor().equals(endSquare.getCurPiece().getPieceColor()) && endSquare.getCurPiece().getPieceName().equals("BLACK ROOK")) {
                if (castle(startPiece, endSquare.getCurPiece())) {
                    getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, false, endColumn == 8, endColumn == 1, false, startSquare1);
                    getPgn().writePGNToFile();
                    incrementCurrentTurn();
                    resetConditionalRange();
                    return;
                } else {
                    throw new Exception("0");
                }
            }
            if (startPiece.isValidMove(endSquare)) {
                try {
                    if (startPiece.getPieceColor().equals("WHITE") && endSquare.getRow() == 8 && startPiece.getPieceName().split(" ")[1].equals("PAWN")) {
                        Scanner tempScan = new Scanner(System.in);
                        System.out.println("please promote your pawn, BISHOP, KNIGHT, ROOK or QUEEN");
                        String input = tempScan.nextLine();
                        switch (input) {
                            case "BISHOP":
                                Piece promB = new Piece("WHITE BISHOP", endSquare, this);
                                endSquare.setCurPiece(promB);
                                endSquare.setOccupied(true);
                                promB.setCurrentSquare(endSquare);
                                promB.setRow(endSquare.getRow());
                                promB.setColumn(endSquare.getColumn());
                                startSquare1.setOccupied(false);
                                startSquare1.setCurPiece(null);
                                promB.updateAllRanges();
                                break;
                            case "KNIGHT":
                                Piece promK = new Piece("WHITE KNIGHT", endSquare, this);
                                endSquare.setCurPiece(promK);
                                endSquare.setOccupied(true);
                                promK.setCurrentSquare(endSquare);
                                promK.setRow(endSquare.getRow());
                                promK.setColumn(endSquare.getColumn());
                                startSquare1.setOccupied(false);
                                startSquare1.setCurPiece(null);
                                promK.updateAllRanges();
                                break;
                            case "ROOK":
                                Piece promR = new Piece("WHITE ROOK", endSquare, this);
                                endSquare.setCurPiece(promR);
                                endSquare.setOccupied(true);
                                promR.setCurrentSquare(endSquare);
                                promR.setRow(endSquare.getRow());
                                promR.setColumn(endSquare.getColumn());
                                startSquare1.setOccupied(false);
                                startSquare1.setCurPiece(null);
                                promR.updateAllRanges();
                                break;
                            case "QUEEN":
                                Piece promQueen = new Piece("WHITE QUEEN", endSquare, this);
                                endSquare.setCurPiece(promQueen);
                                endSquare.setOccupied(true);
                                promQueen.setCurrentSquare(endSquare);
                                promQueen.setRow(endSquare.getRow());
                                promQueen.setColumn(endSquare.getColumn());
                                startSquare1.setOccupied(false);
                                startSquare1.setCurPiece(null);
                                promQueen.updateAllRanges();
                                break;
                        }
                        //System.out.println("1");
                        //System.out.println("2");
                        this.updateCheck();
                        //System.out.println("3");
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, endSquare.getCurPiece(), endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        //System.out.println("4");
                        getPgn().writePGNToFile();
                        //System.out.println("5");
                        incrementCurrentTurn();
                        //System.out.println("6");
                        graphic.repaint();
                        resetConditionalRange();
                        return;
                    } else if ((startPiece.getPieceColor().equals("BLACK") && endSquare.getRow() == 1 && startPiece.getPieceName().split(" ")[1].equals("PAWN"))) {
                        Scanner tempScan = new Scanner(System.in);
                        System.out.println("please promote your pawn, BISHOP, KNIGHT, ROOK or QUEEN");
                        String input = tempScan.next();
                        switch (input) {
                            case "BISHOP":
                                Piece promB = new Piece("BLACK BISHOP", endSquare, this);
                                endSquare.setCurPiece(promB);
                                endSquare.setOccupied(true);
                                promB.setCurrentSquare(endSquare);
                                promB.setRow(endSquare.getRow());
                                promB.setColumn(endSquare.getColumn());
                                promB.updateAllRanges();
                                break;
                            case "KNIGHT":
                                Piece promK = new Piece("BLACK KNIGHT", endSquare, this);
                                endSquare.setCurPiece(promK);
                                endSquare.setOccupied(true);
                                promK.setCurrentSquare(endSquare);
                                promK.setRow(endSquare.getRow());
                                promK.setColumn(endSquare.getColumn());
                                promK.updateAllRanges();
                                break;
                            case "ROOK":
                                Piece promR = new Piece("BLACK ROOK", endSquare, this);
                                endSquare.setCurPiece(promR);
                                endSquare.setOccupied(true);
                                promR.setCurrentSquare(endSquare);
                                promR.setRow(endSquare.getRow());
                                promR.setColumn(endSquare.getColumn());
                                promR.updateAllRanges();
                                break;
                            case "QUEEN":
                                Piece promQueen = new Piece("BLACK QUEEN", endSquare, this);
                                endSquare.setCurPiece(promQueen);
                                endSquare.setOccupied(true);
                                promQueen.setCurrentSquare(endSquare);
                                promQueen.setRow(endSquare.getRow());
                                promQueen.setColumn(endSquare.getColumn());
                                promQueen.updateAllRanges();
                                break;

                        }
                        startSquare1.setOccupied(false);
                        startSquare1.setCurPiece(null);
                        this.updateCheck();
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, endSquare.getCurPiece(), endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        getPgn().writePGNToFile();
                        incrementCurrentTurn();
                        resetConditionalRange();
                        return;
                    }
                } catch (Exception e) {
                    this.getCanvas().getGraph().setCurPiece(null);
                    this.getCanvas().getGraph().setMoveStart(false);
                }
                for (int r = 1; r <= 8; ++r) {
                    for (int c = 1; c <= 8; ++c) {
                        if (getBoard().getBoard()[r][c].isOccupied()) {

                            if (getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals(startPiece.getPieceColor())) {
                                if (getBoard().getBoard()[r][c].getCurPiece().getPieceRange().contains(endSquare) && getBoard().getBoard()[r][c].getCurPiece().getPieceName().split(" ")[1].equals(startPiece.getPieceName().split(" ")[1]) && !getBoard().getBoard()[r][c].getCurPiece().equals(startPiece)) {
                                    inRangeOfOther = true;
                                    if(getBoard().getBoard()[r][c].getCurPiece().getRow() == endSquare.getRow()){
                                        isInRangeRow = true;
                                    }
                                    if(getBoard().getBoard()[r][c].getCurPiece().getCol() == endSquare.getColumn())
                                    {
                                        isInRangeColumn = true;
                                    }
                                }
                            }
                        }
                    }
                }
                Piece temp;
                Square startSquare = startPiece.getCurrentSquare();
                if (endSquare.isOccupied()) {
                    temp = endSquare.getCurPiece();
                } else {
                    temp = null;
                }
                endSquare.setOccupied(true);
                endSquare.setCurPiece(startPiece);
                startPiece.getCurrentSquare().setOccupied(false);
                startPiece.getCurrentSquare().setCurPiece(null);
                startPiece.setCurrentSquare(endSquare);
                startPiece.setRow(endSquare.getRow());
                startPiece.setColumn(endSquare.getColumn());
                startPiece.updateAllRanges();
                incrementCurrentTurn();
                this.updateCheck();
                if (this.isBlackInCheck()) {
                    ArrayList<Piece> listForCheckingCheckMate = new ArrayList<>();
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.getBoard().getBoard()[r][c].isOccupied() && this.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals("BLACK")) {
                                listForCheckingCheckMate.add(this.getBoard().getBoard()[r][c].getCurPiece());
                            }
                        }
                    }
                    boolean isCheckMate = true;
                    for (Piece p : listForCheckingCheckMate) {
                        ArrayList<Square> listForRange = new ArrayList<>();
                        listForRange.addAll(p.getPieceRange());
                        for (Square s : listForRange) {
                            isCheckMate = isCheckMate && !p.isValidMove(s);
                        }
                    }
                    this.setGameOver(isCheckMate);
                    if (isCheckMate && this.isBlackInCheck()) {
                        System.out.println("White Wins!");
                        graphic.repaint();
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        getPgn().writePGNToFile();
                        System.exit(1);
                    } else if (isCheckMate) {
                        System.out.println("Stalemate!");
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        getPgn().writePGNToFile();
                        System.exit(1);
                    }
                    if (startPiece.getPieceColor().equals("BLACK")) {
                        endSquare.setOccupied(temp != null);
                        endSquare.setCurPiece(temp);
                        startPiece.setCurrentSquare(startSquare);
                        startPiece.setRow(startSquare.getRow());
                        startPiece.setColumn(startSquare.getColumn());
                        startSquare.setOccupied(true);
                        startSquare.setCurPiece(startPiece);
                        startPiece.updateAllRanges();
                        this.updateCheck();
                        decrementCurrentTurn();
                    }
                }
                if (this.isWhiteInCheck()) {
                    ArrayList<Piece> listForCheckingCheckMate2 = new ArrayList<>();
                    for (int r = 1; r <= 8; r++) {
                        for (int c = 1; c <= 8; c++) {
                            if (this.getBoard().getBoard()[r][c].isOccupied() && this.getBoard().getBoard()[r][c].getCurPiece().getPieceColor().equals("WHITE")) {
                                listForCheckingCheckMate2.add(this.getBoard().getBoard()[r][c].getCurPiece());
                            }
                        }
                    }
                    boolean isCheckMate2 = true;
                    for (Piece p : listForCheckingCheckMate2) {
                        ArrayList<Square> listForRange = new ArrayList<>();
                        listForRange.addAll(p.getPieceRange());
                        for (Square s : listForRange) {
                            isCheckMate2 = isCheckMate2 && !p.isValidMove(s);
                        }
                    }
                    this.setGameOver(isCheckMate2);
                    if (isCheckMate2 && this.isWhiteInCheck()) {
                        System.out.println("Black Wins!");
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        getPgn().writePGNToFile();
                        System.exit(1);
                    } else if (isCheckMate2) {
                        System.out.println("Stalemate!");
                        getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
                        getPgn().writePGNToFile();
                        System.exit(1);
                    }
                    if (startPiece.getPieceColor().equals("WHITE")) {
                        endSquare.setOccupied(temp != null);
                        endSquare.setCurPiece(temp);
                        startPiece.setCurrentSquare(startSquare);
                        startPiece.setRow(startSquare.getRow());
                        startPiece.setColumn(startSquare.getColumn());
                        startSquare.setOccupied(true);
                        startPiece.updateAllRanges();
                        this.updateCheck();
                        decrementCurrentTurn();
                    }
                }
            } else {
                graphic.moveWasInvalid();
                System.out.println("Invalid move please try again");
            }
            if (startPiece.getPieceColor().equals("BLACK") && (!isHasBlackKingSideRookMoved() || !isHasBlackQueenSideRookMoved()) && startPiece.getPieceName().endsWith("ROOK")) {
                if (startPiece.getCurrentSquare().getRow() == 8) {
                    if (startPiece.getCurrentSquare().getColumn() == 1) {
                        setHasBlackQueenSideRookMoved(true);
                    } else {
                        setHasBlackKingSideRookMoved(true);
                    }
                }
            }
            if (startPiece.getPieceColor().equals("WHITE") && (!isHasWhiteKingSideRookMoved() || !isHasWhiteQueenSideRookMoved()) && startPiece.getPieceName().endsWith("ROOK")) {
                if (startPiece.getCurrentSquare().getRow() == 1) {
                    if (startPiece.getCurrentSquare().getColumn() == 1) {
                        setHasWhiteQueenSideRookMoved(true);
                    } else {
                        setHasWhiteKingSideRookMoved(true);
                    }
                }
            }
            if (startPiece.getPieceName().endsWith("KING")) {
                if (startPiece.getPieceColor().equals("WHITE")) {
                    setHasWhiteKingMoved(true);
                } else if (startPiece.getPieceColor().equals("BLACK")) {
                    setHasBlackKingMoved(true);
                }
            }
            if (getConditionalRange().containsValue(endSquare) && getConditionalRange().containsKey(startPiece)) {
                getBoard().getBoard()[endSquare.getRow() + (endSquare.getCurPiece().getPieceColor().equals("WHITE") ? -1 : 1)][endSquare.getColumn()].setOccupied(false);
                getBoard().getBoard()[endSquare.getRow() + (endSquare.getCurPiece().getPieceColor().equals("WHITE") ? -1 : 1)][endSquare.getColumn()].setCurPiece(null);
            }
            resetConditionalRange();
            if (startPiece.getPieceName().endsWith("PAWN") && Math.abs(endSquare.getRow() - startSquare1.getRow()) == 2) {
                if (endSquare.getColumn() +1 <= 8 && getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() + 1].isOccupied() && endSquare.isOccupied() && getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() + 1].getCurPiece().getPieceName().equals(endSquare.getCurPiece().getPieceColor().equals("WHITE") ? "BLACK" : "WHITE" + " PAWN")) {
                    getConditionalRange().put(getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() + 1].getCurPiece(), getBoard().getBoard()[endSquare.getRow() + (getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn()].getCurPiece().getPieceColor().equals("WHITE") ? -1 : 1)][endSquare.getColumn()]);
                }
                if (endSquare.getColumn() -1 >= 1 && getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() - 1].isOccupied() && endSquare.isOccupied() && getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() - 1].getCurPiece().getPieceName().equals(endSquare.getCurPiece().getPieceColor().equals("WHITE") ? "BLACK" : "WHITE" + " PAWN")) {
                    getConditionalRange().put(getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn() - 1].getCurPiece(), getBoard().getBoard()[endSquare.getRow() + (getBoard().getBoard()[endSquare.getRow()][endSquare.getColumn()].getCurPiece().getPieceColor().equals("WHITE") ? -1 : 1)][endSquare.getColumn()]);
                }

            }
            getPgn().addMoveToMap(isInRangeColumn, isInRangeRow, startPiece, endHasPiece && endPiece1 != null, false, false, inRangeOfOther, startSquare1);
            getPgn().writePGNToFile();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Invalid Move, Try again");
            this.getCanvas().getGraph().setCurPiece(null);
            this.getCanvas().getGraph().setMoveStart(false);
        }
    }

    private gamePGN getPgn() {
        return this.pgn;
    }

    private void decrementCurrentTurn() {
        this.currentTurn--;
    }

    private void incrementCurrentTurn() {
        this.currentTurn++;
    }

    private void resetConditionalRange() {
        this.conditionalRange.clear();
    }

    private Canvas getCanvas() {
        return this.canvas;
    }

    /**
     * Returns the color of the player whose turn it is.
     *
     * @return The color of the player whose turn it is.
     */
    String getTurnColor() {
        if (getCurrentTurn() % 2 == 0)
            return "BLACK";
        else
            return "WHITE";
    }
}
