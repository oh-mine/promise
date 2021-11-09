class Promise2 {
  callbacks: Array<Array<(data?: unknown) => void>> = [];
  state = "pending";

  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        typeof handle[0] === "function" && handle[0].bind(undefined)(result);
      });
    });
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        typeof handle[1] === "function" && handle[1].bind(undefined)(reason);
      });
    });
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("fn has to be a function");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    const handle: Array<(data?: unknown) => void> = [];
    typeof onFulfilled === "function" && (handle[0] = onFulfilled);
    typeof onRejected === "function" && (handle[1] = onRejected);
    this.callbacks.push(handle);
  }
}

export default Promise2;
