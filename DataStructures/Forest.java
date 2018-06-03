import java.util.ArrayList;
import java.util.Comparator;

// Todo Test All Methods

/*
* Todo 1. Implement rest of BQ methods
* Todo 2. Implement supplementary methods (ie. setComparator)
* Todo 3. Implement a Fibonacci Queue (Lazy Binomial Queue)
* Todo 4. tbd..
* */

/**
 * A Binomial Queue <br>
 *
 * TODO [ NODES ARE REALLY BINOMIAL HEAPS, FORESTS ARE REALLY BINOMIAL QUEUES ]
 *
 * @author Mark Russell
 * @version 1.0
 * @param <E> The type of data handled by this binomial queue (must be comparable)
 */
public class Forest<E extends Comparable<E>> {
    private ArrayList<BinomialNode<E>> forest;
    private int num = 0;


    // Todo Split this method into method components
    /**
     * Deletes and returns the minimum-valued element in this Binomial Queue
     * @return returns the minimum-valued element in this Binomial Queue
     */
    public E deleteMin(){
        int minIndex = 0;
        for(int index = 1; index < getSize(); index++)
            if(getAt(index).getData().compareTo(getAt(minIndex).getData()) < 0)
                minIndex = index;
        BinomialNode<E> min = forest.remove(minIndex);
        num--;
        merge(min.getChildren());
        return min.getData();
    }

    /**
     * Returns the minimum-valued element in this Binomial Queue
     * @return returns the minimum-valued element in this Binomial Queue
     */
    public E peekMin(){
        return getForest()
                .stream() // Todo consider .parallelStream() to make use of multi core/threaded machines
                .map(BinomialNode::getData)
                .min(Comparator.naturalOrder())
                .get(); // Todo research the .isPresent() method
    }

    /**
     * Merges two Binomial Queues
     * Pre-condition: this passed Binomial Queue is, with respect to size (.getNum()), <br>
     * smaller than or equal to this Binomial Queue
     * @param forest the queue to be merged with this one
     */
    public void merge(Forest<E> forest) {
        Forest<E> tempForest = makeForest(getSize());       // Todo consider alternatives that reduce overhead
        for(int index = 0; index < getSize(); index++) {
            if(isEmptySlot(index))                         // |-------------------|
                tempForest.merge(forest.getAt(index));     // | Todo make this    |
            else if(isEmptySlot(forest, index))            // | Todo more compact |
                tempForest.merge(getAt(index));            // |-------------------|
            else{
                boolean which = isLessThan(forest.getAt(index), getAt(index));
                BinomialNode<E> small = which ? forest.getAt(index) : getAt(index);
                BinomialNode<E> large = which ? getAt(index) : forest.getAt(index);
                makeChildOf(large, small);
                increaseOrder(small);
                tempForest.merge(small);
            }
        }
        setForest(tempForest.getForest());
        this.num = tempForest.getNum();
    }

    /**
     * Inserts a single Binomial Tree into this Binomial Queue
     * @param node the Binomial Tree to merge with
     */
    public void merge(BinomialNode<E> node)
    {
        if(isEmptySlot(orderOf(node)))
            insertAt(orderOf(node), node);
        else /* Carry */{
            boolean which = isLessThan(getAt(orderOf(node)), node);
            BinomialNode<E> small = which ? getAt(orderOf(node)) : node;
            BinomialNode<E> large = which ? node : getAt(orderOf(node));
            makeChildOf(large, small);
            clearSlot(orderOf(small));
            increaseOrder(small);
            merge(small);
        }
        num += 1 + (node.getChildren() != null ? node.getChildren().num : 0);
    }

    public int getNum() {
        return num;
    }
    public ArrayList<BinomialNode<E>> getForest() {
        return forest;
    }

    /**
     * O(1) <br>
     * Inserts a single node into this Binomial Queue
     * @param data
     */
    public void insert(E data){
        merge(new BinomialNode<>(data, new Forest<>(), 0));
    }

    /*
    |----------------------------------------------------------|
    | The below methods are used to help clarify the meaning
    | of the above code.
    |----------------------------------------------------------|
     */

    private Forest<E> makeForest(int size){
        Forest<E> forestNew = new Forest<>();
        forestNew.forest = new ArrayList<>(size);
        return forestNew;
    }
    private boolean isEmptySlot(int index){
        return this.getForest().get(index) == null;
    }
    private int orderOf(BinomialNode<E> node){
        return node.getOrder();
    }
    private void insertAt(int index, BinomialNode<E> node){
        getForest().add(index, node);
    }
    private BinomialNode<E> getAt(int index){
        return getForest().get(index);
    }
    private boolean isLessThan(BinomialNode<E> b1, BinomialNode<E> b2){
        return b1.getData().compareTo(b2.getData()) < 0;
    }
    private void increaseOrder(BinomialNode<E> node){
        node.setOrder(orderOf(node)+1);
    }
    private void clearSlot(int index){
        forest.remove(index);
    }
    private void makeChildOf(BinomialNode<E> child, BinomialNode<E> parent){
        parent.getChildren().merge(child);
    }
    private int getSize(){
        return getForest().size();
    }

    private void setForest(ArrayList<BinomialNode<E>> forest) {
        this.forest = forest;
    }
    private static<E extends Comparable<E>> boolean isEmptySlot(Forest<E> forest, int index){
        return forest.isEmptySlot(index);
    }

    private class BinomialNode<E extends Comparable<E>>
    {
        private E data;
        private Forest<E> children;
        private int order;

        private BinomialNode(E data, Forest<E> children, int order){
            this.data = data;
            this.children = children;
            this.order = order;
        }

        private E getData() {
            return data;
        }

        private int getOrder() {
            return order;
        }

        private Forest<E> getChildren() {
            return children;
        }

        private void setData(E data) {
            this.data = data;
        }

        private void setChildren(Forest<E> children) {
            this.children = children;
        }

        private void setOrder(int order) {
            this.order = order;
        }
    }

}
