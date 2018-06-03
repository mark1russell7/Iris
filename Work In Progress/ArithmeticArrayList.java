import java.io.*;
import java.util.*;
/**
 * Bad, doesn't work
 * @author Mark Russell
 * @version 10/18/17
 */
@Deprecated
@SuppressWarnings({"WeakerAccess", "unused", "unchecked"})
public class ArithmeticArrayList<E>
{

    /*
    TODO:

    USE MOD AND DIVISION AND MULTIPLE ARRAYS to make the size flexible

    Use the division to decide which array and the mod to decide what index

    So when the array, B, overflows, you create another, C, and append it to an array of size 2
    A[][] -> {B[], C[]}
    when this overflows you create a new array
    A[][][] -> { {B[],C[]}, {D[]} }

    A[][][][] -> { { {B[], C[]}, {D[]} }, {{E[]}} }

    ???

    or do A[][] -> {B[], C[]}
    A[][][] -> {B[], C[]}, {E[], F[]}

    ??

    OR

    keep making objects of this class that become recursively the size of what you already have
    And then connect them with a new bigger array

    {B[], C[]}

    {D[], E[]}

    ->

    {{B[], C[]}, {D[], E[]}}

    {{F[], G[]}, {H[], I[]}}

    ->

    {{{B[], C[]}, {D[], E[]}}, {{F[], G[]}, {H[], I[]}}}

    ...



    IF YOU DO THIS THEN ACCESS ETC AT INDEX K WILL BECOME

    O(access... + (log base 2 of (log base n of N')) where n is the size of B








    class Array<E>
    {
        private E[] array;
        private int size;

        public Array(int size){
            array = (E[])(new Object[size]);
            this.size = size;
        }

        public static Array<Array<E>> getSuperArray(Array<E> sub) {
            return new Array<Array<E>>(2);
        }
    }




     */

//
//
//    class Array<G>
//    {
//        private G[] array;
//        private int size;
//
//        public Array(int size){
//            array = (G[])(new Object[size]);
//            this.size = size;
//        }
//
//        public void setArray(G[] array) {
//            this.array = array;
//        }
//
//        public void set(int index, G val){
//            array[index] = val;
//        }
//
//        public G get(int index){
//            return array[index];
//        }
//
//        public G[] getArray() {
//            return array;
//        }
//
//
//        public Array<Array<G>> getSuperArray() {
//            Array<Array<G>> arr = new Array<>(2);
//            arr.set(0, (ArithmeticArrayList.Array<>)array);
//            arr.set(1, new Array<>(1));
//        }



    // ^^^^^^^^^^^^^^^^^^^^^^^^
    //          rework this


//    }








    /*
    Todo

    Create many options and algorithms for rebuild/implement partial rebuild

    Create many options and algorithms for swap/implement partial swap

    Optimizations (ie. in insert mode, inserts that affect single elements or ~2 add the operations directly to list)
        ^ make this limit dynamic/changeable


    Create a way to determine the health? and status of the structure at any time (for analysis)



    CONSIDER SORTING OPERATIONS VIA COUNTING SORT???????????????!!!!!!!!!!!!!!


    O(n+k) but k is n, so sort should be O(n) !!! hmmm...


     */







    /*


    Store operations in a counting-sorted array based on the start of the affected interval
    Go to index 0 until index of access/etc, and add those which end after or at the index of access/etc.



    Maybe have a second that stores them based on the end of the affected interval
    Go to index of access/etc. and read up, adding those which start before or at the index of access/etc,



     */







    public static void main(String[] args) throws IOException
    {
        ArithmeticArrayList<String> s = new ArithmeticArrayList<>(100000, false);
        Scanner in = new Scanner(new File("C:\\Users\\mj17r\\Desktop\\PA5\\out\\production\\PA5\\hamlet.txt"));
        while(in.hasNext()) {
            System.out.print(s.add(in.next())+" ");
//            s.add(in.next());
        }
        System.out.println();
        for(int i = 0; i < 5000; ++i){
            System.out.print(s.add(s.remove(new Random().nextInt(s.maxPos))) + " ");
        }
        System.out.println();
        System.out.println(s.ops.toString());
        System.out.println(Arrays.toString(s.operations));
        System.out.println("done");
    }


    public void setDeleteConstantBuffer(int deleteConstantBuffer) {
        this.deleteConstantBuffer = deleteConstantBuffer;
    }

    public void setInsertConstantBuffer(int insertConstantBuffer) {
        this.insertConstantBuffer = insertConstantBuffer;
    }

    public void setWeightOfAccessAcceleration(int weightOfAccessAcceleration) {
        this.weightOfAccessAcceleration = weightOfAccessAcceleration;
    }

    public void setWeightOfInsertionAcceleration(int weightOfInsertionAcceleration) {
        this.weightOfInsertionAcceleration = weightOfInsertionAcceleration;
    }

