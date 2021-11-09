import Promise from "../src/promise";

describe("Promise", () => {
  it("is a class", () => {
    expect(Promise).toBeInstanceOf(Function);
    expect(Promise.prototype).toBeInstanceOf(Object);
  });

  it("new Promise() must accept a function", () => {
    expect(() => {
      // @ts-ignore
      new Promise();
    }).toThrow();
    expect(() => {
      // @ts-ignore
      new Promise(1);
    }).toThrow();
    expect(() => {
      // @ts-ignore
      new Promise(false);
    }).toThrow();
  });

  it("new Promise(fn) generates an object，and contains then function", () => {
    const promise = new Promise(() => {});
    expect(promise.then).toBeInstanceOf(Function);
  });

  it("new Promise(fn) 中 fn 立即执行", () => {
    const foo = jest.fn();
    new Promise(foo);
    expect(foo).toBeCalled();
  });

  it("new Promise(fn) 中 fn 执行的时候接受 resolve 和 reject 两个函数", (done) => {
    new Promise((resolve, reject) => {
      expect(resolve).toBeInstanceOf(Function);
      expect(reject).toBeInstanceOf(Function);
      done();
    });
  });

  it("promise.then(success) 中的 success 会在 resolve 被调用的时候执行", (done) => {
    const success = jest.fn();
    const promise = new Promise((resolve, reject) => {
      resolve();
      setTimeout(() => {
        expect(success).toBeCalled();
        done();
      }, 10);
    });
    // @ts-ignore
    promise.then(success);
  });

  it("promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行", (done) => {
    const fail = jest.fn();
    const promise = new Promise((resolve, reject) => {
      reject();
      setTimeout(() => {
        expect(fail).toBeCalled();
        done();
      }, 10);
    });
    // @ts-ignore
    promise.then(null, fail);
  });
});
