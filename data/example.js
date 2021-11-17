function foo() {
  fetch("../data/data.json")
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((e) => {
      console.error(e.message);
    });
}

foo();
