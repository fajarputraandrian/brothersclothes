let cart = [];
let selectedProduct = null;

// Ambil produk dari API backend
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

function fetchProducts() {
    fetch('/api/products')
        .then(res => res.json())
        .then(products => {
            renderProducts(products);
        })
        .catch(err => {
            console.error("Gagal mengambil produk:", err);
        });
}

function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(p => {
        // Ambil nilai dari properti database (dengan fallback/opsional)
        const name = p.name || p.nama || p.nama_produk || "Produk Tanpa Nama";
        const price = p.price || p.harga || 0;
        const stock = p.stock !== undefined ? p.stock : (p.stok !== undefined ? p.stok : 0);
        const image = p.image_url || p.gambar || p.image || 'https://via.placeholder.com/300';

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${image}" alt="${name}" class="product-img">
            <div class="product-details">
                <div class="product-title">${name}</div>
                <div class="product-price">Rp ${Number(price).toLocaleString('id-ID')}</div>
                <div class="product-stock">Stok: ${stock}</div>
                <button class="btn-primary" onclick="openVariantModal('${name}', ${price})">Tambah ke Keranjang</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// MODAL VARIAN & REKOMENDASI UKURAN
function openVariantModal(name, price) {
    selectedProduct = { name, price };
    document.getElementById("modal-product-name").innerText = name;
    document.getElementById("input-tb").value = "";
    document.getElementById("input-bb").value = "";
    document.getElementById("recommendation-result").innerText = "Masukkan TB dan BB untuk melihat saran ukuran.";
    document.getElementById("variant-modal").style.display = "block";

    document.getElementById("btn-confirm-add").onclick = () => {
        const size = document.getElementById("select-size").value;
        const color = document.getElementById("select-color").value;
        addToCart(selectedProduct.name, selectedProduct.price, size, color);
        closeVariantModal();
    };
}

function closeVariantModal() {
    document.getElementById("variant-modal").style.display = "none";
}

function hitungRekomendasiUkuran() {
    const tb = parseFloat(document.getElementById("input-tb").value);
    const bb = parseFloat(document.getElementById("input-bb").value);
    const resultText = document.getElementById("recommendation-result");
    const selectSize = document.getElementById("select-size");

    if (!tb || !bb) {
        resultText.innerText = "Masukkan TB dan BB untuk melihat saran ukuran.";
        return;
    }

    let rekom = "M";
    if (bb < 55 && tb < 165) {
        rekom = "S";
    } else if (bb <= 68 && tb <= 175) {
        rekom = "M";
    } else if (bb <= 80 && tb <= 180) {
        rekom = "L";
    } else if (bb <= 95) {
        rekom = "XL";
    } else {
        rekom = "XXL";
    }

    resultText.innerText = `💡 Rekomendasi Ukuran Kamu: ${rekom}`;
    selectSize.value = rekom;
}

// LOGIKA KERANJANG
function addToCart(name, price, size, color) {
    const existingIndex = cart.findIndex(item => item.name === name && item.size === size && item.color === color);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ name, price, size, color, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById("cart-count").innerText = totalQty;

    const cartContainer = document.getElementById("cart-items-container");
    cartContainer.innerHTML = "";

    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Keranjang kamu masih kosong.</p>";
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            totalPrice += subtotal;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Ukuran: ${item.size} | Warna: ${item.color}</small><br>
                    <span>${item.qty} x Rp ${Number(item.price).toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            `;
            cartContainer.appendChild(div);
        });
    }

    document.getElementById("cart-total-price").innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function toggleCartModal() {
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Keranjang kamu kosong!");
        return;
    }

    let message = "Halo Brothers Clothes Store, saya ingin memesan:\n\n";
    let total = 0;

    cart.forEach((item, i) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `${i + 1}. ${item.name} (${item.size}/${item.color}) x${item.qty} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Bayar: Rp ${total.toLocaleString('id-ID')}*`;
    
    // Ganti dengan nomor WhatsApp Toko kamu (format 628xxx)
    const phone = "6281234567890"; 
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}