
import java.io.*;
import java.time.LocalDateTime;
import java.util.LinkedList;

@SuppressWarnings("All")
public class DisplayStatistics
{
    private Display display;
    private static final String counterFile = "counter.txt";
    private static String output = "displayStats.out";

    private boolean InitErrorReadCounter = false;
    private boolean InitErrorWriteOutput = false;

    private static final String SEPARATOR = "\n__________________________________________\n";

    LinkedList<String> outputText = new LinkedList<>();


    {
        int numFiles = -1;
        try {
            BufferedReader in = new BufferedReader(new FileReader(counterFile));
            numFiles = in.read();
            output =  "displayStats" + numFiles + ".out";
            in.close();
        }catch(IOException e){
            System.err.print(e.getMessage() + "\n Issue with reading file \"counter.txt\"");
            InitErrorReadCounter = true;
        }
        if(!InitErrorReadCounter && numFiles != -1)
        {
            try{

                BufferedWriter out = new BufferedWriter(new PrintWriter(new FileWriter(counterFile)));
                out.write(++numFiles);
                out.close();
            }catch(IOException e){
                System.err.print(e.getMessage() + "\n Issue with reading file \"counter.txt\"");
                InitErrorWriteOutput = true;
            }
        }
        outputText.addLast(LocalDateTime.now().toString());
        outputText.addLast(SEPARATOR);

        outputText.addLast("# of log files: " + numFiles);
        outputText.addLast("INIT Error reading: " + InitErrorReadCounter);
        outputText.addLast("INIT Error wrtiting: " + InitErrorWriteOutput);
        outputText.addLast(SEPARATOR);
    }

    DisplayStatistics(Display display){
        this.display = display;

    }


}
