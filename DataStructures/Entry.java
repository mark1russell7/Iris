public class Entry<E,V>{
    private E key;
    private V value;

    public Entry(E e, V v){
        this.key = e;
        this.value = v;
    }

    public void setKey(E key) {
        this.key = key;
    }

    public void setValue(V value) {
        this.value = value;
    }

    public E getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}