    public int getDeleteConstantBuffer() {
        return deleteConstantBuffer;
    }

    public int getInsertConstantBuffer() {
        return insertConstantBuffer;
    }

    public int getWeightOfAccessAcceleration() {
        return weightOfAccessAcceleration;
    }

    public int getWeightOfInsertionAcceleration() {
        return weightOfInsertionAcceleration;
    }

    public void setOps(List<Operation> ops) {
        this.ops = ops;
    }

    public void setOperations(int[] operations) {
        this.operations = operations;
    }

    public int[] getOperations() {
        return operations;
    }

    public List<Operation> getOps() {
        return ops;
    }


    class HealthStatus{
        private final ArithmeticArrayList AAL;

        private int operationsListSize;
        private int numAffectedIndecies;
        private int[] operations;
        private int insertionWeight;
        private int accessWeight;
        private int constantBufferInsert;
        private int constantBufferDelete;
        private boolean isInsertMode;
        private int numElements;
        private int totalSize;
        private int num;

        public HealthStatus(ArithmeticArrayList AAL){
            this.AAL = AAL;
            update();
        }

        public void update() {
            this.operationsListSize = AAL.ops.size();
            this.numAffectedIndecies = 0;
            this.operations = AAL.operations;
            this.insertionWeight = AAL.weightOfInsertionAcceleration;
            this.accessWeight = AAL.weightOfAccessAcceleration;
            this.constantBufferDelete = AAL.deleteConstantBuffer;
            this.constantBufferInsert = AAL.insertConstantBuffer;
            this.numElements = AAL.maxPos-AAL.NPLIST.size();
            this.totalSize = AAL.array.length;
            this.isInsertMode = !AAL.insertK;
            this.num = AAL.countI;
            List<Operation> ops = new LinkedList<>();
            ops.addAll(AAL.ops);
            for(Operation o : ops)
                for(int start = o.minIncl; start <= o.getMaxIncl(); ++start)
                    this.operations[start] += o.getOperation();
            for(int index = 0; index < this.operations.length; ++index)
                if(this.operations[index] != 0)
                    numAffectedIndecies++;
        }

        public void outputReport(PrintStream out){
            if(this.isInsertMode) {
                out.println(
                        String.format(
                                " access complexity for next %d consecutive accesses is %d", this.accessWeight+num, this.operationsListSize
                                )
                );
                out.println(
                        String.format(
                                " Swap to access mode will happen in %d consecutive accesses, Operations to swap now:  %d ", this.accessWeight+num, this.AAL.ops
                                        .stream()
                                        .mapToInt(e -> ((Operation)e).maxIncl-((Operation)e).minIncl)
                                        .sum()
                        )
                );
                out.println(
                        String.format(
                                " Number of pending operations: %d ", operationsListSize
                        )
                );
            }else{
                out.println(
                        " access complexity is O(1), insert complexity is O(n) "
                );
                out.println(
                        String.format(
                                " Average insert complexity for next %d consecutive insertions is %d ", this.insertionWeight-num, (this.numElements-1)/2
                        )
                );
            }
        }
    }




    private E[] array;
    private int[] operations;
    //private int NP = -1;
    private Queue<Integer> NPLIST = new PriorityQueue<>();
    private int maxPos = 0;
    private List<Operation> ops = new LinkedList<>();
    private boolean insertK = false;

    private static final int defaultSize = 10;
    private static final int defaultIA = 5;
    private static final int defaultAA = 5;

    private int countI = 0;

    private int weightOfInsertionAcceleration = 5;
    private int weightOfAccessAcceleration = 5;

    private int insertConstantBuffer = 2;
    private int deleteConstantBuffer = 2;

    public void swap(){
//        countI = 0;
//        if(insertK){
//            reduce();
//        }
//        insertK = !insertK;
    }

    public void reduce(){
        for(Operation o : ops){
            for(int start = o.minIncl; start <= o.getMaxIncl(); ++start){
                operations[start] += o.getOperation();
            }
        }
        ops = new LinkedList<>();
    }


    //insertConstantBuffer = (int)(Math.log(size)/Math.log(2)); ????????????? size/weight ??



    public ArithmeticArrayList(int size){
        array = (E[])(new Object[size]);
        operations = new int[size];

    }
    public ArithmeticArrayList(int size, boolean insertK){
        this(size);
        this.insertK = insertK;
    }
    public ArithmeticArrayList(){
        this(defaultSize);
        weightOfAccessAcceleration = defaultAA;
        weightOfInsertionAcceleration = defaultIA;
    }

    public ArithmeticArrayList(int size, boolean insertK, int weightOfAccessAcceleration, int weightOfInsertionAcceleration){
        this(size, insertK);
        this.weightOfInsertionAcceleration = weightOfInsertionAcceleration;
        this.weightOfAccessAcceleration = weightOfAccessAcceleration;
    }

