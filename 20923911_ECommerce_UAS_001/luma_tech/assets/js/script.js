const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const visible = getComputedStyle(nav).display !== "none";
    nav.style.display = visible ? "none" : "flex";
  });
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems > 0 ? totalItems : "";
  badge.style.display = totalItems > 0 ? "inline-block" : "none";
}

function addToCart(product, btn) {
  let cart = getCart();

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  saveCart(cart);

  if (btn) {
    const card = btn.closest(".product-card");
    if (card) card.remove();
  }

  showToast(`${product.name} berhasil ditambahkan ke keranjang!`);
  renderCart();
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image,
    };
    addToCart(product, btn);
  });
});

let cart = getCart();

function renderCart() {
  cart = getCart();

  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let total = 0;

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Keranjang belanja kosong.</p>";
    if (cartTotal) cartTotal.textContent = "Rp 0";
    updateCartBadge();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
    <div class="card" style="margin-bottom:12px;display:flex;gap:12px;align-items:center;justify-content:space-between">
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px">
        <div>
          <h3>${item.name}</h3>
          <div style="display:flex;align-items:center;gap:8px;margin:6px 0">
            <button class="decrease-qty" data-index="${index}" style="padding:4px 8px">-</button>
            <span>${item.qty}</span>
            <button class="increase-qty" data-index="${index}" style="padding:4px 8px">+</button>
          </div>
          <p class="price">Rp ${(item.price * item.qty).toLocaleString()}</p>
        </div>
      </div>
      <button class="btn btn-outline remove-item" data-index="${index}">Hapus</button>
    </div>
  `
    )
    .join("");

  total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (cartTotal) cartTotal.textContent = "Rp " + total.toLocaleString();

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart[index].qty += 1;
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      renderCart();
    });
  });

  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm("Yakin ingin menghapus semua item dari keranjang?")) {
        cart = [];
        localStorage.removeItem("cart");
        renderCart();
      }
    };
  }

  updateCartBadge();
}

const checkoutForm = document.getElementById("checkout-form");

const orderModal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const okBtn = document.getElementById("okBtn");

function openModal() {
  orderModal.classList.remove("hidden");
  setTimeout(() => orderModal.classList.add("show"), 10); // trigger animasi
}

function closeModalFn() {
  orderModal.classList.remove("show");
  setTimeout(() => orderModal.classList.add("hidden"), 300); // tunggu animasi selesai
}

closeModal.addEventListener("click", closeModalFn);
okBtn.addEventListener("click", closeModalFn);
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) closeModalFn();
});

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("Keranjang masih kosong!", true);
      return;
    }

    const nama = document.getElementById("nama").value;
    const alamat = document.getElementById("alamat").value;
    const nohp = document.getElementById("nohp").value;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const orderMessage = document.getElementById("orderMessage");
    orderMessage.innerHTML = `
      Terima kasih, <b>${nama}</b>!<br>
      Total: <b>Rp ${total.toLocaleString()}</b><br>
      Dikirim ke: <b>${alamat}</b><br>
      No HP: <b>${nohp}</b>
    `;

    openModal();

    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    checkoutForm.reset();
  });
}

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const pesan = form.pesan.value.trim();

    if (!nama || !email || !pesan) {
      showToast("Mohon lengkapi semua field.", true);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Format email tidak valid.", true);
      return;
    }

    showToast("Terima kasih! Pesan Anda telah terekam (demo).");
    form.reset();
  });
}

function showToast(message, isError = false) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = isError ? "#ff1900ff" : "#2255ffff";
  toast.style.color = "#fff";
  toast.style.padding = "20px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.44)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 1.0s ease";

  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 50);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

renderCart();
