/**
 *  A class that allows the storage of a string that has O(n) append cost instead of the O(s + n) concatenation cost, <br>
 *  where s is the original stored string and n is the length of the new string <br>
 *  Over the concatenation of n strings each of length k, the complexity to do all concatenations in a loop would <br>
 *  be 0.5 * k*n(n+1) such that O(kn^2) <br>
 *  over the appending of n strings each of length k, the complexity of StringBucket's appending of all strings in a <br>
 *  loop would be O(kn), then getting the string or char[] representation would be another O(n), totalling the  <br>
 *  complexity to O(kn) <br>
 *  email: mrussell17@brandeis.edu
 *  @author Mark Russell
 *  @version 9/27/17
 */
public class StringBucket{
    private static final int MAX_CHAR = 128;                                                                              // Maximum ASCII character
    private final SinglyLinkedList<Integer>[] letters = (SinglyLinkedList<Integer>[])(new SinglyLinkedList[MAX_CHAR]);    // Create an array of linked lists, one list for every possible character
    private int length;                                                                                                   // length of String being held

    public SinglyLinkedList<Integer>[] getLetters() {
        return letters;
    }

    public char getAt(int index)
    {
        return getCharArray()[index];
    }

    public SinglyLinkedList<Integer> getIndecies(char c){
        return letters[c];
    }

    public int indexOf(char c){
        return letters[c].getHead().getData();
    }

    /**
     * O(1) <br>
     * Constructs an empty StringBucket Object
     */
    public StringBucket(){
        for(int index = 0; index < MAX_CHAR; ++index)                               // O(1) Do the following 128 times
            letters[index] = new SinglyLinkedList<>();                              // O(1) Instantiate the index'th list of "letters"
    }

    /**
     * O(n) <br>
     * Appends the desired object's string representation to the end of the StringBucket's string
     * @param o the object whose string representation is to be added to this string
     * @return returns the modified StringBucket
     */
    public StringBucket append(Object o)
    {
        String str = o.toString();
        for(int index = 0; index < str.length(); ++index)                           // O(n) n is the length of the input string, go through all the characters in the input string and
            letters[(int)(str.charAt(index))].regularInsert(length+index);    // O(n) for each one, add their 'to-be' position in this string as an Integer to the corresponding list in 'letters'
        length += str.length();                                                     // O(1) increment the length field appropriately
        return this;
    }

    /**
     * O(n) <br>
     * returns the string represented by this StringBucket Object
     * @return returns the string represented by this StringBucket Object
     */
    @Override
    public String toString() {
        char[] str = new char[length];                                               // O(n) create a character array the size of the string, n is the length of the string
        for(int index1 = 0; index1 < letters.length; ++index1)                       // O(1) go through all of the lists in letters (constant bounded- 128)
            for(int index2 = 0; index2 < letters[index1].size(); ++index2)           // O(n) go through all of the Integers held by the lists
            {
                Integer i = letters[index1].getHead().getData();                     // O(n) store a copy of the integer
                letters[index1].remove(i);                                           // O(n) remove the integer from the front of the list
                str[i] = (char)index1;                                               // O(n) make the integer'th index in str, the character represented by the list
                letters[index1].regularInsert(i);                                    // O(n) re-insert the Integer into the list to allow future annotation "@Contract(pure=true)"
            }
        return new String(str);                                                      // O(n) return a string using the one-args char[] constructor of the String class, which uses Arrays.copyOf
    }

