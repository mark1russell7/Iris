import javax.swing.*;
import java.awt.*;
import java.util.*;
import java.util.function.*;
public class Board extends Canvas{
    Map<Piece, String[]> pieceMap = new HashMap<>();
    Square[] board = new Square[]{new Square(0,null), new Square(1,new Piece("rook", true)), new Square(2,new Piece("knight", true)), new Square(3,new Piece("bishop", true)), new Square(4,new Piece("queen", true)), new Square(5,new Piece("king", true)), new Square(6,new Piece("bishop", true)), new Square(7,new Piece("knight", true)), new Square(8,new Piece("rook", true)), new Square(9,new Piece("pawn", true)), new Square(10,new Piece("pawn", true)), new Square(11,new Piece("pawn", true)), new Square(12,new Piece("pawn", true)), new Square(13,new Piece("pawn", true)), new Square(14,new Piece("pawn", true)), new Square(15,new Piece("pawn", true)), new Square(16,new Piece("pawn", true)), new Square(17,null), new Square(18,null), new Square(19,null), new Square(20,null), new Square(21,null), new Square(22,null), new Square(23,null), new Square(24,null), new Square(25,null), new Square(26,null), new Square(27,null), new Square(28,null), new Square(29,null), new Square(30,null), new Square(31,null), new Square(32,null), new Square(33,null), new Square(34,null), new Square(35,null), new Square(36,null), new Square(37,null), new Square(38,null), new Square(39,null), new Square(40,null), new Square(41,null), new Square(42,null), new Square(43,null), new Square(44,null), new Square(45,null), new Square(46,null), new Square(47,null), new Square(48,null), new Square(49,new Piece("pawn", false)), new Square(50,new Piece("pawn", false)), new Square(51,new Piece("pawn", false)), new Square(52,new Piece("pawn", false)), new Square(53,new Piece("pawn", false)), new Square(54,new Piece("pawn", false)), new Square(55,new Piece("pawn", false)), new Square(56,new Piece("pawn", false)), new Square(58,new Piece("rook", false)), new Square(59,new Piece("knight", false)), new Square(60,new Piece("bishop", false)), new Square(61,new Piece("queen", false)), new Square(62,new Piece("king", false)), new Square(63,new Piece("bishop", false)), new Square(64,new Piece("knight", false)), new Square(65,new Piece("rook", false))};
    boolean isWhite = true;
    BiFunction<Square, Square, Boolean> isValidMove = (start,end) -> (pieceMap.get(start.currentPiece)[0].equalsIgnoreCase("PAWN") ? (pieceMap.get(start.currentPiece)[1].equalsIgnoreCase("TRUE") == start.verticalDistance.apply(end) > 0)&& ((Math.abs(start.verticalDistance.apply(end)) >= 2 ? (Math.abs(start.verticalDistance.apply(end)) == 2 && !pieceMap.get(start.currentPiece)[2].equalsIgnoreCase("TRUE") && start.horizontalDistance.apply(end) == 0) : true) && (Math.abs(start.verticalDistance.apply(end)) == 1 ? (start.horizontalDistance.apply(end) == 0 && end.currentPiece == null) ^ (Math.abs(start.horizontalDistance.apply(end)) == 1 && end.currentPiece != null && pieceMap.get(end.currentPiece)[1].equalsIgnoreCase("TRUE") != isWhite) : true)) : true) && ((pieceMap.get(start.currentPiece)[0].equalsIgnoreCase("KING") ? (((Math.abs(start.horizontalDistance.apply(end)) <= 1 && (Math.abs(start.verticalDistance.apply(end)) <= 1)) || (start.verticalDistance.apply(end) == 0 && (start.horizontalDistance.apply(end) == 2 && (!board[start.pos+1].isUnderFire.getAsBoolean()) && start.pos < 63 && !board[start.pos+2].isUnderFire.getAsBoolean() && !pieceMap.get(start.currentPiece)[2].equalsIgnoreCase("TRUE") && (start.pos < 62 && board[start.pos+3].currentPiece != null) && start.pos < 62 && !pieceMap.get(board[start.pos+3].currentPiece)[2].equalsIgnoreCase("TRUE") || start.horizontalDistance.apply(end) == -2 && start.pos > 1 && !board[start.pos-1].isUnderFire.getAsBoolean() && start.pos > 2 && !board[start.pos-2].isUnderFire.getAsBoolean() && !pieceMap.get(start.currentPiece)[2].equalsIgnoreCase("TRUE") && start.pos > 4 && !pieceMap.get(board[start.pos-4].currentPiece)[2].equalsIgnoreCase("TRUE"))))) : true)) && (pieceMap.get(start.currentPiece)[1].equalsIgnoreCase("TRUE") == isWhite) && ((pieceMap.get(start.currentPiece)[0].equalsIgnoreCase("BISHOP") ? start.itrDiag.apply(end) : true) && (pieceMap.get(start.currentPiece)[0].equalsIgnoreCase("QUEEN") ? (start.itrDiag.apply(end)||start.itrHori.apply(end) || start.itrVert.apply(end)) : true) && (pieceMap.get(start.currentPiece)[0].equalsIgnoreCase("ROOK") ? (start.itrVert.apply(end) || start.itrHori.apply(end)): true)) && (end.currentPiece != null ? pieceMap.containsKey(end) && !pieceMap.get(end)[1].equalsIgnoreCase(pieceMap.get(start)[1]) : true);
    BooleanSupplier check = () -> Arrays.stream(board).filter(e -> e.currentPiece != null && pieceMap.get(e.currentPiece)[0].equalsIgnoreCase("king")).anyMatch(e -> pieceMap.get(e.currentPiece)[1].equalsIgnoreCase("TRUE") == isWhite && e.isUnderFire.getAsBoolean()), noMoves = () -> Arrays.stream(board).filter(e -> e.currentPiece != null && pieceMap.get(e.currentPiece)[1].equalsIgnoreCase("TRUE") == isWhite).anyMatch(e -> Arrays.stream(board).anyMatch(f -> isValidMove.apply(e,f) && moveOrNo(e,f,false)));
    Function<String[], Boolean> moveFxn = (moves) -> (isValidMove.apply(board[(moves[0].charAt(0) -'a'+1)+((moves[0].charAt(1)-'0'-1))*8], board[(moves[1].charAt(0) -'a'+1)+((moves[1].charAt(1)-'0'-1))*8]) && !moveOrNo(board[(moves[0].charAt(0) -'a'+1)+((moves[0].charAt(1)-'0'-1))*8], board[(moves[1].charAt(0) -'a'+1)+((moves[1].charAt(1)-'0'-1))*8], true)) ? !isWhite : isWhite;
    JFrame jFrame = new JFrame();{jFrame.add(this);jFrame.setSize(500, 500);jFrame.setVisible(true);}
    public static void main(String[] args){
        Board board = new Board();
        while(!board.noMoves.getAsBoolean()){
            board.repaint();
            board.isWhite = board.moveFxn.apply(new Scanner(System.in).nextLine().split(" "));}}
    public Piece move(Square start, Square end){
        Piece endPiece = end.currentPiece;
        end.currentPiece = start.currentPiece;
        start.currentPiece = null;
        return endPiece; }
    public boolean moveOrNo(Square start, Square end, boolean make){
        Piece endPiece = move(start,end);
        boolean check1 = check.getAsBoolean();
        if(!make || check1){
            start.currentPiece = end.currentPiece;
            end.currentPiece = endPiece; } else {
            pieceMap.get(end.currentPiece)[2] = "TRUE";
            move((board[(pieceMap.get(end.currentPiece)[0].equalsIgnoreCase("king") && start.horizontalDistance.apply(end) == 2 && make) ? (start.pos-end.pos < 0 ? start.pos+3 : start.pos-4) : 0]),board[(pieceMap.get(end.currentPiece)[0].equalsIgnoreCase("king") && start.horizontalDistance.apply(end) == 2 && make) ? (start.pos-end.pos < 0 ? start.pos+1 : start.pos-1) : 0]);}
        return check1;}
    class Square{ // todo implement hashmap (or something like it for squares too if possible
        int pos = 0;
        Piece currentPiece = null;
        Square(int pos, Piece piece){
            this.pos = pos;
            this.currentPiece = piece;}
        Function<Square, Integer> verticalDistance = (s) -> (s.pos-1)/8 - (pos-1)/8,horizontalDistance = (s) -> s.pos%8 - pos%8; // todo combine this and bottom line using second type parameter 'Object' then cast every time you use it
        Function<Square, Boolean> horizontal = (s) -> Math.abs(horizontalDistance.apply(s)) > 0 && verticalDistance.apply(s) == 0, vertical = (s) -> Math.abs(verticalDistance.apply(s)) > 0 && horizontalDistance.apply(s) == 0, diagonal = (s) -> Math.abs(horizontalDistance.apply(s)) == Math.abs(verticalDistance.apply(s)), itrDiag = (s) -> (diagonal.apply(s)) && Arrays.stream(Arrays.copyOfRange(board, Math.min(pos, s.pos), Math.max(pos, s.pos))).filter(e -> diagonal.apply(e) && (Math.abs(verticalDistance.apply(s)) > Math.abs(verticalDistance.apply(e))) && (Math.abs(horizontalDistance.apply(s))> Math.abs(horizontalDistance.apply(e))) && (Math.abs(verticalDistance.apply(e)) == Math.abs(horizontalDistance.apply(e))) && (verticalDistance.apply(e)< 0 == verticalDistance.apply(s) < 0) && (horizontalDistance.apply(e) < 0 == horizontalDistance.apply(s) < 0) && e.currentPiece != null).noneMatch(e -> e.currentPiece != null), itrHori = (s) -> (horizontal.apply(s)) && Arrays.stream(Arrays.copyOfRange(board, Math.min(pos, s.pos), Math.max(pos, s.pos))).filter(e -> verticalDistance.apply(e) == 0 && horizontalDistance.apply(e) < 0 == horizontalDistance.apply(s) < 0  && (Math.abs(horizontalDistance.apply(e)) < Math.abs(horizontalDistance.apply(s)))&& horizontal.apply(e)).noneMatch(e -> e.currentPiece != null), itrVert = (s) -> (vertical.apply(s)) && Arrays.stream(Arrays.copyOfRange(board, Math.min(pos, s.pos), Math.max(pos, s.pos))).filter(e -> horizontalDistance.apply(e) == 0 && (verticalDistance.apply(e) < 0 == verticalDistance.apply(s) < 0) && (Math.abs(verticalDistance.apply(e)) < Math.abs(verticalDistance.apply(s))) && vertical.apply(e)).noneMatch(e -> e.currentPiece != null);
        BooleanSupplier isUnderFire = () -> Arrays.stream(board).anyMatch(e -> e.currentPiece != null && pieceMap.get(e.currentPiece)[1].equalsIgnoreCase("TRUE") != isWhite && isValidMove.apply(e, this));}
    class Piece { Piece(String pieceType, boolean isWhite){ pieceMap.put(this,new String[] {pieceType, isWhite+"", "FALSE"}); }}
    @Override public void paint(Graphics g) {
        g.fillPolygon(new int[] {400, 425, 425}, new int[] {50 + (isWhite ? 400 : 0), 25+(isWhite ? 400 : 0), 75+(isWhite ? 400 : 0)},3);
        for(int index = 0; index < 64; ++index) {
            g.setColor((index%8 == 0 ^ index == 0) ? g.getColor() : (g.getColor() == Color.BLACK  ? Color.WHITE : Color.BLACK));
            g.fillRect((index%8)*50, 400-(index/8)*50, 50,50);
            try {
                if(board[index+1].currentPiece != null)
                    g.drawImage(javax.imageio.ImageIO.read(new java.io.File((pieceMap.get(board[index+1].currentPiece)[1].equalsIgnoreCase("TRUE") ? "WHITE" : "BLACK") + "_" + pieceMap.get(board[index+1].currentPiece)[0].toUpperCase() + "_" + (g.getColor() == Color.BLACK ? "BLACK" : "WHITE") + ".jpg")), (index % 8) * 50, 400 - (index / 8) * 50, 50, 50, null);
            }catch (java.io.IOException e){} } }} //