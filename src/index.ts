import Promise from "./promise";

const promise1 = new Promise((resolve) => resolve());
promise1
  .then(
    () => "success",
    () => {}
  )
  .then((result) => {
    console.log(result);
  });