    /**
     * O(n) <br>
     * returns the character array represented by this StringBucket Object <br>
     * Running time is faster than toString()
     * @return returns the character array represented by this StringBucket Object
     */
    public char[] getCharArray(){
        char[] str = new char[length];                                               // O(n) create a character array the size of the string, n is the length of the string
        for(int index1 = 0; index1 < letters.length; ++index1)                       // O(1) go through all of the lists in letters (constant bounded- 128)
            for(int index2 = 0; index2 < letters[index1].size(); ++index2)           // O(n) go through all of the Integers held by the lists
            {
                Integer i = letters[index1].getHead().getData();                     // O(n) store a copy of the Integer
                letters[index1].remove(i);                                           // O(n) remove the integer from the front of the list
                str[i] = (char)index1;                                               // O(n) make the integer'th index in str, the character represented by the list
                letters[index1].regularInsert(i);                                    // O(n) re-insert the Integer into the list to allow future annotation "@Contract(pure=true)"
            }
        return str;                                                                  // O(1) return the character array
    }

    /**
     * Returns the length of this string
     * @return returns the length of this string
     */
    public int getLength() {
        return length;
    }

    /**
     * O(n) <br>
     * returns the substring of this string in the index range: [start, end)
     * @param start the inclusive start index of the substring
     * @param end the exclusive end index of the substring
     * @return returns the substring of this string in the index range: [start, end)
     */
    public String substring(int start, int end)
    {
        char[] str = new char[length-start-(length-end)];                       // O(n) creates a character array the size of the desired substring, n is the length of the desired substring
        for(int index1 = 0; index1 < letters.length; ++index1)                  // O(1) go through all of the lists in letters (constant bounded- 128)
            for(int index2 = 0; index2 < letters[index1].size(); ++index2)      // O(n) go through all of the Integers from the front of the list
            {
                Integer i = letters[index1].getHead().getData();                // O(n) store a copy of the Integer
                letters[index1].remove(i);                                      // O(n) remove the Integer from the front of the list
                if(!(i >= end || i < start))                                    // O(n) if the Integer is within the range of indexes desired
                    str[i] = (char)index1;                                      // O(n) make the integer'th index in str, the character represented by the list
                letters[index1].regularInsert(i);                               // O(n) re-insert the Integer into the list to allow future annotation "@Contract(pure=true)"
            }
        return new String(str);                                                 // O(n) return a string using the one-args char[] constructor of the String class, which uses Arrays.copyOf
    }

    /**
     * O(n) <br>
     * returns the sub array of this array in the index range: [start, end) <br>
     * Running time is faster than substring()
     * @see StringBucket#append(Object)
     * @see StringBucket#toString()
     * @param start the inclusive start index of the sub array
     * @param end the exclusive end index of the sub array
     * @return returns the sub array of this array in the index range: [start, end)
     */
    public char[] subarray(int start, int end)
    {
        char[] str = new char[length-start-(length-end)];                       // O(n) creates a character array the size of the desired sub array, n is the length of the sub array
        for(int index1 = 0; index1 < letters.length; ++index1)                  // O(1) go through all of the lists in letters (constant bounded- 128)
            for(int index2 = 0; index2 < letters[index1].size(); ++index2)      // O(n) go through all of the Integers from the front of this list
            {
                Integer i = letters[index1].getHead().getData();                // O(n) store a copy of the Integer
                letters[index1].remove(i);                                      // O(n) remove the Integer from the front of the list
                if(!(i >= end || i < start))                                    // O(n) if the Integer is within the range of indexes desired
                    str[i] = (char)index1;                                      // O(n) make the Integer'th index in str, the character represented by the list
                letters[index1].regularInsert(i);                               // O(n) re-insert the Integer into the list to allow future annotation "@Contract(pure=true)"
            }
        return str;                                                             // O(1) return the character array
    }
    /**
     * A Singly Linked List implementation <br>
     * email: mrussell17@brandeis.edu
     * @param <T> the type of object to be held by this list
     * @author Mark Russell
     * @version 9/23/17
     */
    class SinglyLinkedList<T>
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
    /**
     * A class representing a node in a singly linked list <br>
     * email: mrussell17@brandeis.edu
     * @author Mark Russell
     * @version 9/23/17
     * @param <T> the type of object held by this node
     */
    class SinglyLinkedNode<T>
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

}
