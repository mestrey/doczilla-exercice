type Node = {
  tubes: string[][];
  g: number;
  h: number;
  f: number;
  moves: number[][];
};

class MinHeap<Type> {
  private heap: any[] = [];

  getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);

      if (this.heap[index].f < this.heap[parentIndex].f) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  heapifyDown(index: number): void {
    let smallest = index;
    const left = this.getLeftChildIndex(index);
    const right = this.getRightChildIndex(index);

    if (left < this.heap.length && this.heap[left].f < this.heap[smallest].f) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right].f < this.heap[smallest].f) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  push(node: Type) {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): any {
    if (this.heap.length === 0) {
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

class Solver {
  public constructor(private tubes: string[][], private capacity: number) {}

  private isPure(tube: string[]): boolean {
    return tube.length !== 0 ? tube.every((ball: string) => ball === tube[0]) : false;
  }

  private computeHeuristic(tubes: string[][]): number {
    const colorTubes: Record<string, Set<number>> = {};
    for (const tube of tubes) {
      for (const ball of tube) {
        if (!colorTubes[ball]) {
          colorTubes[ball] = new Set<number>();
        }

        colorTubes[ball].add(tubes.indexOf(tube));
      }
    }

    return Object.values(colorTubes).reduce((sum, tubeSet) => sum + Math.max(0, tubeSet.size - 1), 0);
  }

  private isSolved(tubes: string[][]): boolean {
    const colorTubes: Record<string, number[]> = {};

    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0) continue;
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
      if (colorTubes[color].length > 1) {
        return false;
      }
    }

    return true;
  }

  private isValidMove(tubes: string[][], source: number, target: number): boolean {
    if (tubes[source].length === 0 || tubes[target].length >= 4) {
      return false;
    }
    const topSource = tubes[source][tubes[source].length - 1];
    if (tubes[target].length === 0) {
      return true;
    }
    const topTarget = tubes[target][tubes[target].length - 1];

    return topSource === topTarget;
  }

  private serialize(tubes: string[][]): string {
    let sortedTubes = [...tubes].sort((a, b) => {
      let strA = a.join(",");
      let strB = b.join(",");
      return strA.localeCompare(strB);
    });

    return sortedTubes.map((tube) => tube.join(",")).join("|");
  }

  public solve(): number[][] {
    const visited = new Set();
    const pq = new MinHeap<Node>();
    pq.push({
      tubes: JSON.parse(JSON.stringify(this.tubes)),
      g: 0,
      h: this.computeHeuristic(this.tubes),
      f: 0 + this.computeHeuristic(this.tubes),
      moves: [],
    });

    while (!pq.isEmpty()) {
      const node = pq.pop();
      const { tubes: currentTubes, g, moves } = node;

      if (this.isSolved(currentTubes)) {
        return moves;
      }

      const state = this.serialize(currentTubes);
      if (visited.has(state)) {
        continue;
      }
      visited.add(state);

      for (let source = 0; source < currentTubes.length; source++) {
        if (currentTubes[source].length === 0) {
          continue;
        }

        for (let target = 0; target < currentTubes.length; target++) {
          if (source === target) {
            continue;
          }

          if (this.isValidMove(currentTubes, source, target)) {
            const newTubes = JSON.parse(JSON.stringify(currentTubes));
            newTubes[target].push(newTubes[source].pop());
            const newState = this.serialize(newTubes);

            if (!visited.has(newState)) {
              const newG = g + 1;
              const newH = this.computeHeuristic(newTubes);

              pq.push({
                tubes: newTubes,
                g: newG,
                h: newH,
                f: newG + newH,
                moves: [...moves, [source, target]],
              });
            }
          }
        }
      }
    }

    return [];
  }
}

export default Solver;
