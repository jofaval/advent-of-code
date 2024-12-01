import java.util.List;
import java.util.Arrays;
import java.util.Collections;
import java.io.*;
import java.util.*;

public class HistorianHysteria {
    public static void main(String[] args) {
        List<Integer> leftList = new ArrayList<>();
        List<Integer> rightList = new ArrayList<>();

        // Read input from file
        try (BufferedReader br = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split("\\s+");
                leftList.add(Integer.parseInt(parts[0]));
                rightList.add(Integer.parseInt(parts[1]));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Sort both lists
        Collections.sort(leftList);
        Collections.sort(rightList);

        // Calculate total distance
        int totalDistance = 0;
        for (int i = 0; i < leftList.size(); i++) {
            totalDistance += Math.abs(leftList.get(i) - rightList.get(i));
        }

        // Print the total distance
        System.out.println("Total Distance: " + totalDistance);
    }

    // Función para calcular la distancia total entre dos listas
    public static int calculateTotalDistance(List<Integer> leftList, List<Integer> rightList) {
        // Ordenar ambas listas
        Collections.sort(leftList);
        Collections.sort(rightList);

        int totalDistance = 0;

        // Calcular la distancia entre los pares de números correspondientes
        for (int i = 0; i < leftList.size(); i++) {
            totalDistance += Math.abs(leftList.get(i) - rightList.get(i));
        }

        return totalDistance;
    }
}