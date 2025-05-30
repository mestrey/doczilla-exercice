import Solver from "./solver";
import Visualizator from "./visualizator";

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = <Type>(question: string) => {
  return new Promise<Type>((resolve) => {
    rl.question(question, (answer: Type) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  const choice = await askQuestion(`Actions:
1. Enter custom input
2. Try example
> `);

  let input: string[][] = [];
  let capacity: number;

  if (choice === "1") {
    const tubes = await askQuestion<number>(`How many tubes? `);
    capacity = await askQuestion<number>(`Tube capacity? `);

    for (let i = 0; i < tubes; i++) {
      const colors = await askQuestion<string>(`Tube ${
        i + 1
      }. Enter the colors by symbol (number or string), separated by space. For example '1 2 3'
      > `);
      input.push(colors.split(" ").filter((v) => !!v));
    }
  } else {
    capacity = 4;
    input = [
      "2a44",
      "18d8",
      "a759",
      "5325",
      "6b87",
      "dd12",
      "478b",
      "ab31",
      "a799",
      "626b",
      "4693",
      "53d1",
      "",
      "",
    ].map((e) => e.split(""));
  }

  const solver = new Solver(input, capacity);
  const solution = solver.solve();
  console.log("\nMoves:", solution.length);
  console.log("Solution:", solution, "\n");

  const wantsVisualization = (await askQuestion<string>(`Visualize (YES/no)? `)) !== "no";
  if (wantsVisualization) {
    const visualizator = new Visualizator(input, solution, capacity);
    await visualizator.startServer();
  }

  rl.close();
};

main();
