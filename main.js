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
const moreButton = document.querySelector(`.more`);

// Variables
let totalItems;
let allItemsIds;
let randomIndex;
let randomId;
const exampleID = 247001;
let searchResults;
let greater = 0;
let lesser = 30;

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
// const keyForImg = `primaryImageSmall`;
const keyForImg = `primaryImage`;
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
const itemFetch = (id, functionForItem, function2ForItem = null) => {
  fetch(rootURL + `objects/` + id)
    .then((res) => res.json())
    .then((resJson) => {
      functionForItem(resJson);
      if (function2ForItem) {
        function2ForItem(resJson);
      }
    })
    .catch((err) => console.log(err));
};

const getRandomId = () => {
  randomIndex = Math.round(Math.random() * totalItems);
  randomId = allItemsIds[randomIndex];
};

const resetResults = () => {
  resultsArticle.innerHTML = ``;
};

const searchResultAppend = (path) => {
  if (path[`objectID`]) {
    const searchResultItem = document.createElement(`p`);
    searchResultItem.innerHTML = `<a href="#top">ID: ${
      path[`objectID`]
    } - <strong>${path[`title`]}</strong> ${path[`artistDisplayName`]} ${
      path[`objectDate`]
    } ${path[`department`]}</a>`;
    resultsArticle.append(searchResultItem);
    searchResultItem.addEventListener(`click`, () => {
      updateItemData(path);
    });
  }
};

const searchResultPrepend = (path) => {
  if (path[`objectID`]) {
    const searchResultItem = document.createElement(`p`);
    searchResultItem.innerHTML = `<a href="#top">ID: ${
      path[`objectID`]
    } - <strong>${path[`title`]}</strong> ${path[`artistDisplayName`]} ${
      path[`objectDate`]
    } ${path[`department`]}</a>`;
    resultsArticle.prepend(searchResultItem);
    searchResultItem.addEventListener(`click`, () => {
      updateItemData(path);
    });
  }
};

const updateItemData = (path) => {
  itemPs.forEach((el, index) => {
    el.innerHTML = pLabelsItem[index];
    el.innerHTML += `${path[keysForItem[index]]}`;
  });
  if (path[keyForImg]) {
    image.setAttribute(`src`, path[keyForImg]);
    image.setAttribute(`alt`, `item image`);
  } else {
    image.setAttribute(`src`, `./no-image.jpg`);
    image.setAttribute(`alt`, `no image icon`);
  }
  metObjURL.innerText = `Visit Item's Official Page`;
  metObjURL.setAttribute(`href`, path[keyObjURL]);
};

const loadSearchResults = () => {
  searchResults.forEach((el, i) => {
    if ((i > greater) & (i < lesser)) {
      itemFetch(el, searchResultAppend);
    }
  });
  if (searchResults.length >= lesser) {
    moreButton.classList.remove(`hidden`);
    greater += 29;
    lesser += 30;
  } else {
    moreButton.classList.add(`hidden`);
  }
};

// Example Fetch
// mainItemFetch(exampleID, updateItemData);

// Search Fetch
form.addEventListener(`submit`, (event) => {
  event.preventDefault();

  if (typeSearch.value === ``) {
    const errMessage = document.createElement(`p`);
    errMessage.innerHTML = `Enter One or More Keywords`;
    errMessage.classList.add(`error`);
    form.prepend(errMessage);
    const removeMessage = () => {
      errMessage.remove();
    };
    setTimeout(removeMessage, 4000);
  } else {
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
        resetResults();
        searchResults = resJson.objectIDs;
        const firstItem = searchResults[0];
        itemFetch(firstItem, updateItemData, searchResultPrepend);
        //Search Results
        // console log, later remove
        console.log(searchResults);
        resultsArticle.innerHTML = ``;
        greater = 0;
        lesser = 30;
        loadSearchResults();
      })
      .catch((err) => console.log(err));
    form.reset();
  }
});

// Button Event Listener
button.addEventListener(`click`, () => {
  getRandomId();
  resetResults();
  itemFetch(randomId, updateItemData);
  moreButton.classList.remove(`hidden`);
  moreButton.classList.add(`hidden`);
});

moreButton.addEventListener(`click`, () => {
  loadSearchResults();
});

// Image Event Listener
image.addEventListener(`click`, () => {
  const src = image.getAttribute(`src`);
  if (src !== "./no-image.jpg") {
    window.open(src);
  }
});
