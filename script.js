let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedCoupon = null;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((t, i) => t + i.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}
updateCartCount();


// DISPLAY CART
function displayCartItems() {
  const div = document.getElementById("cart-items");
  if (!div) return;
  div.innerHTML = "";

  if (cart.length === 0) {
    div.innerHTML = `<p class='text-center text-muted'>Your Cart is Empty</p>`;
    resetTotals();
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>₹${item.price}</small>
      </div>

      <div class="qty-box">
        <button class="qty-btn minus" data-i="${index}">−</button>
        <strong>${item.quantity}</strong>
        <button class="qty-btn plus" data-i="${index}">+</button>
      </div>

      <strong>₹${item.price * item.quantity}</strong>

      <button class="remove-btn" data-i="${index}">❌</button>
    `;

    div.appendChild(row);
    total += item.price * item.quantity;
  });

  calculateTotals(total);
  addQtyEvents();
}
displayCartItems();


// QUANTITY + REMOVE
function addQtyEvents() {
  document.querySelectorAll(".plus").forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.i;
      cart[i].quantity++;
      saveCart(); updateCartCount(); displayCartItems();
    };
  });

  document.querySelectorAll(".minus").forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.i;
      if (cart[i].quantity > 1) cart[i].quantity--;
      else cart.splice(i, 1);

      saveCart(); updateCartCount(); displayCartItems();
    };
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.i;
      cart.splice(i, 1);
      saveCart(); updateCartCount(); displayCartItems();
    };
  });
}


// COUPON SYSTEM
const coupons = {
  "SAVE10": { type: "percent", value: 10 },
  "WELCOME50": { type: "flat", value: 50 },
};

document.getElementById("apply-coupon").onclick = () => {
  const code = document.getElementById("coupon-input").value.trim().toUpperCase();
  const msg = document.getElementById("coupon-msg");

  if (coupons[code]) {
    appliedCoupon = coupons[code];
    msg.textContent = "Coupon Applied Successfully! 🎉";
    msg.className = "text-success";
    displayCartItems();
  } else {
    appliedCoupon = null;
    msg.textContent = "Invalid Coupon ❌";
    msg.className = "text-danger";
  }
};


// TOTAL CALCULATION
function calculateTotals(total) {
  const gst = (total * 0.05).toFixed(2);
  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent")
      discount = ((total * appliedCoupon.value) / 100).toFixed(2);

    else if (appliedCoupon.type === "flat")
      discount = appliedCoupon.value;
  }

  const grand = (total + Number(gst) - Number(discount)).toFixed(2);

  document.getElementById("total-price").textContent = total;
  document.getElementById("gst-amount").textContent = gst;
  document.getElementById("discount").textContent = discount;
  document.getElementById("grand-total").textContent = grand;
}

function resetTotals() {
  document.getElementById("total-price").textContent = 0;
  document.getElementById("gst-amount").textContent = 0;
  document.getElementById("discount").textContent = 0;
  document.getElementById("grand-total").textContent = 0;
}


// CLEAR CART
document.getElementById("clear-cart").onclick = () => {
  if (confirm("Clear Entire Cart?")) {
    cart = [];
    appliedCoupon = null;
    saveCart();
    updateCartCount();
    displayCartItems();
  }
};
