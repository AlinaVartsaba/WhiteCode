function readTextFile(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status === 200) {
      callback(rawFile.responseText);
    }
  };
  rawFile.open("GET", file, false);
  rawFile.send();
}

function getCartData() {
  return JSON.parse(localStorage.getItem('cart'));
}

function setCartData(o) {
  localStorage.setItem('cart', JSON.stringify(o));
  return false;
}
