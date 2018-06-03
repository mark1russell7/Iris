import javax.swing.*;

/**
 * Represents a graphics window.
 *
 * @author Eric Hansen
 * @author Mark Russell
 * @version Final
 */
public class Canvas {
    private SquareGraphic sqG;

    public Canvas(Chess game, Board board) {
        JFrame frame = new JFrame("");
        frame.setSize(1000, 1000);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setFocusable(true);
        frame.setResizable(true);
        sqG = new SquareGraphic(game, board);
        frame.add(sqG);
        frame.setVisible(true);
    }

    /**
     * Returns the current instance of the SquareGraphic class.
     *
     * @return the current instance of the SquareGraphic class.
     */
    SquareGraphic getGraph() {
        return sqG;
    }
}


