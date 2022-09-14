// DOM Elements
const h2 = document.querySelector(`h2`);
const hiddenAtFirst = document.querySelectorAll(`.hidden-at-first`);
const header = document.querySelector(`header`);
const form = document.querySelector(`form`);
const typeSearch = document.querySelector(`#search`);
const links = document.querySelectorAll(`.links a`);
const image = document.querySelector(`#image`);

// Variables
let totalItems;
let allItemsIds;
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
    allItemsIds = resJson.objectIDs;

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
  .then((resJson) => {
    console.log(`example ID`, resJson.objectID);
    image.setAttribute(`src`, resJson.primaryImageSmall);
  })
  .catch((err) => console.log(err));

// Functions
const getRandomId = () => {
  randomIndex = Math.round(Math.random() * totalItems);
  randomId = allItemsIds[randomIndex];
};

// Search fetch
form.addEventListener(`submit`, (event) => {
  event.preventDefault();
  let qSearch = ``;
  let searchField = ``;
  let departmentID = ``;
  let highlight = ``;
  let onDisplay = ``;

  qSearch = `q=` + typeSearch.value.split(` `).join(`+`);
  searchField = form.elements[`search-field`].value;
  departmentID = form.elements.department.value;
  if (departmentID) {
    departmentID = `departmentId=${departmentID}&`;
  }
  // Maybe Write a function for checkboxes
  if (form.elements.isHighlight.checked) {
    highlight = form.elements.isHighlight.value;
  }
  if (form.elements.onview.checked) {
    onDisplay = form.elements.onview.value;
  }
  const searchURL =
    rootURL +
    `search?` +
    searchField +
    departmentID +
    highlight +
    onDisplay +
    qSearch;

  fetch(searchURL)
    .then((res) => res.json())
    .then((resJson) => {
      const searchResults = resJson.objectIDs;
      const firstItem = searchResults[0];
      fetch(rootURL + `objects/` + firstItem)
        .then((res) => res.json())
        .then((resJson) => {
          console.log(resJson);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
