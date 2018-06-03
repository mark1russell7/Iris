
import java.awt.*;

public class BasicDeckStyleGUI
{
    BackgroundGraphic background;
    CardGraphic curCard;



    class BackgroundGraphic
    {

    }

    class Deck
    {

    }

    class CardGraphic
    {
        Display.DisplayFigure card;
        Display.Animation nextAnimation;
        Display.Animation prevAnimation;
        Display display;
        Point point;
        Dimension dimension;
        Color color;
        boolean fill;
        BasicStroke stroke;

        void initializeCardGraphic(){
            card = Display.createEmptyDisplayFigureStatic();
            card.shape = new Rectangle(point, dimension);
            card.color = color;
            card.dimension = dimension;
            card.point = point;
            card.fill = fill;
            card.stroke = stroke;
        }

        /*
         * todo adding the graphic to the remove, then removing it
         */

        void initializeAnimations(){
            // todo animation for moving cards
        }
    }
}
