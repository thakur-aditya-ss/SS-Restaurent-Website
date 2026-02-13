// ---------------- HERO SLIDESHOW ----------------
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

if (slides.length > 0) {
  function showSlides() {
    slides.forEach(slide => slide.classList.remove("active"));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }
  setInterval(showSlides, 4000);
}

// ---------------- CART SYSTEM ----------------

// Retrieve cart from localStorage or initialize an empty one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get cart elements (only if they exist on this page)
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPriceEl = document.getElementById("total-price");

// Function to update cart count in navbar
function updateCartCount() {
  if (cartCount) cartCount.textContent = cart.length;
}

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to render cart (for pages that have a cart section)
function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "border-bottom", "py-2");
    div.innerHTML = `
      <span>${item.name}</span>
      <span>₹${item.price}</span>
      <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (totalPriceEl) totalPriceEl.textContent = total;
  updateCartCount();
}

// Function to remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Add to cart button handler
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", e => {
    const name = e.target.dataset.name;
    const price = parseInt(e.target.dataset.price);

    cart.push({ name, price });
    saveCart();
    updateCartCount();

    // Optional toast/alert
    alert(`${name} added to cart!`);
  });
});

// Clear cart (only if button exists)
const clearCartBtn = document.getElementById("clear-cart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

// On page load
updateCartCount();
renderCart();

// // ---------------- RESERVATION FORM ----------------
// const reservationForm = document.getElementById("reservationForm");
// if (reservationForm) {
//   reservationForm.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const name = document.getElementById("name").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const date = document.getElementById("date").value;
//     const time = document.getElementById("time").value;
//     const guests = document.getElementById("guests").value;
//     const messageEl = document.getElementById("form-message");

//     if (!name || !phone || !email || !date || !time || !guests) {
//       messageEl.textContent = "⚠️ Please fill in all required fields.";
//       messageEl.style.color = "orange";
//       return;
//     }

//     messageEl.textContent = "✅ Your table has been successfully booked!";
//     messageEl.style.color = "lightgreen";

//     this.reset();
//   });
// }










// ---------------- RESERVATION FORM ----------------
const reservationForm = document.getElementById("reservationForm");
if (reservationForm) {
  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const guests = document.getElementById("guests").value;
    const messageEl = document.getElementById("form-message");

    if (!name || !phone || !email || !date || !time || !guests) {
      messageEl.textContent = "⚠️ Please fill in all required fields.";
      messageEl.style.color = "orange";
      return;
    }

    messageEl.textContent = "✅ Your table has been successfully booked!";
    messageEl.style.color = "lightgreen";
    this.reset();
  });
}
