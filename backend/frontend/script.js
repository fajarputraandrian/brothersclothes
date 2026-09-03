// 1. Ambil data keranjang dari localStorage saat halaman dimuat
let cart = JSON.parse(localStorage.getItem('brothers_cart')) || [];
let currentSelectedProduct = null;
let currentLang = 'EN';

const sampleProducts = [
    {
        id: 1,
        name: "S-01 OVERSIZED TECHNICAL HOODIE",
        price: 1400000,
        badge: "BESTSELLER",
        image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "T-04 ACID WASH INDUSTRIAL TEE",
        price: 650000,
        badge: "NEW DROP",
        image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "C-09 STRUCTURAL UTILITY CARGOS",
        price: 1800000,
        badge: "LIMITED",
        image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "W-02 FIELD MODULAR COACH JACKET",
        price: 2200000,
        badge: "POPULAR",
        image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI(); // Langsung render item keranjang yang tersimpan
});

function fetchProducts() {
    fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(products => renderProducts(products))
        .catch(() => renderProducts(sampleProducts));
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    
    products.forEach(p => {
        const badgeHTML = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
        container.innerHTML += `
            <div class="product-card">
                ${badgeHTML}
                <img src="${p.image_url}" alt="${p.name}" class="product-img">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-price">Rp ${p.price.toLocaleString('id-ID')}</p>
                <button class="btn-outline" onclick="openVariantModal('${p.name}', ${p.price})">ADD TO CART +</button>
            </div>
        `;
    });
}

// 2. Fungsi simpan array keranjang ke localStorage
function saveCartToStorage() {
    localStorage.setItem('brothers_cart', JSON.stringify(cart));
}

document.getElementById('btn-confirm-add').addEventListener('click', () => {
    const size = document.getElementById('select-size').value;
    const color = document.getElementById('select-color').value;

    cart.push({
        name: currentSelectedProduct.name,
        price: currentSelectedProduct.price,
        size, color
    });

    saveCartToStorage(); // Simpan ke browser
    updateCartUI();
    closeVariantModal();
    toggleCartModal();
});

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;

    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    let total = 0;
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#666; text-align:center; padding:20px 0;">Keranjang belanja kosong.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
                    <div>
                        <strong>${item.name}</strong>
                        <br><small style="color:#aaa;">Ukuran: ${item.size} | Warna: ${item.color}</small>
                        <br><small style="color:#d2ff00;">Rp ${item.price.toLocaleString('id-ID')}</small>
                    </div>
                    <button onclick="removeItem(${index})" style="color:#ff4444; background:none; border:none; cursor:pointer; font-weight:bold;">Hapus</button>
                </div>
            `;
        });
    }

    const totalEl = document.getElementById('cart-total-price');
    if (totalEl) totalEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCartToStorage(); // Perbarui penyimpanan saat item dihapus
    updateCartUI();
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function openVariantModal(name, price) {
    currentSelectedProduct = { name, price };
    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('variant-modal').style.display = 'block';
}

function closeVariantModal() {
    document.getElementById('variant-modal').style.display = 'none';
}

function toggleLanguage() {
    currentLang = currentLang === 'EN' ? 'ID' : 'EN';
    document.getElementById('lang-toggle').innerText = currentLang === 'EN' ? 'ID' : 'EN';

    document.querySelectorAll('[data-id]').forEach(el => {
        el.innerText = currentLang === 'ID' ? el.getAttribute('data-id') : el.getAttribute('data-en');
    });
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert('Keranjang kosong!');
    let msg = 'Halo Brothers Clothes, saya mau order:\n\n';
    cart.forEach((item, i) => msg += `${i+1}. ${item.name} (${item.size}/${item.color}) - Rp ${item.price.toLocaleString('id-ID')}\n`);
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
}

function checkoutShopee() {
    window.open('https://shopee.co.id/brothersclothes', '_blank');
}

function checkoutTikTok() {
    window.open('https://tiktok.com/@brothersclothes', '_blank');
}

function toggleSidebarMenu() {
    const menu = document.getElementById('side-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}