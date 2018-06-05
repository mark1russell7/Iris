public class DBSLLNode
{
    private DBSLLNode next;
    private DBSLLNode prev;
    private DBSLLNode nextSeq;
    private DBSLLNode prevSeq;
    private Character data;
    private int index;



    DBSLLNode(Character data, int index){
        setData(data);
        setIndex(index);
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getIndex() {
        return index;
    }

    public boolean hasNextSeq(){
        return nextSeq != null;
    }

    public boolean hasPrevSeq(){
        return prevSeq != null;
    }

    public void setPrev(DBSLLNode prev) {
        this.prev = prev;
    }

    public void setNext(DBSLLNode next) {
        this.next = next;
    }

    public void setNextSeq(DBSLLNode nextSeq) {
        this.nextSeq = nextSeq;
    }

    public void setPrevSeq(DBSLLNode prevSeq) {
        this.prevSeq = prevSeq;
    }

    public DBSLLNode getNextSeq() {
        return nextSeq;
    }

    public Character getData() {
        return data;
    }

    public DBSLLNode getNext() {
        return next;
    }

    public DBSLLNode getPrev() {
        return prev;
    }

    public DBSLLNode getPrevSeq() {
        return prevSeq;
    }

    public void setData(Character data) {
        this.data = data;
    }
}
