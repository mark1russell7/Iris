import java.util.ArrayList;
import java.util.List;

/**
 * Bad, Doesn't work
 * @param <E>
 */
@Deprecated
@SuppressWarnings({"unused", "WeakerAccess"})
public class BufferedArrayList<E>
{
    // On remove swap with last element
    // Update the operations! ^
    // Maybe link the nodes in sequential order - makes sub-array etc. access in insert mode much quicker

    //

    private Node<E>[] array;
    private List<Operation> operationsList;
    private boolean insertMode = true;
    private boolean accessMode = false;

    private int size = 0;

    /**
     * Sets the data at a specific index
     * @param index the index whose data is to be set
     * @param data the data to be set at the specific index
     */
    public void set(int index, E data){
        getNode(index).setData(data);
    }

    /**
     * Returns the node at a specific index
     * @param index the index to be accessed
     * @return returns the node at a specific index
     */
    public Node<E> getNode(int index){
        return array[trueIndex(index)];
    }

    /**
     * Gets the data at a specific index
     * @param index the index to be accessed
     * @return returns the data at a specific index
     */
    public E get(int index){
        return array[trueIndex(index)].getData();
    }

    /**
     * Returns the index of the first occurrence of a data after a specified index
     * @param data the data to be found
     * @param from the starting index
     * @return  returns the index of the first occurrence of a data after a specified index
     */
    public int indexOf(E data, int from){
        for(int index = from; index <= size; ++index)
            if(get(index).equals(data))
                return index;
        return -1;
    }

    /**
     * Returns the index of the last occurrence of a data before a specific index
     * @param data the data to be found
     * @param from the ending index
     * @return returns the index of the last occurrence of a data before a specific index
     */
    public int lastIndexOf(E data, int from){
        for(int index = from; index >= 0; --index)
            if(get(index).equals(data))
                return index;
        return -1;
    }

    /**
     * Adds an element to the end of the list
     * @param data the data of the element to be added to the end of the list
     */
    public void add(E data)
    {
        size++;
        Node<E> node = new Node<>(data);
        node.setPrev(getNode(size-1));
        array[size] = node;
    }

    /**
     * Inserts an element at a specific index in the list
     * @param index the index to be inserted in
     * @param data the data to be inserted
     */
    public void insert(int index, E data){
        addOperation(index,size,-1);
        size++;
        Node<E> node = new Node<>(data);
        node.changeIndex(index-size);
        node.setPrev(getNode(index-1));
        node.getPrev().setNext(node);
        node.setNext(getNode(index+1));
        node.getNext().setPrev(node);
    }

    /**
     * Removes and returns the element at 'index'
     * @param index the index whose element is to be removed
     * @return returns the removed element
     */
    public E remove(int index){

        int ti = trueIndex(index);
        array[ti].getPrev().setNext(array[ti].getNext());
        array[ti].getNext().setPrev(array[ti].getPrev());
        swap(ti, size);
        Node<E> e = array[size];
        array[size] = null;
        size--;
        addOperation(size, size, -e.getIndex());
        addOperation(index, index, -e.getIndex());

        addOperation(index, size-1, +1);



        return e.getData();
    }

    /**
     * Returns the user perspective index of an index
     * @param index the index to be converted
     * @return returns the user perspective index of an index
     */
    private int trueIndex(int index) {
        return (insertMode ? operationsList
                .stream()
                .filter(e -> e.getStart() <= index && e.getEnd() <= index)
                .mapToInt(Operation::getOperation)
                .sum() : 0) + array[index].getIndex() + index;
    }

    /**
     * Adds an operation either to an array (O(n)) or to a list (O(1))
     * @param start the starting index of the range affected by the desired operation
     * @param end the ending index of the range affected by the desired operation
     * @param operation the operation
     */
    private void addOperation(int start, int end, int operation){
        if(insertMode)
            operationsList.add(new Operation(start, end, operation));
        else if(accessMode)
            for(int index = start; index <= end; ++index)
                array[index].changeIndex(operation);
    }

    /**
     * Swaps two elements
     * @param index1 the first element
     * @param index2 the second element
     */
    public void swap(int index1, int index2){
        Node<E> temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
        array[index1].changeIndex(index2-index1);
        array[index2].changeIndex(index1-index2);
    }

    /**
     * Returns the index of the first occurrence of a node
     * @param node the node to be found
     * @return returns the index of the first occurrence of a node
     */
    public int indexOf(Node<E> node){
        return node.getIndex();
    }

