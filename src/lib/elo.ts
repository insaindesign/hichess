type Options = {
  kFactor: number;
};

export type EloResult = 0 | 0.5 | 1;

export default class Elo {
  private static perf = 400;
  private kFactor: number;

  constructor(options: Partial<Options> = {}) {
    this.kFactor = options.kFactor ?? 32;
  }

  public probability(a: number, b: number): [number, number] {
    return [
      1 / (1 + 10 ** ((b - a) / Elo.perf)),
      1 / (1 + 10 ** ((a - b) / Elo.perf)),
    ];
  }

  public calculate(a: number, b: number, S: EloResult = 1): [number, number] {
    const [Ea, Eb] = this.probability(a, b);
    return [a + this.kFactor * (S - Ea), b + this.kFactor * (1 - S - Eb)];
  }
}
