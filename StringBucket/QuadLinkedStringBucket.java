import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class QuadLinkedStringBucket
{
    DBSLL[] buckets = new DBSLL[128];
    int size = 0;
    DBSLLNode lastNode;
    DBSLLNode first;

    QuadLinkedStringBucket(){
        for(int index = 0; index < 128; ++index)
            buckets[index] = new DBSLL();
    }

    public void append(String str){
        for(int index = 0; index < str.length(); ++index)
            append(str.charAt(index));
    }

    public void setFirst(String first) {
        this.first = append(first.charAt(0));
        for(int index = 1; index < first.length(); ++index)
            append(first.charAt(index));
    }

    public DBSLLNode append(char character) {
        DBSLLNode node = new DBSLLNode(character, size);
        buckets[(int)character].addEnd(node, lastNode);
//        if(lastNode != null)
//            System.out.print(lastNode.getData());
        lastNode = node;
        size++;
        return node;
    }

    public static DBSLLNode getNextSequential(DBSLLNode node){
        return node.getNextSeq();
    }
    public DBSLLNode getPreviousSequential(DBSLLNode node){
        return  node.getPrevSeq();
    }

    public String getStringToEnd(DBSLLNode node){
        StringBucket sub = new StringBucket();
        DBSLLNode cur = node;
        while(cur.hasNextSeq()) {
            sub.append(cur.getData());
            cur = getNextSequential(cur);
        }
        return sub.toString();
    }

    public List<DBSLLNode> getMatchingStrings(String str){
        DBSLL dbsll = buckets[(int)str.charAt(0)];
        List<DBSLLNode> list = new ArrayList<>(dbsll.getSize());
        DBSLLNode cur = dbsll.getHead();
        for(int index = 0; index < dbsll.getSize(); ++index){
            if(doesStringMatch(str, cur))
                list.add(cur);
        }
        return list;
    }

    public List<Character> getCharactersAfter(String str){
        List<DBSLLNode> dList = getMatchingStrings(str, str.length());
        List<Character> list = new ArrayList<>(dList.size());
        for (int index = 0; index < dList.size(); ++index)
            list.add(dList.get(index).getData());
        return list;
    }

    public List<DBSLLNode> getMatchingStrings(String str, int pos){
        DBSLL dbsll = buckets[(int)str.charAt(0)];
        List<DBSLLNode> list = new ArrayList<>(dbsll.getSize());
        DBSLLNode cur = dbsll.getHead();
        boolean wasGood = true;
        for(int index = 0; index < dbsll.getSize(); ++index){
            DBSLLNode cur2 = cur;
            for(int i = 0; i < str.length(); ++i)
            {
                if(cur2 == null) {
                    wasGood = false;
                    break;
                }
                if(str.charAt(i) != cur2.getData().charValue()) {
                    wasGood = false;
                    break;
                }
                cur2 = cur2.getNextSeq();
            }
            if(wasGood) {
                if(cur2.getNextSeq() != null) {
                    list.add(cur2);
                }
            }
            wasGood = true;
            cur = cur.getNext();
        }
        return list;
    }

    public char getNextChar(Random random, String seed){
        List<Character> characters = getCharactersAfter(seed);
        return characters.get(random.nextInt(characters.size()));
    }

    public static boolean doesStringMatch(String str, DBSLLNode node){
        DBSLLNode cur = node;
        for(int index = 0; index < str.length(); ++index)
        {
            if(str.charAt(index) != cur.getData())
                return false;
            cur = getNextSequential(cur);
        }
        return true;
    }

    @Override
    public String toString() {
        char[] str = new char[size];                                               // O(n) create a character array the size of the string, n is the length of the string
        DBSLLNode firstN = first;
        for(int i = 0; i < size; ++i){
            str[i] = firstN.getData();
            firstN = getNextSequential(firstN);
        }
        return new String(str);
    }
}
