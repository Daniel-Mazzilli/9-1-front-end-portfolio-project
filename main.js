let exampleURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/247001`

fetch(exampleURL)
  .then((res) => res.json())
  .then((resJson) => console.log(resJson))
  .catch((err) => console.log(err));
