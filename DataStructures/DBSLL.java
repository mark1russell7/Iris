public class DBSLL
{
    private DBSLLNode head;
    private int size = 0;
    private DBSLLNode tail;


    public DBSLLNode getHead() {
        return head;
    }

    public DBSLLNode getTail() {
        return tail;
    }

    public DBSLLNode removeFront() {
        DBSLLNode h = head;
        if (h.getNext() != null) {
            h.getNext().setPrev(null);
            head = h.getNext();
        }
        if (h.getNextSeq() != null){
            if (h.getPrevSeq() != null)
                h.getNextSeq().setPrevSeq(h.getPrevSeq());
            else
                h.getNextSeq().setPrevSeq(null);
        }
        if(h.getPrevSeq() != null)
            h.getPrevSeq().setNextSeq(h.getNextSeq());
        size--;
        return h;
    }

    public DBSLLNode removeTail(){
        DBSLLNode t = tail;
        if(t.getPrev() != null) {
            t.getPrev().setNext(null);
            tail = t.getPrev();
        }
        if(t.getNextSeq() != null) {
            if(t.getPrevSeq() != null)
                t.getNextSeq().setPrevSeq(t.getPrevSeq());
            else
                t.getNextSeq().setPrevSeq(null);
        }
        if(t.getPrevSeq() != null)
            t.getPrevSeq().setNextSeq(t.getNextSeq());
        size--;
        return t;
    }

    public void remove(DBSLLNode node){
        if(node.getPrev() != null) {
            node.getPrev().setNext(node.getNext());
        }
        if(node.getNext() != null)
            node.getNext().setPrev(node.getPrev());
        if(node.getNextSeq() != null) {
            if(node.getPrevSeq() != null)
                node.getNextSeq().setPrevSeq(node.getPrevSeq());
            else
                node.getNextSeq().setPrevSeq(null);
        }
        if(node.getPrevSeq() != null)
            node.getPrevSeq().setNextSeq(node.getNextSeq());
        size--;
    }

    public int getSize() {
        return size;
    }

    public void addEnd(DBSLLNode node, DBSLLNode prevSeq) {
        if(prevSeq != null) {
            prevSeq.setNextSeq(node);
            node.setPrevSeq(prevSeq);
        }
        if(tail != null) {
            tail.setNext(node);
            node.setPrev(tail);
        }
        size++;
        if(head == null)
            head = node;
        tail = node;
    }
    public void addBetweenContinueSeq(DBSLLNode pre, DBSLLNode node, DBSLLNode aft, DBSLLNode prevSeq) {
        prevSeq.setNextSeq(node);
        node.setPrevSeq(prevSeq);
        pre.setNext(node);
        aft.setPrev(node);
        node.setPrev(pre);
        node.setNext(aft);
        size++;
    }

    public void addBetweenModifySeq(DBSLLNode pre, DBSLLNode node, DBSLLNode aft)
    {
        node.setNextSeq(aft);
        node.setPrevSeq(pre);
        node.setNext(aft);
        node.setPrev(pre);
        pre.setNext(node);
        pre.setNextSeq(node);
        aft.setPrev(node);
        aft.setPrevSeq(node);
        size++;
    }

    public void addStartModifySeq(DBSLLNode node){
        if(head != null) {
            node.setNext(head);
            node.setNextSeq(head);
            head.setPrevSeq(node);
            head.setPrev(head);
        }
        head = node;
        size++;
    }

    public void addStartContinueSeq(DBSLLNode node, DBSLLNode prevSeq) {
        if(head != null) {
            node.setPrevSeq(prevSeq);
            node.setNext(head);
            head.setPrev(node);
        }
        head = node;
        size++;
    }
}