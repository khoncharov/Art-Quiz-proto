import images from "./images.js";

const x = images.sort((a, b) => {
  return a.year - b.year;
});

console.log(x.filter((i) => +i.year >= 1500 && +i.year < 1600));
console.log(x.length);
