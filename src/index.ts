import Promise from "./promise3";

const promise = new Promise((resolve) => resolve('success'))
const promise1 = promise.then(() => promise1)
promise1.then(null, error => {
  console.log(error)
})