    /**
     * Returns the index of the first occurrence of a data
     * @param data the data to be found
     * @return returns the index of the first occurrence of a data
     */
    public int indexOf(E data){
        return indexOf(data, 0);
    }

    /**
     * Returns the index of the last occurrence of a data
     * @param data the data to be found
     * @return returns the index of the last occurrence of a data
     */
    public int lastIndexOf(E data){
        return lastIndexOf(data, size);
    }

    /**
     * Changes the mode of this list between insertion mode and access mode <br>
     *      Insertion mode: <br>
     *          Insert: O(1) <br>
     *          Access: O(n) <br>
     *          Remove: O(1) <br>
     *      Access mode <br>
     *          Insert: O(n) <br>
     *          Access: O(1) <br>
     *          Remove: O(1) <br>
     */
    public void changeMode(){
        if(insertMode)
            reduce();
        setInsertMode(!insertMode);
        setAccessMode(!accessMode);
    }

    /**
     * O(k) Converts the list of operations into the array of operations (reduces Access complexity from O(n) to O(1))
     */
    public void reduce(){
        for(int index = 0; index <= size; ++index)
            array[index].setIndex(trueIndex(index)-index);
    }

    /**
     * Sets whether this list is in access mode
     * @param accessMode whether this list is in access mode
     */
    private void setAccessMode(boolean accessMode) {
        this.accessMode = accessMode;
    }

    /**
     * Sets whether this list is in insert mode
     * @param insertMode whether this list is in insert mode
     */
    private void setInsertMode(boolean insertMode) {
        this.insertMode = insertMode;
    }

    /**
     * Warning, returns an ArrayList the size of the number of elements in this list, a single call to List.add() will <br>
     * result in a resize
     * @return returns an ArrayList of the elements in this list
     */
    public List<E> toList(){
        List<E> list = new ArrayList<>(size);
        Node<E> curr = getNode(0);
        while(curr != null) {
            list.add(curr.getData());
            curr = curr.getNext();
        }
        return list;
    }

    /**
     * Returns an array of the elements in this list
     * @return returns an array of the elements in this list
     */
    public E[] toArray(){
        E[] arr = (E[])(new Object[size]);
        Node<E> curr = getNode(0);
        for(int i = 0; curr != null; ++i){
            arr[i] = curr.getData();
            curr = curr.getNext();
        }
        return arr;
    }

    /**
     * Returns a sub-array of this list from start index to end index
     * @param start the starting index of the sub-array
     * @param end the ending index of the sub-array
     * @return returns a sub-array of this list from start index to end index
     */
    public E[] subArray(int start, int end){
        E[] arr = (E[])(new Object[end-start]);
        Node<E> curr = getNode(start);
        for(int i = start; i <= end; ++i){
            arr[i] = curr.getData();
            curr = curr.getNext();
        }
        return arr;
    }

    /**
     * Returns a sub-list of this list from start index to end index
     * @param start the starting index of the sub-list
     * @param end the ending index of the sub-list
     * @return returns a sub-list of this list from start index to end index
     */
    public List<E> subList(int start, int end){
        List<E> list = new ArrayList<>(end-start);
        Node<E> curr = getNode(start);
        for(int i = start; i <= end; ++i) {
            list.add(curr.getData());
            curr = curr.getNext();
        }
        return list;
    }

    //todo MAIN

    //todo SECONDARY

    //todo MISC



    class Node<G>
    {
        private Node<G> next;
        private Node<G> prev;
        private G data;
        private int index;

        public Node(G data){
            setData(data);
        }

        protected void setNext(Node<G> next) {
            this.next = next;
        }

        protected void setPrev(Node<G> prev) {
            this.prev = prev;
        }

        public Node<G> getNext() {
            return next;
        }

        public Node<G> getPrev() {
            return prev;
        }

        protected int getIndex() {
            return index;
        }

        protected void changeIndex(int dx){
            this.index += dx;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        protected void setData(G data) {
            this.data = data;
        }

        protected G getData() {
            return data;
        }
    }


    private class Operation
    {
        private int operation;
        private int start;
        private int end;

        protected Operation(int start, int end, int operation){
            setStart(start); setStart(end); setOperation(operation);
        }

        private void setOperation(int operation) {
            this.operation = operation;
        }

        private void setEnd(int end) {
            this.end = end;
        }

        private void setStart(int start) {
            this.start = start;
        }

        public int getOperation() {
            return this.operation;
        }

        public int getEnd() {
            return this.end;
        }

        public int getStart() {
            return this.start;
        }

        @Override
        public String toString() {
            return String.format("[%d, %d to %d]",this.operation,this.start,this.end);
        }
    }


    class BALHealth{}


}
