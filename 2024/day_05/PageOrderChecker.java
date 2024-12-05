import java.io.*;
import java.util.*;

public class PageOrderChecker {
    private static final List<Rule> rules = new ArrayList();
    private static final List<Update> updates = new ArrayList();

    private static final String INPUT_FILE = "input.txt";

    private static class Rule {
        public int first;
        public int after;

        public Rule(int first, int after) {
            this.first = first;
            this.after = after;
        }

        public static Rule fromRow(String row) {
            int first = Integer.parseInt(row.substring(0, row.indexOf("|")));
            int after = Integer.parseInt(row.substring(row.indexOf("|") + 1));

            return new Rule(first, after);
        }
    }

    private static class Update {
        public List<Integer> numbers;

        public Update() {
            this.numbers = new ArrayList<Integer>();
        }

        public static Update fromRow(String row) {
            Update update = new Update();

            Arrays.stream(row.split(","))
                    .map(value -> Integer.parseInt(value))
                    .forEach(number -> {
                        update.numbers.add(number);
                    });

            return update;
        }

        public boolean hasRule(Rule rule) {
            return numbers.indexOf(rule.first) != -1 && numbers.indexOf(rule.after) != -1;
        }

        public boolean isInCorrectOrder(Rule rule) {
            if (!hasRule(rule)) {
                return false;
            }

            for (int i = 0; i < numbers.size(); i++) {
                int number = numbers.get(i);

                if (number == rule.first) {
                    return true;
                } else if (number == rule.after) {
                    return false;
                }
            }

            return false;
        }

        public int getMiddlePageNumber() {
            return numbers.get((int) Math.ceil(numbers.size() / 2));
        }
    }

    private static void parseInput() throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(INPUT_FILE));
        String line;

        boolean parsingRules = true;

        while ((line = br.readLine()) != null) {
            if (line.isEmpty()) {
                parsingRules = false;
            } else if (parsingRules) {
                rules.add(Rule.fromRow(line));
            } else {
                updates.add(Update.fromRow(line));
            }
        }
    }

    public static void main(String[] args) throws IOException {
        parseInput();

        int totalMiddlePageNumbers = updates.stream().filter(update -> {
                    boolean failsAnyRule = rules.stream().anyMatch(rule -> {
                        if (!update.hasRule(rule)) {
                            return false;
                        }

                        return !update.isInCorrectOrder(rule);
                    });

                    return !failsAnyRule;
                }).map(update -> update.getMiddlePageNumber())
                .reduce(0, (acc, curr) -> acc + curr);

        System.out.println(totalMiddlePageNumbers);
    }
}