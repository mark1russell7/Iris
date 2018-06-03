public class Hashmap<K, V> {

    private double maxLoadFactor = .5;
    private Entry<K,V>[][] hashTable = (Entry<K,V>[][])(new Entry[2][16]);
    private int num = 0;
    private double loadFactor = 0.0;
    private V dummyV = (V)(new Object());

    public boolean hasKey(K key){
        return this.get(key) != null;
    }

    public V getValue(K key){
        Entry<K,V> val = this.get(key);
        return val != null ? val.getValue() : dummyV;
    }

    private void updateLoadFactor(){
        this.loadFactor = this.num/(2.0*this.hashTable[0].length);
        if(this.loadFactor >= this.maxLoadFactor)
            this.resize();
    }
    public void set(K key, V value){
        Entry<K,V> find = this.get(key);
        if(find == null){
            this.num++;
            this.updateLoadFactor();
            this.insert(new Entry<K,V>(key, value));
        }else{
            if(find.getValue() == dummyV){
                this.num++;
                this.updateLoadFactor();
            }
            find.setValue(value);
        }
    }
    private void resize(){
        Entry<K, V>[][] nht = (Entry<K,V>[][])(new Entry[2][this.hashTable[0].length*2]);
        Entry<K, V>[][] old = this.hashTable;
        this.hashTable = nht;
        for(int index = 0; index < old.length; index++){
            for(int indexIn = 0; indexIn < old[index].length; indexIn++){
                this.insert(old[index][indexIn]);
            }
        }
        this.updateLoadFactor();
    }
    public void insert(Entry<K, V> entry){
        int tries = 0;
        int lastTableNumber = 1;
        while(entry != null){
            if(tries >= this.hashTable[0].length + this.hashTable[1].length){
                this.resize();
                tries = 0;
            }
            if(!this.hasKey(entry.getKey()) || this.getValue(entry.getKey()) == dummyV){
                if(lastTableNumber == 0){
                    int hash2 = this.hashTwo(entry.getKey());
                    Entry<K,V> temp = this.hashTable[1][hash2];
                    this.hashTable[1][hash2] = entry;
                    entry = temp;
                    tries++;
                    lastTableNumber = 1;
                }else{
                    int hash1 = this.hashOne(entry.getKey());
                    Entry<K,V> temp = this.hashTable[0][hash1];
                    this.hashTable[0][hash1] = entry;
                    entry = temp;
                    tries++;
                    lastTableNumber = 0;

                }
            }
        }
    }

    private int hashOne(K key){
        int hash = 1;
        String string = key.toString();
        for(int index = 0; index < string.length(); index++){
            hash = 17*hash + string.charAt(index);
        }
        return (int)Math.abs(Math.floor(hash)%this.hashTable[0].length);
    }
    private int hashTwo(K key){
        int hash = 1;
        String string = key.toString();
        for(int index = 0; index < string.length(); index++){
            hash = 31*hash + string.charAt(index);
        }
        return (int)Math.abs(Math.floor(hash)%this.hashTable[1].length);
    }

    public Entry<K, V> get(K key){
        int hash1 = this.hashOne(key);
        int hash2 = this.hashTwo(key);
        if(this.hashTable[0][hash1] != null && this.hashTable[0][hash1].getKey().toString().equals(key.toString()))
            return this.hashTable[0][hash1];
        else if(this.hashTable[1][hash2] != null && this.hashTable[1][hash2].getKey().toString().equals(key.toString()))
            return this.hashTable[1][hash2];
        else
            return null;
    }
}
