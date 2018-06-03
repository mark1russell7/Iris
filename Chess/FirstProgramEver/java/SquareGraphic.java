
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * The SquareGraphic class is responsible for printing and updating the board graphics, the timer,
 * and the piece graphics. It also detects and validates the actions made by the player on the window.
 *
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class SquareGraphic extends JPanel {
    private Board board;
    private Chess game;
    private boolean moveStart;
    private Piece curPiece;
    private Color color1;
    private Color color2;
    private int minutes1, seconds1, minutes2, seconds2;

    /**
     * Initializes an instance of SquareGraphic with the current board, game, colors, and time.
     *
     * @param pGame  The current game going on.
     * @param pBoard The current board being used.
     */
    public SquareGraphic(Chess pGame, Board pBoard) {
        board = pBoard;
        String colStr1 = board.COLOR_1;
        String colStr2 = board.COLOR_2;
        if (colStr1.equals("RED"))
            color1 = new Color(254, 0, 0);
        if (colStr1.equals("BLUE"))
            color1 = new Color(85, 105, 254);
        if (colStr1.equals("WHITE"))
            color1 = Color.white;
        if (colStr1.equals("BLACK"))
            color1 = Color.black;
        if (colStr1.equals("GREEN"))
            color1 = new Color(141, 220, 103);
        if (colStr1.equals("CLEAR"))
            color1 = Color.white;
        if (colStr1.equals("PURPLE"))
            color1 = new Color(107, 34, 142);
        if (colStr1.equals("BROWN"))
            color1 = new Color(101, 78, 11);

        if (colStr2.equals("RED"))
            color2 = new Color(254, 0, 0);
        if (colStr2.equals("BLUE"))
            color2 = new Color(85, 105, 254);
        if (colStr2.equals("WHITE"))
            color2 = Color.white;
        if (colStr2.equals("BLACK"))
            color2 = Color.black;
        if (colStr2.equals("GREEN"))
            color2 = new Color(141, 220, 103);
        if (colStr2.equals("CLEAR"))
            color2 = Color.white;
        if (colStr2.equals("PURPLE"))
            color2 = new Color(107, 34, 142);
        if (colStr2.equals("BROWN"))
            color2 = new Color(101, 78, 11);
        game = pGame;
        curPiece = null;
        moveStart = false;
        minutes1 = 5;
        minutes2 = 5;
        seconds1 = 0;
        seconds2 = 0;
        addMouseListener(new MouseAdapter() {
            /**
             * If the player is selecting the square he wants to move to, this method checks if it
             * is valid. If the player is selecting the piece he wants to move, this method checks
             * if that is a valid piece.
             * @param e The mouse action the player made.
             */
            public void mousePressed(MouseEvent e) {
                if (!moveStart) {
                    if (checkMoveStart(9 - (e.getY() / 50), e.getX() / 50)) {
                        moveStart = true;
                    }
                } else {
                    endMove(9 - (e.getY() / 50), e.getX() / 50);
                }
            }
        });
    }

    /**
     * Sets the minutes for Player 2 to have
     *
     * @param minutes1 the minutes for Player 1 to have
     */
    void setMinutes1(int minutes1) {
        this.minutes1 = minutes1;
    }

    /**
     * Sets the minutes for Player 1 to have
     *
     * @param minutes2 the minutes for Player 2 to have
     */
    void setMinutes2(int minutes2) {
        this.minutes2 = minutes2;
    }

    /**
     * sets the Current Piece for this turn/move
     *
     * @param curPiece the Current Piece for this turn/move
     */
    void setCurPiece(Piece curPiece) {
        this.curPiece = curPiece;
    }

    /**
     * sets whether or not the player has begun their move
     *
     * @param moveStart whether or not the player has begun their move
     */
    void setMoveStart(boolean moveStart) {
        this.moveStart = moveStart;
    }

    /**
     * Checks if the player has selected a piece that is on his team. If the player tried to
     * select an unoccupied square, this prints out that that square is not a piece. If the player
     * tried to select something outside the chess board, this prints out that that is out of bounds.
     * If the player tried to select a piece from the other team, this prints out that that piece is
     * the wrong color.
     *
     * @param row The row number of the point the player selected.
     * @param col The column number of the point the player selected.
     * @return Returns true if the player has selected a piece on his team.
     */
    private boolean checkMoveStart(int row, int col) {
        if (row < 1 || col > 8) {
            System.out.println("Out of Bounds");
            return false;
        }
        Square sqStart = board.pointToSquare(row, col);
        if (!sqStart.isOccupied()) {
            System.out.println("Not a piece");
            return false;
        }
        curPiece = sqStart.getCurPiece();
        if (!game.getTurnColor().equals(curPiece.getPieceColor())) {
            System.out.println("Wrong color");
            return false;
        }
        return true;
    }

    /**
     * Begins the processing of a complete move and prepares for the next player's turn and updates
     * the board.
     *
     * @param row The row number of the square the player wants to move his piece to.
     * @param col The column number of the square the player wants to move his piece to.
     */
    private void endMove(int row, int col) {
        Square endSq = board.pointToSquare(row, col);
        game.turn(curPiece, endSq);
        curPiece = null;
        moveStart = false;
        repaint();
    }

    /**
     * Restarts the player's turn.
     */
    void moveWasInvalid() {
        curPiece = null;
        moveStart = false;
    }

    /**
     * Draws the current state of the chess game, including the board, the pieces, and timers.
     *
     * @param g The graphical output of the window.
     */
    public void paintComponent(Graphics g) {
        try {
            Graphics2D window = (Graphics2D) g;
            for (int row = 8; row >= 1; row--) {
                for (int col = 1; col <= 8; col++) {
                    if (board.isSqFilled(row, col)) {
                        window.drawImage(board.getImage(row, col), col * 50, (9 - row) * 50, 50, 50, null);
                    } else {
                        window.setColor(Color.black);
                        Rectangle rect = new Rectangle(col * 50, (9 - row) * 50, 50, 50);
                        window.draw(rect);
                        if (row % 2 == col % 2) {
                            window.setColor(color1);
                        } else {
                            window.setColor(color2);
                        }
                        window.fill(rect);
                    }
                }
            }
            window.setColor(Color.black);
            Rectangle timer1 = new Rectangle(550, 100, 200, 100);
            Rectangle timer2 = new Rectangle(550, 300, 200, 100);
            window.setColor(Color.white);
            window.fill(timer1);
            window.fill(timer2);
            window.draw(timer1);
            window.draw(timer2);
            window.setColor(Color.black);
            String timeStr1 = minutes1 + ":";
            String timeStr2 = minutes2 + ":";
            if (seconds1 < 10)
                timeStr1 += 0 + "";
            if (seconds2 < 10)
                timeStr2 += 0 + "";
            timeStr1 += seconds1;
            timeStr2 += seconds2;
            window.setFont(new Font("TimesRoman", Font.PLAIN, 60));
            window.drawString(timeStr1, 590, 170);
            window.drawString(timeStr2, 590, 370);
        } catch (NullPointerException e) {
            return;
        }
    }

    /**
     * Updates the minutes and seconds left for each player each second.
     * If the time remaining runs out, prints out which player has won on time.
     */
    void updateTime() {
        while ((minutes1 > 0 || seconds1 > 0) && (minutes2 > 0 || seconds2 > 0)) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("oops");
            }
            String curTurn = game.getTurnColor();
            if (curTurn.equals("WHITE")) {
                if (seconds2 == 0) {
                    minutes2--;
                    seconds2 = 59;
                } else {
                    seconds2--;
                }
            } else {
                if (seconds1 == 0) {
                    minutes1--;
                    seconds1 = 59;
                } else {
                    seconds1--;
                }
            }
            repaint();
        }
        if (minutes1 == 0)
            System.out.println("White wins on time!");
        else
            System.out.println("Black wins on time!");
    }
}

