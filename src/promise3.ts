class State {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
}

class Promise2 {
  state = State.PENDING
  callbacks = []
  value

  constructor(executor: (resolve?, reject?) => void) {
    executor(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(result) {
    if (this.state !== State.PENDING) return
    this.state = State.FULFILLED
    this.value = result
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        const x = handle[0].bind(undefined)(result);
        (handle[2] as Promise2).resolveWith(x)
      })
    });
  }
  resolveWith(x) {
    if (this === x) {
      this.reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    } else if (x instanceof Promise2) {
      x.then(
        value => this.resolve(value),
        reason => this.reject(reason)
      )
    } else if (x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (error) {
        this.reject(error)
      }
      if (then instanceof Function) {
        try {
          x.then(
            y => this.resolveWith(y),
            r => this.reject(r)
          )
        } catch (error) {
          this.reject(error)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }
  reject(reason) {
    if (this.state !== State.PENDING) return
    this.state = State.REJECTED
    this.value = reason
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        const x = handle[1].bind(undefined)(reason);
        (handle[2] as Promise2).resolveWith(x)
      })
    });
  }
  then(onFulfilled?, onRejected?) {
    const handle = []
    if (typeof onFulfilled !== 'function') {
      onFulfilled = (value) => value
    }
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => reason
    }
    handle[0] = onFulfilled
    handle[1] = onRejected
    handle[2] = new Promise2(() => { })
    this.callbacks.push(handle)
    return handle[2]
  }
  catch(onRejected) {
    this.then(null, onRejected)
  }
  finally(callback) {
    return this.then(
      value => Promise2.resolve(callback()).then(() => value),
      reason => Promise2.resolve(callback()).then(() => { throw reason })
    )
  }
  static resolve(value) {
    return new Promise2((resolve) => resolve(value))
  }
  static reject(reason) {
    return new Promise2((resolve, reject) => reject(reason))
  }
  static all(promises: Array<Promise2>) {
    const values = []
    return new Promise2((resolve, reject) => {
      promises.forEach((promise: Promise2) => {
        promise.then(
          result => {
            values.push(result)
            if (values.length === promises.length) {
              resolve(values)
            }
          },
          reason => reject(reason)
        )
      });
    })
  }
  static race(promises: Array<Promise2>) {
    return new Promise2((resolve, reject) => {
      promises.forEach((promise: Promise2) => {
        promise.then(
          result => resolve(result),
          reason => reject(reason)
        )
      });
    })
  }
}
export default Promise2