
import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.*;
import java.util.Queue;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * todo save to side, and create a dummy, experiment with matrix of linked lists to avoid overlap easily
 */

public class Display extends Canvas implements Runnable {
    static int tickrate = 50;
    static TimeUnit tickUnit = TimeUnit.MILLISECONDS;
    JFrame jFrame = new JFrame();
    Map<Long, Queue<Animation>> animationSet = new HashMap<>();
    Map<Long, Queue<DisplayFigure>> stillSet = new HashMap<>();
    volatile long curTick = -1;
    ScheduledThreadPoolExecutor tick = new ScheduledThreadPoolExecutor(1);
    Set<DisplayFigure> keep = new HashSet<>();
    Set<Animation> repeat = new HashSet<>();
    Map<Long, Set<DisplayFigure>> remove = new HashMap<>();
    {
        jFrame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                jFrame.dispose();
            }
        });
        jFrame.add(this);
        jFrame.setSize(1920, 1080);
        jFrame.setVisible(true);
    }

    private DisplayStatistics displayStatistics = new DisplayStatistics(this);


    static DisplayFigure createEmptyDisplayFigureStatic(){
        return new Display().createEmptyFigure();
    }
    static Animation createEmptyAnimationStatic(){
        return new Display().createEmptyAnimation();
    }


    public static void main(String[] args) {
        Display display = new Display();
        Color testColor = Color.BLACK;
        BasicStroke testStroke = new BasicStroke(4);
        Point testPoint = new Point(50, 50);
        Dimension testDimension = new Dimension(100, 100);
        boolean testFill = true;
        Rectangle testRectangle = new Rectangle(testPoint, testDimension);
        DisplayFigure testFigure = display.createFigure(testRectangle, testColor, testStroke, testPoint, testDimension, testFill);

        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 10; ++j) {
                display.ElevatorFactory(i * Elevator.elevatorWidth + i, j * Elevator.elevatorHeight + j);
                DisplayFigure displayFigure = display.createFigure(new Rectangle(i * Elevator.elevatorWidth + i, j * Elevator.elevatorHeight + j, Elevator.elevatorWidth, Elevator.elevatorHeight)
                        , Color.BLACK, new BasicStroke(1), new Point(i * Elevator.elevatorWidth + i, j * Elevator.elevatorHeight + j), new Dimension(Elevator.elevatorWidth, Elevator.elevatorHeight), false);
                display.addStill(displayFigure, 30);
            }
        }


        display.start();


        System.out.println("STARTED");
        while (!display.tick.isTerminated()) ;
        System.out.println("ENDED--OOPS!");
    }

    @Override
    public void paint(Graphics g) {

        long curTick2 = curTick;
        if(remove.containsKey(curTick2)) {
            remove.get(curTick2).forEach(this::removeStill);
            remove.remove(curTick2);
        }
        if (animationSet.containsKey(curTick2 - 1))
            animationSet.remove(curTick2 - 1);
        Graphics2D graphics2D = (Graphics2D) g;
        for (DisplayFigure displayFigure : keep) {
            graphics2D.setStroke(displayFigure.stroke);
            graphics2D.setColor(displayFigure.color);
            if (displayFigure.fill)
                graphics2D.fill(displayFigure.shape);
            else
                graphics2D.draw(displayFigure.shape);
        }
        if (stillSet.containsKey(curTick2)) {
            Queue<DisplayFigure> stills = stillSet.get(curTick2);
            for (DisplayFigure figure : stills) {
                graphics2D.setStroke(figure.stroke);
                graphics2D.setColor(figure.color);
                if (figure.fill)
                    graphics2D.fill(figure.shape);
                else {
                    graphics2D.draw(figure.shape);
                }
                keep.add(figure);
            }
        }
        System.out.println(animationSet.keySet());
        if (animationSet.containsKey(curTick2)) {
            Queue<Animation> animations = animationSet.get(curTick2);
            for (Animation animation : animations) {
                Queue<DisplayFigure> animQueue = animation.animations.get(curTick2);
                while (animQueue != null && !animQueue.isEmpty()) {
                    DisplayFigure currentDF = animQueue.poll();
                    graphics2D.setStroke(currentDF.stroke);
                    graphics2D.setColor(currentDF.color);
                    if (currentDF.fill)
                        graphics2D.fill(currentDF.shape);
                    else
                        graphics2D.draw(currentDF.shape);
                }
                if (animation.repeat && animation.animations.values().stream().allMatch(e -> e.isEmpty()))
                    repeat.add(animation);
            }
        }
        Animation[] a = new Animation[repeat.size()];
        a = repeat.toArray(a);
        for (int index = 0; index < a.length; ++index) {
            Animation animation = a[index];
            System.out.println("HERE");
            animation.reset();
            animation.changeStartTime(animation.duration + curTick2);
            repeat.remove(animation);
            addAnimation(animation);
        }
    }

    public void makeAnimationRepeat(Animation animation, long delay, long duration) {
        animation.delay = delay;
        animation.duration = duration;
        animation.repeat = true;
        animation.save();
    }

    public void ElevatorFactory(int x, int y) {
        Elevator elevator = new Elevator(this, new Point(x, y));
        this.addAnimation(elevator.openAnimation);
        elevator.closeAnimation.changeStartTime(elevator.closeDuration);
        this.addAnimation(elevator.closeAnimation);
        this.makeAnimationRepeat(elevator.openAnimation, elevator.closeDuration, elevator.openDuration);
        this.makeAnimationRepeat(elevator.closeAnimation, elevator.openDuration, elevator.closeDuration);
    }

    void start() {
        tick.scheduleAtFixedRate(new Thread(this), 0, tickrate, tickUnit);
    }

    DisplayFigure createFigure(Shape shape, Color color, BasicStroke stroke, Point point, Dimension dimension, boolean fill) {
        DisplayFigure figure = new DisplayFigure();
        figure.shape = shape;
        figure.fill = fill;
        figure.color = color;
        figure.stroke = stroke;
        figure.dimension = dimension;
        figure.point = point;
        return figure;
    }

    DisplayFigure createEmptyFigure() {
        return new DisplayFigure();
    }

    Animation createEmptyAnimation() {
        return new Animation();
    }

    void addAnimation(Animation animation) {
        Queue<Animation> dummyAdd = new LinkedList<>();
        dummyAdd.add(animation);
        for (long l : animation.animations.keySet()) {
            if (animationSet.containsKey(l))
                animationSet.get(l).offer(animation);
            else
                animationSet.put(l, dummyAdd);
        }
    }


    void addStill(DisplayFigure displayFigure, long startTime) {
        Queue<DisplayFigure> dummyAdd = new LinkedList<>();
        dummyAdd.add(displayFigure);
        if (stillSet.containsKey(startTime))
            stillSet.get(startTime).offer(displayFigure);
        else
            stillSet.put(startTime, dummyAdd);
    }

    void removeStill(DisplayFigure displayFigure){
        stillSet.values().forEach(e -> e.removeIf(displayFigure::equals));
        keep.removeIf(displayFigure::equals);
    }

    private void incrementTick() {
        curTick++;
    }

    @Override
    public void run() {
        System.out.println(curTick);
        incrementTick();

        repaint();
    }

    class DisplayFigure {
        // !!! make sure to update the shape itself and not just the fields of this class -- !!!
        // !!! they are solely here for information !!!

        Shape shape;
        Color color;
        BasicStroke stroke;
        Point point;
        Dimension dimension;
        boolean fill;
    }

    /**
     * @author Mark Russell
     * each tick after start time, will display each DisplayFigure in animations.get(tick#)
     */
    class Animation {
        boolean repeat;
        long duration;
        long delay;
        long startTime;
        Map<Long, Queue<DisplayFigure>> animations;
        Map<Long, Queue<DisplayFigure>> save;

        public void reset() {
            animations.clear();
            for (Long key : save.keySet()) {
                Queue<DisplayFigure> q = new LinkedList<>();
                q.addAll(save.get(key));
                animations.put(key, q);
            }
        }

        public void save() {
            save = new HashMap<>();
            for (Long key : animations.keySet()) {
                Queue<DisplayFigure> q = new LinkedList<>();
                q.addAll(animations.get(key));
                save.put(key, q);
            }
        }

        public void changeStartTime(long newStartTime) {
            Map<Long, Queue<DisplayFigure>> map = new HashMap<>();
            long dx = newStartTime - startTime;
            startTime = newStartTime;
            animations.keySet().forEach(e -> map.put(e + dx, animations.get(e)));
            animations = map;
            save();
        }
    }
}
