// ===========================
// CART SYSTEM USING LOCAL STORAGE
// ===========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const count = cart.reduce((t, i) => t + i.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}
updateCartCount();

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===========================
// ADD TO CART
// ===========================
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    const existing = cart.find(i => i.name === name);

    if (existing) existing.quantity++;
    else cart.push({ name, price, quantity: 1 });

    saveCart();
    updateCartCount();
    displayCartItems();
  });
});

// ===========================
// DISPLAY CART
// ===========================
function displayCartItems() {
  const div = document.getElementById("cart-items");
  if (!div) return;
  div.innerHTML = "";

  if (cart.length === 0) {
    div.innerHTML = `<p class='text-center text-muted'>Your Cart is Empty</p>`;
    document.getElementById("total-price").textContent = 0;
    document.getElementById("gst-amount").textContent = 0;
    document.getElementById("grand-total").textContent = 0;
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

      <div><strong>₹${item.price * item.quantity}</strong></div>
    `;

    div.appendChild(row);
    total += item.price * item.quantity;
  });

  const gst = (total * 0.05).toFixed(2);
  const grand = (total + Number(gst)).toFixed(2);

  document.getElementById("total-price").textContent = total;
  document.getElementById("gst-amount").textContent = gst;
  document.getElementById("grand-total").textContent = grand;

  addQtyEvents();
}

// ===========================
// QTY BUTTON LOGIC
// ===========================
function addQtyEvents() {
  document.querySelectorAll(".plus").forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.i;
      cart[i].quantity++;
      saveCart();
      updateCartCount();
      displayCartItems();
    };
  });

  document.querySelectorAll(".minus").forEach(btn => {
    btn.onclick = () => {
      const i = btn.dataset.i;
      if (cart[i].quantity > 1) cart[i].quantity--;
      else cart.splice(i, 1);

      saveCart();
      updateCartCount();
      displayCartItems();
    };
  });
}

displayCartItems();

// ===========================
// CLEAR CART
// ===========================
const clearBtn = document.getElementById("clear-cart");
if (clearBtn) {
  clearBtn.onclick = () => {
    if (confirm("Clear Entire Cart?")) {
      cart = [];
      localStorage.removeItem("cart");
      updateCartCount();
      displayCartItems();
    }
  };
}

// ===========================
// FINALIZE BOOKING
// ===========================
const finalizeBtn = document.getElementById("finalize-booking");
if (finalizeBtn) {
  finalizeBtn.onclick = () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some items first.");
        return;
    }
    
    let billText = "🛍️ === CART SUMMARY === 🛍️\n\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        billText += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${itemTotal}\n`;
        total += itemTotal;
    });
    
    let gst = (total * 0.05).toFixed(2);
    let grand = (total + Number(gst)).toFixed(2);
    
    billText += "\n-------------------------\n";
    billText += `Subtotal: ₹${total.toFixed(2)}\n`;
    billText += `GST (5%): ₹${gst}\n`;
    billText += `Grand Total: ₹${grand}\n`;
    billText += "=========================\n\n";
    billText += "Additional Requests / Customization Details: ";
    
    // Save to local storage to pass to contact page
    localStorage.setItem("pendingBillDetails", billText);
    
    // Empty the cart immediately after finalizing booking
    cart = [];
    localStorage.removeItem("cart");
    
    // Redirect to contact page
    window.location.href = "contact.html?fromCart=true";
  };
}

// ===========================
// AUTO-FILL INQUIRY FORM
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on the contact page or any page with the form
  const feedbackField = document.getElementById("inq-feedback");
  const purposeField = document.getElementById("inq-purpose");
  const inquiryForm = document.getElementById("inquiryForm");

  if (feedbackField) {
      const pendingBill = localStorage.getItem("pendingBillDetails");
      
      // Auto-fill from localStorage if available
      if (pendingBill) {
          feedbackField.value = pendingBill;
          
          if (purposeField) {
              purposeField.value = "Food Inquiry"; // Auto-select purpose
          }
          
          feedbackField.rows = 15; // Make the text area larger to fit the bill
          
          // Focus the field so the user sees it visually populated
          feedbackField.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Automatically clean up local storage on successful form submission
      if (inquiryForm) {
          inquiryForm.addEventListener("submit", () => {
              if (localStorage.getItem("pendingBillDetails")) {
                  // After sending the inquiry, clear the pending bill 
                  localStorage.removeItem("pendingBillDetails");
                  // Clear the cart optionally
                  cart = [];
                  localStorage.removeItem("cart");
                  updateCartCount();
              }
          });
      }
  }
});
