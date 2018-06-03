/**
 * A class representing a node in a singly linked list <br>
 * email: mrussell17@brandeis.edu
 * @author Mark Russell
 * @version 9/23/17
 * @param <T> the type of object held by this node
 */
public class SinglyLinkedNode<T>
{
    private final T data;
    private SinglyLinkedNode<T> next;

    /**
     * O(1) <br>
     * Constructs a node for a singly linked list with the desired data
     * @param data the desired data for this node
     */
    public SinglyLinkedNode(T data) {
        this.data = data;                           // O(1)
    }

    /**
     * O(1) <br>
     * returns the data held by this node
     * @return returns the data held by this node
     */
    public T getData(){
        return data;                                // O(1)
    }

    /**
     * O(1) <br>
     * returns the node pointed to by this node
     * @return returns the node pointed to by this node
     */
    public SinglyLinkedNode<T> getNext(){
        return next;                                // O(1)
    }

    /**
     * O(1) <br>
     * sets the node to which this node points
     * @param next the node to which this node will point
     */
    public void setNext(SinglyLinkedNode<T> next) {
        this.next = next;                           // O(1)
    }

    /**
     * O(k) where k is the complexity of T.toString() <br>
     * returns the string representation of the held data
     * @return returns the string representation of the held data
     */
    @Override
    public String toString() {
        return data.toString();                     // O(k) where k is the complexity of T.toString()
    }
}
