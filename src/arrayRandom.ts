interface Array<T> {
  pickRandom(): T;
}

Array.prototype.pickRandom = function <T>(this: Array<T>): T {
  return this[Math.floor(Math.random() * this.length)];
}