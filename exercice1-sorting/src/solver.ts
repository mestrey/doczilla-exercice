class Solver {
  private visited: Set<string>;

  public constructor(private tubes: string[][], private capacity: number) {
    this.visited = new Set();
  }

  public solve() {
    this.visited.clear();
    const result = this.dfs(this.tubes);

    return result.success ? result.moves : [];
  }

  private dfs(tubes: string[][]): { success: boolean; moves: number[][] } {
    if (this.isSolved(tubes)) {
      return { success: true, moves: [] };
    }

    const state = this.serialize(tubes);
    if (this.visited.has(state)) {
      return { success: false, moves: [] };
    }
    this.visited.add(state);

    for (let source = 0; source < tubes.length; source++) {
      if (tubes[source].length === 0) {
        continue;
      }

      const ball = tubes[source][tubes[source].length - 1];

      for (let target = 0; target < tubes.length; target++) {
        if (source === target) {
          continue;
        }

        if (this.isValidMove(tubes, source, target)) {
          const newTubes = JSON.parse(JSON.stringify(tubes));
          newTubes[target].push(newTubes[source].pop());

          const result = this.dfs(newTubes);
          if (result.success) {
            result.moves.unshift([source, target]);

            return result;
          }
        }
      }
    }

    return { success: false, moves: [] };
  }

  private isSolved(tubes: string[][]) {
    const colorTubes: Record<string, number[]> = {};

    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0) {
        continue;
      }
      const color = tubes[i][0];
      if (!colorTubes[color]) {
        colorTubes[color] = [];
      }
      colorTubes[color].push(i);
      if (!tubes[i].every((ball) => ball === color)) {
        return false;
      }
    }

    for (const color in colorTubes) {
      if (colorTubes[color].length > 1) return false;
    }

    return true;
  }

  private isValidMove(tubes: string[][], source: number, target: number) {
    if (tubes[source].length === 0) {
      return false;
    }
    if (tubes[target].length >= this.capacity) {
      return false;
    }
    if (tubes[target].length === 0) {
      return true;
    }

    const topSource = tubes[source][tubes[source].length - 1];
    const topTarget = tubes[target][tubes[target].length - 1];

    return topSource === topTarget;
  }

  private serialize(tubes: string[][]) {
    return tubes.map((tube) => tube.join(",")).join("|");
  }
}

export default Solver;
