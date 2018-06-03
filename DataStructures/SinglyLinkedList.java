/**
 * A Singly Linked List implementation <br>
 * email: mrussell17@brandeis.edu
 * @param <T> the type of object to be held by this list
 * @author Mark Russell
 * @version 9/23/17
 */
public class SinglyLinkedList<T>
{
    private static final String DELIMITER = ", ";
    private SinglyLinkedNode<T> head;
    private SinglyLinkedNode<T> tail;
    private int size = 0;

    /**
     * O(1) <br>
     * Constructs a Singly Linked List of size 0
     */
    public SinglyLinkedList() {
        head = null;                                                            // O(1)
        tail = null;                                                            // O(1)
        size = 0;                                                               // O(1)
    }

    /**
     * O(1) <br>
     * Returns the head node of this list
     * @return returns the head node of this list
     */
    public SinglyLinkedNode<T> getHead() {
        return head;                                                            // O(1)
    }

    /**
     * O(1) <br>
     * Returns the tail node of this list
     * @return returns the tail node of this list
     */
    public SinglyLinkedNode<T> getTail(){
        return tail;                                                            // O(1)
    }

    /**
     * O(1) <br>
     * Replaces this list's contents with that of the passed list <br>
     * Pre-Condition: passed head, tail and size are correct attributes from the same list
     * @param head the head of the list being redirected to
     * @param size the size of the list being redirected to
     * @param tail the tail of the list being redirected to
     */
    public void addAll(SinglyLinkedNode<T> head, int size, SinglyLinkedNode<T> tail) {
        this.head = head;                                                       // O(1)
        this.tail = tail;                                                       // O(1)
        this.size = size;                                                       // O(1)
    }

    /**
     * O(1) <br>
     * Inserts a node containing 'data' at the end of the list
     * @param data the data contained by the node inserted at the end of the list
     */
    public void regularInsert(T data){
        if(size == 0) {                                                         // O(1)
            head = new SinglyLinkedNode<>(data);                                // O(1)
            tail = head;                                                        // O(1)
        }else{
            tail.setNext(new SinglyLinkedNode<>(data));                         // O(1)
            tail = tail.getNext();                                              // O(1)
        }
        ++size;                                                                 // O(1)
    }

    /**
     * O(n) <br>
     * Inserts a node containing 'data' into a random position in the list
     * @param data the data contained by the node to be randomly inserted into the list
     */
    public void randomInsert(T data) {
        int index = (int)(Math.random()*size);                                  // O(1) random index
        if(index == size-1)                                                     // O(1) if the index is the final index
            regularInsert(data);                                                // O(1) regular insert the data
        else if(index == 0){                                                    // O(1) if the index is the first index
            SinglyLinkedNode<T> toAdd = new SinglyLinkedNode<>(data);           // O(1) create a new node with the data
            toAdd.setNext(head);                                                // O(1) set it's pointer to the head of the list
            head = toAdd;                                                       // O(1) make the new node the head of the list
            if(size == 0)                                                       // O(1) if the list was empty
                tail = head;                                                    // O(1) set the new node to be the tail as well
            ++size;                                                             // O(1) increment the size of the list
        }else {                                                                 //      if the random index was neither the first nor last index
            SinglyLinkedNode<T> current = head;                                 // O(1)
            for (int i = 0; i < index - 2; ++i)                                 // O(n) go through all of the
                current = current.getNext();                                    // O(n) nodes stopping at the desired index
            SinglyLinkedNode<T> toAdd = new SinglyLinkedNode<>(data);           // O(1) create a new node with the data
            toAdd.setNext(current.getNext());                                   // O(1) set the pointers of the
            current.setNext(toAdd);                                             // O(1) affected nodes
            ++size;                                                             // O(1) increment the size
        }
    }

    /**
     * O(n) <br>
     * Removes the 'data' node from this list
     * @param data the data contained by the node to be removed from this list
     */
    public void remove(T data) {
        if(head.getData().equals(data)){                                                        // O(1) if the data to be removed is the head of the list
            head = head.getNext();                                                              // O(1) set the head to the second element of the list
            --size;                                                                             // O(1) decrement the size of the list
        }else {
            SinglyLinkedNode<T> current = head;                                                 // O(1)
            while (current.getNext() != tail && !current.getNext().getData().equals(data))      // O(n) go through all of the nodes of the list
                current = current.getNext();                                                    // O(n) until right before the 'data' one
            SinglyLinkedNode<T> element = current.getNext();                                    // O(1) save the 'data' node
            if(element == tail){                                                                // O(1) if the node is the tail
                tail = current;                                                                 // O(1) set the tail to be the element before itself
                current.setNext(null);                                                          // O(1) set the new tail to point to null
                --size;                                                                         // O(1) decrement the size
            }else{
                current.setNext(element.getNext());                                             // O(1) else if the node is somewhere else in the list then set the node before it to point to the node after it
                --size;                                                                         // O(1) decrement the size
            }
        }
    }

    public void remove(int index)
    {
        if(index == 0)
        {
            head = head.getNext();
            --size;
        }else
        {
            SinglyLinkedNode<T> current = head;
            int curPos = 1;
            while(current.getNext() != tail && curPos < index) {
                current = current.getNext();
                curPos++;
            }
            SinglyLinkedNode<T> element = current.getNext();
            if(element == tail){
                tail = current;
                current.setNext(null);
                --size;
            }else{
                current.setNext(element.getNext());
                --size;
            }
        }
    }

    public SinglyLinkedNode<T> get(int index)
    {
        SinglyLinkedNode<T> curr = head;
        int curPos = 0;
        while(curr.getNext() != null && curPos < index) {
            curr = curr.getNext();
            curPos++;
        }
        return curr;
    }
    /**
     * O(1) <br>
     * Returns the size of this list
     * @return returns the size of this list
     */
    public int size(){
        return size;                            // O(1)
    }

    /**
     * O(nk) <br>
     * Builds and returns a String representation of this class in the form of the string representation of the <br>
     * elements of the stored class, where it is a list of all the stored elements separated by commas <br>
     * @see StringBucket#append(Object)
     * @see StringBucket#substring(int, int)
     * @return returns the comma separated list of the stored elements in this list
     */
    @Override
    public String toString() {
        StringBucket stringBucket = new StringBucket();         // O(1)
        SinglyLinkedNode<T> current = getHead();                                // O(1)
        while(current != null){                                                 // O(n)
            stringBucket.append(current).append(DELIMITER);                     // O(nk)
            current = current.getNext();                                        // O(n)
        }
        return stringBucket.substring(0, stringBucket.getLength()-2);           // O(nk)
    }
}
