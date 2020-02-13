let wrapper = document.querySelectorAll('.wrapper'),
  cart = document.getElementById('cart');


function addEvent(elem, type, handler) {
  if (elem.addEventListener) {
    elem.addEventListener(type, handler, false);
  } else {
    elem.attachEvent('on' + type, function () {
      handler.call(elem);
    });
  }
  return false;
}

function addToCart() {
  this.disabled = true; // блокируем кнопку на время операции с корзиной
  let cartData = getCartData() || {},
    parentBox = this.parentNode.parentNode, // родительский элемент кнопки "Добавить в корзину"
    itemId = this.getAttribute('data-id'),
    itemTitle = parentBox.querySelector('.wrapper__title').innerHTML,
    itemPrice = parentBox.querySelector('.wrapper__price').innerHTML,
    itemCounter = parentBox.querySelector('.wrapper__counter');

  if (cartData.hasOwnProperty(itemId)) {
    cartData[itemId][2] += 1;
  } else {
    cartData[itemId] = [itemTitle, itemPrice, 1];
  }

  itemCounter.innerHTML = cartData[itemId][2];

  if (!setCartData(cartData)) {
    this.disabled = false;
  }
  drawTable();

  return false;
}

for (let i = 0; i < wrapper.length; i++) {
  addEvent(wrapper[i].querySelector('.wrapper__btn'), 'click', addToCart);
}

quantity = document.querySelector('.cart-quantity');

function openCart() {
  const isClosed = cart.classList.contains('close');

  if (!isClosed) {
    cart.classList.add('close');
  } else {
    cart.classList.toggle('close');
  }

  drawTable();

  return false;
}

function drawTable() {
  let cartData = getCartData(), totalItems = '';

  if (cartData !== null && Object.keys(cartData).length > 0) {
    totalItems = `<table style="display: flex" class="shopping__list">
  <tr>
    <th>Наименование</th>
    <th>Цена</th>
    <th>Кол-во</th>
  </tr>`;

    let sum = 0;

    for (let items in cartData) {
      sum += parseFloat(cartData[items][1]) * cartData[items][2];

      totalItems += '<tr>';
      totalItems += `<td>${cartData[items][0]}</td>`;
      totalItems += `<td>${cartData[items][1]}</td>`;
      totalItems += `<td>
  <button class="btn-minus" name="remove" onclick="cartQuantityAction(${items}, 'minus')">-</button>
  ${cartData[items][2]}
  <button class="btn-plus" name="adding" onclick="cartQuantityAction(${items}, 'plus')">+</button>
</td>`;
      totalItems += '</tr>';
    }

    totalItems += '</table>';
    totalItems += `<div class="page-section__total">Итого: ${sum}</div>`;

    cart.innerHTML = totalItems;
  } else cart.innerHTML = 'В корзине пусто!';
}

addEvent(document.getElementById('checkout'), 'click', openCart);

addEvent(document.getElementById('clear_cart'), 'click', function (e) {
  localStorage.removeItem('cart');
  cart.innerHTML = 'Корзина очищена.';
  document.querySelectorAll('.wrapper__counter').forEach(function (counter) {
    counter.innerHTML = '';
  });
});

function cartQuantityAction(id, act) {
  let cartData = getCartData();
  if (act === 'plus') cartData[id][2] += 1;
  else if (act === 'minus') {
    cartData[id][2] -= 1;
  }

  setCounter(id, cartData[id][2]);
  if (cartData[id][2] === 0) delete cartData[id];
  setCartData(cartData);
  drawTable();
}

function setCounter(id, num) {
  let counter = document.querySelector(`[data-id='${id}']`).parentNode.querySelector('.wrapper__counter');

  if(num === 0) {
    counter.innerHTML = '';
  } else {
    counter.innerHTML = num;
  }

  console.log(counter);
}
