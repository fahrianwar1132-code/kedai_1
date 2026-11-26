// Data produk Kedai Kopi Kenangan Senja
const products = [
  { id: 1, name: "Arabica Blend", img: "1.jpg", price: 25000, oldPrice: 30000, description: "Arabica Blend dengan aroma lembut dan rasa seimbang." },
  { id: 2, name: "Kopi Susu", img: "2.jpg", price: 18000, oldPrice: 22000, description: "Kopi susu nikmat untuk menemani aktivitas sehari-hari." },
  { id: 3, name: "White Coffee", img: "3.jpg", price: 30000, oldPrice: 35000, description: "Kopi dengan rasa lembut dan aroma yang khas." },
  { id: 4, name: "Kopi Special Mix", img: "4.jpg", price: 15000, oldPrice: 18000, description: "Kopi special mix dengan rasa yang nikmat." },
  { id: 5, name: "Robusta Brazil", img: "5.jpg", price: 20000, oldPrice: 25000, description: "Kopi Robusta Brazil dengan karakter rasa kuat dan aroma khas." }
];

const rupiah = (number) => "Rp " + number.toLocaleString("id-ID");
const productList = document.querySelector("#product-list");
const cartItemsElement = document.querySelector("#cart-items");
const cartCountElement = document.querySelector("#cart-count");
const cartTotalElement = document.querySelector("#cart-total");
const modal = document.querySelector("#item-detail-modal");
const modalContent = document.querySelector("#modal-product-content");

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("kenanganSenjaCart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

function renderProducts(list = products) {
  if (!productList) return;
  if (!list.length) {
    productList.innerHTML = '<p class="no-products">Produk tidak ditemukan.</p>';
    return;
  }

  productList.innerHTML = list.map(item => `
    <article class="product-card">
      <div class="product-icons">
        <button type="button" class="add-product-to-cart" data-add="${item.id}" aria-label="Tambah ${item.name} ke keranjang">
          <i data-feather="shopping-cart"></i>
        </button>
        <button type="button" class="item-detail-button" data-detail="${item.id}" aria-label="Lihat ${item.name}">
          <i data-feather="eye"></i>
        </button>
      </div>
      <div class="product-image">
        <img src="img/products/${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="product-content">
        <h3>${item.name}</h3>
        <div class="product-stars" aria-label="Rating 4 dari 5">
          <i data-feather="star" class="star-full"></i>
          <i data-feather="star" class="star-full"></i>
          <i data-feather="star" class="star-full"></i>
          <i data-feather="star" class="star-full"></i>
          <i data-feather="star"></i>
        </div>
        <div class="product-price">${rupiah(item.price)} <span>${rupiah(item.oldPrice)}</span></div>
      </div>
    </article>
  `).join("");
  if (window.feather) feather.replace();
}

function saveCart() {
  localStorage.setItem("kenanganSenjaCart", JSON.stringify(cart));
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountElement.textContent = totalQty;
  cartCountElement.classList.toggle("show", totalQty > 0);
  cartTotalElement.textContent = rupiah(totalPrice);

  if (!cart.length) {
    cartItemsElement.innerHTML = '<p class="cart-empty">Keranjang masih kosong. Yuk pilih kopi favoritmu!</p>';
    saveCart();
    return;
  }

  cartItemsElement.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="img/products/${item.img}" alt="${item.name}">
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">${rupiah(item.price)}</div>
        <div class="cart-quantity">
          <button type="button" data-decrease="${item.id}" aria-label="Kurangi">−</button>
          <span>${item.qty}</span>
          <button type="button" data-increase="${item.id}" aria-label="Tambah">+</button>
        </div>
      </div>
      <button type="button" class="remove-item" data-remove="${item.id}" aria-label="Hapus ${item.name}">
        <i data-feather="trash-2"></i>
      </button>
    </div>
  `).join("");
  if (window.feather) feather.replace();
  saveCart();
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  const found = cart.find(item => item.id === product.id);
  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
}

function showProductDetail(id) {
  const item = products.find(product => product.id === Number(id));
  if (!item) return;
  modalContent.innerHTML = `
    <img src="img/products/${item.img}" alt="${item.name}">
    <div class="product-content">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="product-stars">
        <i data-feather="star" class="star-full"></i>
        <i data-feather="star" class="star-full"></i>
        <i data-feather="star" class="star-full"></i>
        <i data-feather="star" class="star-full"></i>
        <i data-feather="star"></i>
      </div>
      <div class="product-price">${rupiah(item.price)} <span>${rupiah(item.oldPrice)}</span></div>
      <button type="button" class="modal-add-cart" data-add="${item.id}">
        <i data-feather="shopping-cart"></i> Tambah ke Keranjang
      </button>
    </div>`;
  modal.style.display = "flex";
  if (window.feather) feather.replace();
}

productList?.addEventListener("click", (e) => {
  const addButton = e.target.closest("[data-add]");
  const detailButton = e.target.closest("[data-detail]");
  if (addButton) addToCart(addButton.dataset.add);
  if (detailButton) showProductDetail(detailButton.dataset.detail);
});

cartItemsElement?.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-increase]");
  const dec = e.target.closest("[data-decrease]");
  const remove = e.target.closest("[data-remove]");
  if (inc) {
    const item = cart.find(p => p.id === Number(inc.dataset.increase));
    if (item) item.qty++;
  }
  if (dec) {
    const item = cart.find(p => p.id === Number(dec.dataset.decrease));
    if (item) item.qty--;
    cart = cart.filter(p => p.qty > 0);
  }
  if (remove) cart = cart.filter(p => p.id !== Number(remove.dataset.remove));
  renderCart();
});

modal?.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest(".close-icon")) {
    modal.style.display = "none";
    e.preventDefault();
  }
  const addButton = e.target.closest("[data-add]");
  if (addButton) {
    addToCart(addButton.dataset.add);
    modal.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal) modal.style.display = "none";
});

// Pencarian produk langsung memfilter daftar produk
document.querySelector("#search-box")?.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase().trim();
  renderProducts(products.filter(item => item.name.toLowerCase().includes(keyword)));
});

// Ganti nomor ini jika nomor WhatsApp toko berubah.
const WHATSAPP_NUMBER = "6285811091394";

document.querySelector("#checkout-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!cart.length) {
    alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
    return;
  }

  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const customer = new FormData(form);
  const name = String(customer.get("name") || "").trim();
  const email = String(customer.get("email") || "").trim();
  const phone = String(customer.get("phone") || "").trim();
  const summary = cart
    .map(item => `• ${item.name} (${item.qty}x) = ${rupiah(item.price * item.qty)}`)
    .join("\\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message = [
    "Data Customer",
    `• Nama: ${name}`,
    `• Email: ${email}`,
    `• No HP: ${phone}`,
    "",
    "Data Pesanan:",
    summary,
    "",
    `TOTAL: ${rupiah(total)}`,
    "Terima kasih!"
  ].join("\\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank");

  if (!whatsappWindow) {
    alert("Browser memblokir tab WhatsApp. Izinkan pop-up, lalu klik Checkout lagi.");
  }
});

renderProducts();
renderCart();
if (window.feather) feather.replace();
