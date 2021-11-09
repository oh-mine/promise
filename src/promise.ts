class Promise2 {
  successd;
  faild;

  resolve() {
    setTimeout(() => {
      this.successd();
    });
  }
  reject() {
    setTimeout(() => {
      this.faild();
    });
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("fn has to be a function");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(successd, faild) {
    this.successd = successd;
    this.faild = faild;
  }
}

export default Promise2;
