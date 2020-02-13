let initialProducts = [];

readTextFile("./data/items.json", function (text) {
  initialProducts = JSON.parse(text);
});

let checkbox = document.getElementById("check");
let products = initialProducts;

function checkCheckbox() {
  console.log(checkbox.checked);

  if (checkbox.checked) {
    products = initialProducts.filter(i => i.available === true);
  } else {
    products = initialProducts;
  }
  reloadData();
}


let html = `<div id="wrapper" class="wrapper">
  <div class="wrapper__title"></div>
  <div class="wrapper__img-card">
    <img id="product-img" class="wrapper__product" alt="/"
         src="https://d37kg2ecsrm74.cloudfront.net/web/ikea4/images/382/0238233_PE377690_S5.jpg">
  </div>
  <div class="wrapper__description"></div>
  <span class="wrapper__price"></span>
  <div class="wrapper__available"></div>
  <div class="wrapper__bask-block">
    <button class="wrapper__btn">Добавить в корзину</button>
    <span class="wrapper__counter"></span>
  </div>
</div>`;

let container = document.getElementById('container');
let counter = 0;
let updateCounter = true;
let cartData = getCartData() || {};

const populateWrapper = function (product) {
  let wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  wrapper.getElementsByClassName('wrapper__title')[0].innerHTML = product.title;
  wrapper.getElementsByClassName('wrapper__product')[0].src = product.image;
  wrapper.getElementsByClassName('wrapper__description')[0].innerHTML = product.description;
  wrapper.getElementsByClassName('wrapper__price')[0].innerHTML = product.price + ' руб.';
  wrapper.getElementsByClassName('wrapper__btn')[0].setAttribute('data-id', product.id);

  if(cartData.hasOwnProperty(product.id)) {
    wrapper.getElementsByClassName('wrapper__counter')[0].innerHTML = cartData[product.id][2];
  }


  let availableText = "Товар в наличии";
  if (!product.available) availableText = "Товара нет в наличии";

  wrapper.getElementsByClassName('wrapper__available')[0].innerHTML = availableText;

  container.appendChild(wrapper);
  if (updateCounter) counter++
};

function loadData() {
  const initialData = products.slice(0, 15);
  initialData.forEach(populateWrapper);

}

function loadMore() {
  const data = products.slice(counter, counter + 15);
  data.forEach(populateWrapper);
}

function reloadData() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  updateCounter = false;
  products.slice(0, counter).forEach(populateWrapper);
  updateCounter = true;
}

window.addEventListener("load", function () {
  loadData();
});


function sortByName(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
    let comparison = 0;

    if (a[key] instanceof String || typeof a[key] === 'string') {
      comparison = a[key].localeCompare(b[key], 'ru')
    } else if (a[key] instanceof Number || typeof a[key] === 'number') {
      comparison = a[key] > b[key]
    }

    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );

  };
}

function sortBy(key, order = 'asc') {
  products.sort(sortByName(key, order));
  reloadData();
}


