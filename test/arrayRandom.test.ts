import "../src/arrayRandom";

describe("Array randomization", () => {
  test("empty array", () => {
    let result = [].pickRandom();
    expect(result).toBeUndefined();
  });

  test("array with 1 element", () => {
    let result = [42].pickRandom();
    expect(result).toBe(42);
  });

  test("array with 5 elements", () => {
    // check if array randomization will every return element at bound, statistically it should
    let arr = [0, 1, 2, 3, 4];
    let result = [false, false, false, false, false];
    for (let i = 0; i < 10000; i++) {
      result[arr.pickRandom()] = true;
      if (result.every(item => item)) {
        break;
      }
    }
    expect(result.every(item => item)).toBe(true);
  });
})