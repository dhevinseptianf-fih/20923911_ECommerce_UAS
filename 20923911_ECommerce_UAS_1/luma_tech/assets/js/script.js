// =============================
// Toggle Menu Mobile
// =============================
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const visible = getComputedStyle(nav).display !== "none";
    nav.style.display = visible ? "none" : "flex";
  });
}

// =============================
// Fitur Keranjang
// =============================

// Ambil keranjang dari localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Simpan keranjang ke localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Tambah produk ke keranjang
function addToCart(product, btn) {
  let cart = getCart();

  // Tambahkan produk
  product.qty = 1;
  cart.push(product);
  saveCart(cart);

  // Hapus produk dari tampilan produk
  if (btn) {
    const card = btn.closest(".product-card");
    if (card) card.remove();
  }

  alert(`${product.name} berhasil dibeli dan ditambahkan ke keranjang!`);
  renderCart();
}

// Event listener tombol add-to-cart
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

// Render keranjang
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let total = 0;

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Keranjang belanja kosong.</p>";
    if (cartTotal) cartTotal.textContent = "Rp 0";
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
          <p>Qty: ${item.qty}</p>
          <p class="price">Rp ${item.price.toLocaleString()}</p>
        </div>
      </div>
      <button class="btn btn-outline remove-item" data-index="${index}">Hapus</button>
    </div>
  `
    )
    .join("");

  total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (cartTotal) cartTotal.textContent = "Rp " + total.toLocaleString();

  // Hapus item
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });

  // Kosongkan keranjang
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
}

// =============================
// Form Checkout
// =============================
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    const nama = document.getElementById("nama").value;
    const alamat = document.getElementById("alamat").value;
    const nohp = document.getElementById("nohp").value;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    alert(
      `Terima kasih, ${nama}!\nPesanan kamu sudah berhasil.\nTotal pembayaran: Rp ${total.toLocaleString()}\nPesanan akan dikirim ke: ${alamat}`
    );

    // Reset keranjang
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    checkoutForm.reset();
  });
}

// =============================
// Validasi form kontak sederhana
// =============================
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const pesan = form.pesan.value.trim();

    if (!nama || !email || !pesan) {
      alert("Mohon lengkapi semua field.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Format email tidak valid.");
      return;
    }

    alert("Terima kasih! Pesan Anda telah terekam (demo).");
    form.reset();
  });
}

// Jalankan render saat halaman dibuka
renderCart();
