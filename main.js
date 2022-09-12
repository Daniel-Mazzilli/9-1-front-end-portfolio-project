// DOM Elements
const h2 = document.querySelector(`h2`);
const hiddenAtFirst = document.querySelectorAll(`.hidden-at-first`);
const header = document.querySelector(`header`);
const form = document.querySelector(`form`);

// Variables
let totalItems;
let itemsIds;
let randomIndex;
let randomId;

// URL for Fetch
const exampleURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/247001`;
const rootURL = `https://collectionapi.metmuseum.org/public/collection/v1/`;

// Initial Fetch for Total Items
fetch(`${rootURL}objects`)
  .then((res) => res.json())
  .then((resJson) => {
    totalItems = resJson.total;
    itemsIds = resJson.objectIDs;

    // Update look and style
    h2.innerHTML = `Gain access to and explore ${totalItems} artifacts`;
    hiddenAtFirst.forEach((el) => {
      el.classList.remove(`hidden-at-first`);
    });
    document.body.classList.remove(`initial-look`);
    header.classList.add(`new-look`);
  })
  .catch((err) => console.log(err));

// Example Fetch
fetch(exampleURL)
  .then((res) => res.json())
  .then((resJson) => console.log(resJson.objectID))
  .catch((err) => console.log(err));

// Functions
const randomIndexForObj = () => {
  randomIndex = Math.round(Math.random() * totalItems);
};

// Search fetch
