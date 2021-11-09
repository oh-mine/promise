// add all jest-extended matchers
// @ts-ignore
import * as matchers from "jest-extended";
expect.extend(matchers);
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

  it("promise.then(onFulfilled) 中的 onFulfilled 会在 resolve 被调用的时候执行", (done) => {
    const onFulfilled = jest.fn();
    const promise = new Promise((resolve) => {
      expect(onFulfilled).not.toBeCalled();
      resolve();
      setTimeout(() => {
        expect(onFulfilled).toBeCalled();
        done();
      });
    });
    // @ts-ignore
    promise.then(onFulfilled);
  });

  it("promise.then(null, onRejected) 中的 onRejected 会在 reject 被调用的时候执行", (done) => {
    const onRejected = jest.fn();
    const promise = new Promise((resolve, reject) => {
      expect(onRejected).not.toBeCalled();
      reject();
      setTimeout(() => {
        expect(onRejected).toBeCalled();
        done();
      });
    });
    // @ts-ignore
    promise.then(null, onRejected);
  });

  it("2.2.1 onFulfilled 和 onRejected 都是可选参数，且不是函数时，必须忽略", () => {
    const promise = new Promise((resolve) => {
      resolve();
    });
    promise.then(false, null);

    const promise2 = new Promise((resolve, reject) => {
      reject();
    });
    promise2.then(null, false);
  });

  it("2.2.2 onFulfilled 必须在 resolve(result) 后被调用，result 作为 onFulfilled 的第一个参数，不能被调用多次", (done) => {
    const onFulfilled = jest.fn();
    const promise = new Promise((resolve) => {
      expect(onFulfilled).not.toBeCalled();
      resolve(123);
      resolve(234);
      setTimeout(() => {
        expect(promise.state).toBe("fulfilled");
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(123);
        done();
      });
    });
    promise.then(onFulfilled);
  });

  it("2.2.3 onRejected 必须在 reject(reason) 后被调用，reason 作为 onRejected 的第一个参数，不能被调用多次", (done) => {
    const onRejected = jest.fn();
    const promise = new Promise((resolve, reject) => {
      expect(onRejected).not.toBeCalled();
      reject(123);
      reject(234);
      setTimeout(() => {
        expect(promise.state).toBe("rejected");
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(123);
        done();
      });
    });
    promise.then(null, onRejected);
  });

  it("2.2.4 在当前执行上下文中代码为执行完毕之前，onFulfilled 不能被调用", (done) => {
    const onFulfilled = jest.fn();
    const promise = new Promise((resolve) => {
      resolve();
    });
    promise.then(onFulfilled);
    expect(onFulfilled).not.toBeCalled();
    setTimeout(() => {
      expect(onFulfilled).toBeCalled();
      done();
    });
  });

  it("2.2.4 在当前执行上下文中代码为执行完毕之前，onRejected 不能被调用", (done) => {
    const onRejected = jest.fn();
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, onRejected);
    expect(onRejected).not.toBeCalled();
    setTimeout(() => {
      expect(onRejected).toBeCalled();
      done();
    });
  });

  it("2.2.5 onFulfilled 作为函数被调用（this 没有值）", () => {
    const promise = new Promise((resolve) => {
      resolve();
    });
    promise.then(function () {
      "use strict";
      expect(this).toBe(undefined);
    });
  });

  it("2.2.5 onRejected 作为函数被调用（this 没有值）", () => {
    const promise = new Promise((reject) => {
      reject();
    });
    promise.then(null, function () {
      "use strict";
      expect(this).toBe(undefined);
    });
  });

  it("2.2.6 同一个 promise 上的 then 可以被调用多次，且按照顺序调用（onFulfilled）", (done) => {
    const callbacks = [jest.fn(), jest.fn(), jest.fn()];
    const promise = new Promise((resolve) => {
      resolve();
    });
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);
    setTimeout(() => {
      expect(callbacks[0]).toBeCalled();
      expect(callbacks[1]).toBeCalled();
      expect(callbacks[2]).toBeCalled();
      expect(callbacks[1]).toHaveBeenCalledAfter(callbacks[0]);
      expect(callbacks[2]).toHaveBeenCalledAfter(callbacks[1]);
      done();
    });
  });

  it("2.2.6 同一个 promise 上的 then 可以被调用多次，且按照顺序调用（onRejected）", (done) => {
    const callbacks = [jest.fn(), jest.fn(), jest.fn()];
    const promise = new Promise((resolve, reject) => {
      reject();
    });
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);
    setTimeout(() => {
      expect(callbacks[0]).toBeCalled();
      expect(callbacks[1]).toBeCalled();
      expect(callbacks[2]).toBeCalled();
      expect(callbacks[1]).toHaveBeenCalledAfter(callbacks[0]);
      expect(callbacks[2]).toHaveBeenCalledAfter(callbacks[1]);
      done();
    });
  });
});
