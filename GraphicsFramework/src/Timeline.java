import java.util.*;
import java.util.stream.Collectors;

/**
 * todo implement id system for lines and dots for searching
 * todo think about implementing a class for searching / generalization of query returns
 * todo think about logging and testing methods and classes
 */
public class Timeline
{
    private LineStructure timeline = new LineStructure();
    private Person person;
    Timeline(Person person){
        this.person = person;
    }

    /**
     * Adds a new line to the timeline
     * @param line the new line
     */
    public void addNewLine(Line line){
        timeline.addNewLine(line);
    }

    /**
     * Adds a new dot to a line in the timeline
     * @param data the data for the dot
     * @param time the time of the dot
     * @param line the line to which this new dot pertains
     * @param <E> the type of data being added
     */
    public<E> void addNewDot(E data, Time time, Line line){
        timeline.addNewDot(data, time, line);
    }

    /**
     * gets the lines that overlap a given time
     * @param time the time
     * @return returns a list of the lines that overlap a given time
     */
    public List<Line> getLines(Time time){
        return timeline.getLines(time);
    }

    /**
     * Finds any line that matches a given name
     * @param name the name being searched for
     * @return returns any line that matches a given name
     */
    public Line getLine(String name){
        return timeline.getLine(name);
    }

    /**
     * Performs a rudimentary search for lines whose names contains a specific phrase
     * @param name the phrase/name being searched for
     * @return returns a set of lines whose names contain a specific phrase
     */
    public Set<Line> search(String name){
        return timeline.trySearch(name);
    }

    /**
     * A class used to further encapsulate the timeline <br>
     * This class holds all of the pertaining lines for one person <br>
     * And allows basic Add, Get and Search operations
     */
    class LineStructure
    {
        Set<Line> timeline = new HashSet<>();

        /**
         * Adds a new line to the timeline
         * @param line the new line to bed added
         */
        private void addNewLine(Line line)
        {
            timeline.add(line);
        }

        /**
         * Adds a new dot to the timeline
         * @param data the data for the dot
         * @param time the time for the dot
         * @param line the line to which this dot pertains
         * @param <E> the type of data being stored in this new dot
         */
        private <E> void addNewDot(E data, Time time, Line line)
        {
            line.add(new Dot<>(data, time, line));
        }

        /**
         * Gets all of the lines that overlap a specific time
         * @param time the time
         * @return returns all of the lines that overlap a specific time
         */
        private List<Line> getLines(Time time){
            return timeline
                    .stream()
                    .filter(e -> e.start.compareTo(time) <= 0 && e.end.compareTo(time) >=0)
                    .sorted(Comparator.comparing(Line::getStart))
                    .collect(Collectors.toList());
        }

        /**
         * Gets any line that has a specific name
         * @param name the name being searched for
         * @return returns any line that has a specific name
         */
        private Line getLine(String name){
            return timeline
                    .stream()
                    .filter(e -> e.name.equals(name))
                    .findAny()
                    .get();
        }

        /**
         * Performs a rudimentary search for lines whose names contains a specific phrase
         * @param name the phrase
         * @return returns a set of lines whose names contain a specific phrase
         */
        private Set<Line> trySearch(String name){
            return timeline
                    .stream()
                    .filter(e -> e.name.contains(name))
                    .collect(Collectors.toSet());
        }

    }

    /**
     * A class that represents a person
     */
    class Person {
        String name;
        Time dob;
        Person(String name){
            this.name = name;
        }
    }
    /**
     * A time class to help make dealing with dates and times more consistent
     */
    class Time implements Comparable<Time>{
        int year;
        int month;
        int day;
        int hour;
        int minute;
        int second;
        int totalSeconds;
        @Override
        public int compareTo(Time o) {
            return this.totalSeconds-o.totalSeconds;
        }
    }

    /**
     * A class that represents the start of a two node linked list that in turn represents a range of time
     */
    class Start extends Time{
        End end;
    }

    /**
     * A class that represents the end of a two node linked list that in turn represents a range of time
     */
    class End extends Time{
        Start start;
    }

    /**
     * A class that represents a line for the TIMELINE PROJECT
     */
    class Line
    {
        String name;
        Start start;
        End end;
        TreeMap<Time, List<Dot>> dots = new TreeMap<>(Comparator.naturalOrder());

        Line(Start start, End end, String name){
            this.start = start;
            this.end = end;
            this.name = name;
        }

        /**
         * Returns the start time of this line
         * @return returns the start time of the line
         */
        public Start getStart() {
            return start;
        }

        /**
         * Adds a dot to this line if it is within the appropriate time boundaries
         * @param dot the dot to be added
         * @return returns whether the dot was within the appropriate time boundaries
         */
        boolean add(Dot dot)
        {
            if(!(dot.time.compareTo(start) >= 0 && dot.time.compareTo(end) <= 0))
                return false;
            this.dots.putIfAbsent(dot.time, new LinkedList<>());
            this.dots.get(dot.time).add(dot);
            return true;
        }

        /**
         * Returns the dots at a specific time
         * @param time the time
         * @return a list of the dots at a specific time
         */
        List<Dot> get(Time time)
        {
            return dots.getOrDefault(time, null);
        }

    }

    /**
     * A class that represents a dot in PROJECT TIMELINE
     * @param <E> the type of data stored in the specific instances of a dot
     */
    class Dot<E> implements Comparable<Dot>{
        Dot(E data, Time time, Line line){
            this.data = data;
            this.time = time;
            this.line = line;
        }
        E data;
        Time time;
        Line line;
        @Override
        public int compareTo(Dot o) {
            return this.time.compareTo(o.time);
        }
    }
    class DotComparator implements Comparator<Dot> {
        @Override
        public int compare(Dot o1, Dot o2) {
            return o1.compareTo(o2);
        }
    }
}
