// Build URL for Fetch
const exampleURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/247001`;
const rootURL = `https://collectionapi.metmuseum.org/public/collection/v1/`;

// Total Items
const h2 = document.querySelector(`h2`);
let totalItems;

fetch(`${rootURL}objects`)
  .then((res) => res.json())
  .then((resJson) => {
    totalItems = resJson.total;
    console.log(totalItems);
    h2.innerHTML = `Gain access to and explore ${totalItems} artifacts`;
    const hiddenAtFirst = document.querySelectorAll(`.hidden-at-first`);
    hiddenAtFirst.forEach((el) => {
      el.classList.remove(`hidden-at-first`);
      console.log(el);
    });
    document.body.classList.remove(`initial-look`);
    const header = document.querySelector(`header`);
    header.classList.add(`new-look`);
    // Random Item
    console.log(`first`, (totalItems * Math.random()).toFixed());
  })
  .catch((err) => console.log(err));

fetch(exampleURL)
  .then((res) => res.json())
  .then((resJson) => console.log(`JS connected`))
  .catch((err) => console.log(err));
