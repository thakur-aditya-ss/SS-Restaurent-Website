// ===========================
// CART SYSTEM USING LOCAL STORAGE
// ===========================

// Load cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update navbar cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}
updateCartCount();

// ===========================
// ADD TO CART FUNCTIONALITY
// ===========================
const addButtons = document.querySelectorAll(".add-to-cart");

addButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    // Check if item already exists in cart
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name,
        price,
        quantity: 1
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update count
    updateCartCount();

    alert(`${name} added to cart!`);
  });
});


// ===========================
// SHOW CART IN cart.html
// ===========================
function displayCartItems() {
  const cartItemsDiv = document.getElementById("cart-items");
  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p class="text-center text-muted">Your cart is empty.</p>`;
    document.getElementById("total-price").textContent = 0;
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList = "d-flex justify-content-between align-items-center border p-3 mb-2 rounded";

    itemDiv.innerHTML = `
      <strong>${item.name}</strong>
      <span>₹${item.price} × ${item.quantity} = <strong>₹${item.price * item.quantity}</strong></span>
    `;

    cartItemsDiv.appendChild(itemDiv);

    total += item.price * item.quantity;
  });

  document.getElementById("total-price").textContent = total;
}

displayCartItems();


// ===========================
// CLEAR CART
// ===========================
const clearCartBtn = document.getElementById("clear-cart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      cart = [];
      localStorage.removeItem("cart");
      updateCartCount();
      displayCartItems();
    }
  });
}

// Cart


