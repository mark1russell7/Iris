
import java.awt.*;
import java.util.HashMap;
import java.util.LinkedList;





/*
todo Make movement, and store current DisplayFigure
todo Try to make the current state dependent on object references, so as to
todo allow easy changes in future, ie moving the object only would require changing its position
todo rather than making an entire animation and then having to deal with hassle of overriding or whatever

 */



public class Elevator
{
    final Color doorColor = Color.LIGHT_GRAY;
    final Color frameColor = Color.BLACK;

    final int openDuration = 1000/Display.tickrate;
    Display.Animation openAnimation;
    final int closeDuration = 1000/Display.tickrate;
    Display.Animation closeAnimation;


    Display.DisplayFigure CurrentState;
    Display display;

    static int elevatorHeight = 100;
    static int elevatorWidth = (int)(elevatorHeight/1.2);

    Point position;

    Elevator(Display display, Point position){
        this.display = display;
        this.position = position;
        initializeOpen();
        initializeClose();
    }

    Elevator(Display display)
    {
        this(display,new Point(0,0));
    }

    boolean doorFill = true;
    BasicStroke doorStroke = new BasicStroke(2);

    private void setDFA(Shape shape, boolean fill, Point position, BasicStroke stroke, Dimension dimension, Display.DisplayFigure displayFigure, Color color)
    {
        displayFigure.shape = shape;
        displayFigure.fill = fill;
        displayFigure.point = position;
        displayFigure.stroke = stroke;
        displayFigure.color = color;
        displayFigure.dimension = dimension;
    }

    private void initializeOpen(){
        openAnimation = display.createEmptyAnimation();
        openAnimation.animations = new HashMap<>();
        for(int i = openDuration; i >= 0; --i)
        {
            Display.DisplayFigure leftDoor = display.createEmptyFigure();
            Display.DisplayFigure rightDoor = display.createEmptyFigure();
            Rectangle leftR = new Rectangle();
            leftR.setSize((elevatorWidth/2*i/openDuration), elevatorHeight);
            leftR.setLocation(position);
            Rectangle rightR = new Rectangle();
            rightR.setSize((elevatorWidth/2*i/openDuration), elevatorHeight);
            rightR.setLocation((int)position.getX()-elevatorWidth/2*i/openDuration + elevatorWidth, (int)position.getY());
            setDFA(leftR,doorFill,position,doorStroke,new Dimension((elevatorWidth/4*i/openDuration), elevatorHeight),leftDoor,doorColor);
            setDFA(rightR,doorFill,new Point((int)position.getX()+elevatorWidth*i/openDuration, (int)position.getY()),doorStroke,new Dimension((elevatorWidth/2*i/openDuration), elevatorHeight),rightDoor,doorColor);
            openAnimation.animations.putIfAbsent((long)openDuration-i, new LinkedList<>());
            openAnimation.animations.get((long)openDuration-i).offer(leftDoor);
            openAnimation.animations.get((long)openDuration-i).offer(rightDoor);
        }
    }
    private void initializeClose(){
        closeAnimation = display.createEmptyAnimation();
        closeAnimation.animations = new HashMap<>();
        for(int i = 0; i <= closeDuration; ++i)
        {
            Display.DisplayFigure leftDoor = display.createEmptyFigure();
            Display.DisplayFigure rightDoor = display.createEmptyFigure();
            Rectangle leftR = new Rectangle();
            leftR.setSize((elevatorWidth/2*i/closeDuration), elevatorHeight);
            leftR.setLocation(position);
            Rectangle rightR = new Rectangle();
            rightR.setSize((elevatorWidth/2*i/closeDuration), elevatorHeight);
            rightR.setLocation((int)position.getX()-elevatorWidth/2*i/closeDuration + elevatorWidth, (int)position.getY());
            setDFA(leftR,doorFill,position,doorStroke,new Dimension((elevatorWidth/4*i/closeDuration), elevatorHeight),leftDoor,doorColor);
            setDFA(rightR,doorFill,new Point((int)position.getX()+elevatorWidth*i/closeDuration, (int)position.getY()),doorStroke,new Dimension((elevatorWidth/2*i/closeDuration), elevatorHeight),rightDoor,doorColor);
            closeAnimation.animations.putIfAbsent((long)i, new LinkedList<>());
            closeAnimation.animations.get((long)i).offer(leftDoor);
            closeAnimation.animations.get((long)i).offer(rightDoor);
        }
    }

}
