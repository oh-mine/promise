class Promise2 {
  callbacks: Array<Array<((data?: unknown) => {}) | Promise2>> = [];
  state = "pending";

  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fulfilled";
    setTimeout(() => {
      this.callbacks.forEach((handle) => {
        if (typeof handle[0] === "function") {
          const x = handle[0].bind(undefined)(result);
          (handle[2] as Promise2).resolveWith(x);
        }
      });
    });
  }
  resolveWith(x) {
    if (this === x) {
      this.reject(new TypeError());
    } else if (x instanceof Promise2) {
      x.then(
        (result) => this.resolve(result),
        (reason) => this.reject(reason)
      );
    } else if (x instanceof Object) {
      let then;
      try {
        then = x.then;
      } catch (error) {
        this.reject(error);
      }
      if (then instanceof Function) {
        try {
          x.then(
            (y) => this.resolveWith(y),
            (r) => this.reject(r)
          );
        } catch (error) {
          this.reject(error);
        }
      } else {
        this.resolve(x);
      }
    } else {
      this.resolve(x);
    }
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
    const handle: Array<((data?: unknown) => {}) | Promise2> = [];
    typeof onFulfilled === "function" && (handle[0] = onFulfilled);
    typeof onRejected === "function" && (handle[1] = onRejected);
    handle[2] = new Promise2(() => { });
    this.callbacks.push(handle);
    return handle[2];
  }
}

export default Promise2;
