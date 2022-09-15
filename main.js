// DOM Elements
const h2 = document.querySelector(`h2`);
const hiddenAtFirst = document.querySelectorAll(`.hidden-at-first`);
const header = document.querySelector(`header`);
const form = document.querySelector(`form`);
const typeSearch = document.querySelector(`#search`);
const links = document.querySelectorAll(`.links a`);
const image = document.querySelector(`#image`);
const itemPs = document.querySelectorAll(`#item p`);
const metObjURL = document.querySelector(`#met-obj-url`);
const button = document.querySelector(`button`);
const resultsArticle = document.querySelector(`#search-results`);

// Variables
let totalItems;
let allItemsIds;
let randomIndex;
let randomId;
const exampleID = 247001;
let greaterOrEqual = 0;
let lesser = 10;

// Arrays and Variables For Updating Main Section
const pLabelsItem = [
  `<strong>Item ID: </strong>`,
  `<strong>Title: </strong>`,
  `<strong>Item type: </strong>`,
  `<strong>Artist: </strong>`,
  `<strong>Medium: </strong>`,
  `<strong>Artist Role: </strong>`,
  `<strong>Dimensions: </strong>`,
  `<strong>Artist Bio: </strong>`,
  `<strong>Item Date: </strong>`,
  `<strong>Department: </strong>`,
  `<strong>Year Acquired: </strong>`,
  `<strong>Culture: </strong>`,
  `<strong>Country: </strong>`,
  `<strong>Gallery #</strong>`,
];
const keysForItem = [
  `objectID`,
  `title`,
  `objectName`,
  `artistDisplayName`,
  `medium`,
  `artistRole`,
  `dimensions`,
  `artistDisplayBio`,
  `objectDate`,
  `department`,
  `accessionYear`,
  `culture`,
  `country`,
  `GalleryNumber`,
];
const keyForImg = `primaryImageSmall`;
const keyObjURL = `objectURL`;

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

// Functions
// const mainItemFetch = (id) => {
//   fetch(rootURL + `objects/` + id)
//     .then((res) => res.json())
//     .then((resJson) => {
//       updateItemData(resJson);
//     })
//     .catch((err) => console.log(err));
// };

const itemFetch = (id, functionForItem) => {
  fetch(rootURL + `objects/` + id)
    .then((res) => res.json())
    .then((resJson) => {
      functionForItem(resJson);
    })
    .catch((err) => console.log(err));
};

const getRandomId = () => {
  randomIndex = Math.round(Math.random() * totalItems);
  randomId = allItemsIds[randomIndex];
};

const updateItemData = (path) => {
  itemPs.forEach((el, index) => {
    el.innerHTML = pLabelsItem[index];
    el.innerHTML += `${path[keysForItem[index]]}`;
  });
  image.setAttribute(`src`, path[keyForImg]);
  image.setAttribute(`alt`, `No Image Available`);
  metObjURL.innerText = `Visit Official Page for Item`;
  metObjURL.setAttribute(`href`, path[keyObjURL]);
};

const addSearchResult = (path) => {
  const searchResultItem = document.createElement(`p`)
  searchResultItem.innerHTML = `ID: ${path[`objectID`]} - ${path[`title`]} ${path[`artistDisplayName`]} ${path[`objectDate`]} ${path[`department`]}`;
  resultsArticle.prepend(searchResultItem);
};

// Example Fetch
// mainItemFetch(exampleID, updateItemData);

// Search Fetch
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
      // mainItemFetch(firstItem);
      itemFetch(firstItem, updateItemData);
      //Search Results
      console.log(searchResults);
      resultsArticle.innerHTML = ``;
      searchResults.forEach((el, i) => {
        if ((i >= greaterOrEqual) & (i < lesser)) {
          console.log(el);
          itemFetch(el, addSearchResult);
        }
      });
    })
    .catch((err) => console.log(err));
  form.reset();
});

// Button Event Listener
button.addEventListener(`click`, () => {
  getRandomId();
  // mainItemFetch(randomId);
  itemFetch(randomId, updateItemData);
});