    public void set(int P, E val){
        if(!insertK){
            array[P+operations[P] + ops.stream().filter(e -> e.getMaxIncl() <= P && e.getMinIncl() >= P).mapToInt(Operation::getOperation).sum()] = val;
        }else{
            array[P+operations[P]] = val;
        }
    }

    public void swap(int P, int P2){
        if(!insertK){
            int mod1 = P+operations[P]+ops.stream().filter(e -> e.getMaxIncl() <= P && e.getMinIncl() >= P).mapToInt(Operation::getOperation).sum();
            int mod2 = P2+operations[P2]+ops.stream().filter(e -> e.getMaxIncl() <= P2 && e.getMinIncl() >= P2).mapToInt(Operation::getOperation).sum();
            E temp = array[mod1];
            array[mod1] = array[mod2];
            array[mod2] = temp;
        }else{
            int mod1 = P + operations[P];
            int mod2 = P2 + operations[P2];
            E temp = array[mod1];
            array[mod1] = array[mod2];
            array[mod2] = temp;
        }
    }

    public void insert(int P, E val){

        if(countI >= 0-weightOfInsertionAcceleration)
            swap();
        if(!insertK){
            if (!NPLIST.isEmpty()) {
                 maxPos++;
                addOperations(P, P, NPLIST.remove() - P, true, false);
            }
            array[P+operations[P] + ops.stream().filter(e -> e.getMaxIncl() <= P && e.getMinIncl() >= P).mapToInt(Operation::getOperation).sum()] = val;
            addOperations(P + 1, maxPos + 1, -1, true, false);
            if (P > maxPos)
                maxPos = P-NPLIST.size();
        }else {
            if (!NPLIST.isEmpty()) {
                maxPos++;
                addOperations(P, P, NPLIST.remove() - P, true, false);
            }
            array[P+operations[P]] = val;
            addOperations(P + 1, maxPos + 1, -1, true, false);
            if (P > maxPos)
                maxPos = P-NPLIST.size();
        }
    }

    public E add(E val){
        if(countI >= 0-weightOfInsertionAcceleration)
            swap();
        maxPos++;
        if(NPLIST.isEmpty()){
            array[maxPos] = val;
        }else{
            insert(maxPos, val);
        }
        return val;
    }

    public E get(int P){
        if(countI >= weightOfAccessAcceleration)
            swap();
        if(!insertK)
        { // O(k)
            int mod = ops.stream().filter(e -> e.getMaxIncl() <= P && e.getMinIncl() >= P).mapToInt(Operation::getOperation).sum();
            return array[operations[P] + P+mod];
        }else // O(1)
            return array[P+operations[P]];
    }

    public E remove(int P){
        if(countI >= weightOfAccessAcceleration)
            swap();
        if(!insertK)
        {
            NPLIST.add(P);
            maxPos--;
            int mod = ops.stream().filter(e -> e.getMinIncl() >= P && e.getMaxIncl() <= P).mapToInt(Operation::getOperation).sum();
            E content = array[P+operations[P] + P+mod];
            array[P+operations[P] + P+mod] = null;
            addOperations(P,P,0-mod, false, true);
            addOperations(P,maxPos-1, +1, false, true);
            return content;
        }else{
            NPLIST.add(P);
            maxPos--;
            E content = array[P+operations[P]];
            array[P+operations[P]] = null;
            operations[P] = 0;
            addOperations(P, maxPos-1, +1, false, true);
            return content;
        }
    }


    private void addOperations(int pStart, int pEnd, int change, boolean isInsert, boolean isDelete){
        if(!insertK && !(isInsert && pEnd-pStart <= insertConstantBuffer) && !(isDelete && pEnd-pStart <= deleteConstantBuffer)) {
            ops.add(new Operation(pStart, pEnd, change));
        }else{
            for (int index = pStart; index <= pEnd; ++index) {
                operations[index] += change;
            }
        }
    }


    /**
     * @author Mark Russell
     * @version 10/17/17
     */
    class Operation{
        private int minIncl;
        private int maxIncl;
        private int operation;

        public int getMaxIncl() {
            return maxIncl;
        }

        public int getMinIncl() {
            return minIncl;
        }

        public int getOperation() {
            return operation;
        }

        public Operation(int minIncl, int maxIncl, int operation) {
            setMaxIncl(maxIncl);
            setMinIncl(minIncl);
            setOperation(operation);
        }

        public void setMaxIncl(int maxIncl) {
            this.maxIncl = maxIncl;
        }

        public void setMinIncl(int minIncl) {
            this.minIncl = minIncl;
        }

        public void setOperation(int operation) {
            this.operation = operation;
        }

        @Override
        public String toString() {
            return String.format(" %d to %d  %d ", minIncl,maxIncl,operation);
        }
    }
}
