export class UpsetData {
  id: string;
  sets: string[];
  size = 0;
  combinations: { setId: string; member: boolean }[];
  connectorIndices: [number, number] | [undefined, undefined];

  constructor(data: Partial<UpsetData>) {
    this.id = <string>data.id;
    this.sets = data.sets || [];
    this.size = data.size || 0;
    this.combinations = data.combinations || [];
    this.connectorIndices = data.connectorIndices || [undefined, undefined];
  }
}

export class UpsetPlot {
  allSetIds: { id: string; count: number }[] = [];
  data: UpsetData[];

  constructor(data: UpsetData[]) {
    let idArr: string[] = [];
    data.forEach((d) => idArr.push(...d.sets));
    idArr = [...new Set(idArr)];
    idArr.forEach((set) => {
      let count = 0;
      data.forEach((datum) => {
        if (datum.sets.includes(set)) {
          count = count + datum.size;
        }
      });
      this.allSetIds.push({ id: set, count: count });
    });

    // Process data: check set membership for each combination
    this.data = data.map((combination) => {
      this.allSetIds.forEach((d) => {
        combination.combinations?.push({
          setId: d.id,
          member: combination.sets.includes(d.id),
        });
      });

      // Determine which sets (circles in the combination matrix) should be connected with a line
      if (combination.sets.length > 1) {
        let retArr: number[] = [];
        combination.sets.forEach((set) => {
          const tempids = this.allSetIds.map((set) => set.id);
          retArr.push(tempids.indexOf(set));
        });
        retArr = retArr.sort((a, b) => a - b);
        combination.connectorIndices = [retArr[0], retArr[retArr.length - 1]];
      } else {
        combination.connectorIndices = [0, 0];
      }
      return combination;
    });
    this.allSetIds = [...new Set(this.allSetIds)];
  }
}
