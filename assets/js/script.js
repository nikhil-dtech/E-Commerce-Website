'use strict';

const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

const modalCloseFunc = function () { modal.classList.add('closed') }

modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);

const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
});

const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {
    const mobileMenuCloseFunc = function () {
        mobileMenu[i].classList.remove('active');
        overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
        mobileMenu[i].classList.add('active');
        overlay.classList.add('active');
    });

    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);
}

const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {
    accordionBtn[i].addEventListener('click', function () {
        const clickedBtn = this.nextElementSibling.classList.contains('active');

        for (let i = 0; i < accordion.length; i++) {
            if (clickedBtn) break;

            if (accordion[i].classList.contains('active')) {
                accordion[i].classList.remove('active');
                accordionBtn[i].classList.remove('active');
            }
        }

        this.nextElementSibling.classList.toggle('active');
        this.classList.toggle('active');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    const wishlistSidebar = document.getElementById('wishlist-sidebar');
    const closeWishlistBtn = document.getElementById('close-wishlist-sidebar');

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function setCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function getWishlist() {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    }

    function setWishlist(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + (item.qty || 1), 0);

        document.querySelectorAll('.action-btn .count').forEach(count => {
            count.textContent = totalItems;
        });
    }

    function updateWishlistCount() {
        const wishlist = getWishlist();
        document.querySelectorAll('.action-btn .count')[1].textContent = wishlist.length;
    }

    function renderCartSidebar() {
        const cart = getCart();
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="text-align:center;color:#888;">Your cart is empty.</p>';
            cartTotalAmount.textContent = '$0.00';
            return;
        }

        let total = 0;

        cart.forEach((item, idx) => {
            const price = typeof item.price === 'string' ?
                parseFloat(item.price.replace(/[^0-9.-]+/g, '')) :
                item.price;

            total += price * (item.qty || 1);

            cartItemsList.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div>$${price.toFixed(2)}</div>
                        <div class="cart-item-qty">
                            <button onclick="updateCartQty(${idx}, -1)">-</button>
                            <span>${item.qty || 1}</span>
                            <button onclick="updateCartQty(${idx}, 1)">+</button>
                            <button class="cart-item-remove" onclick="removeCartItem(${idx})" title="Remove">&times;</button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartTotalAmount.textContent = '$' + total.toFixed(2);
    }

    function renderWishlistSidebar() {
        const wishlist = getWishlist();
        const wishlistItemsList = document.getElementById('wishlist-items-list');

        if (!wishlistItemsList) return;

        wishlistItemsList.innerHTML = '';

        if (wishlist.length === 0) {
            wishlistItemsList.innerHTML = '<p style="text-align:center;color:#888;">Your wishlist is empty.</p>';
            return;
        }

        wishlist.forEach((item, idx) => {
            wishlistItemsList.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div>${item.price}</div>
                        <button class="cart-item-remove" onclick="removeWishlistItem(${idx})" title="Remove">&times;</button>
                    </div>
                </div>
            `;
        });
    }

    window.updateCartQty = function (idx, delta) {
        const cart = getCart();
        if (cart[idx]) {
            cart[idx].qty = (cart[idx].qty || 1) + delta;
            if (cart[idx].qty < 1) cart[idx].qty = 1;
            setCart(cart);
            renderCartSidebar();
            updateCartCount();
        }
    }

    window.removeCartItem = function (idx) {
        const cart = getCart();
        cart.splice(idx, 1);
        setCart(cart);
        renderCartSidebar();
        updateCartCount();
    }

    window.removeWishlistItem = function (idx) {
        const wishlist = getWishlist();
        wishlist.splice(idx, 1);
        setWishlist(wishlist);
        renderWishlistSidebar();
        updateWishlistCount();
    }

    document.querySelectorAll('.action-btn[aria-label="Cart"], #cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            renderCartSidebar();
        });
    });

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    document.querySelectorAll('#wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            wishlistSidebar.classList.add('open');
            renderWishlistSidebar();
        });
    });

    if (closeWishlistBtn) {
        closeWishlistBtn.addEventListener('click', () => {
            wishlistSidebar.classList.remove('open');
        });
    }

    document.querySelectorAll('.add-cart-btn, .btn-action[aria-label="Add to cart"], .btn-action ion-icon[name="bag-add-outline"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productCard = btn.closest('.showcase, .product-card, .product-minimal .showcase');

            if (!productCard) return;

            const title = productCard.querySelector('.showcase-title, .product-name')?.textContent.trim();
            const priceText = productCard.querySelector('.price')?.textContent.trim();
            const price = priceText ? parseFloat(priceText.replace(/[^0-9.-]+/g, '')) : 0;
            const img = productCard.querySelector('img')?.src || '';

            let cart = getCart();
            const existingItemIndex = cart.findIndex(item => item.title === title);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty = (cart[existingItemIndex].qty || 1) + 1;
            } else {
                cart.push({
                    title,
                    price,
                    img,
                    qty: 1
                });
            }

            setCart(cart);
            updateCartCount();
            renderCartSidebar();

            cartSidebar.classList.add('open');

            alert('Added to cart!');
        });
    });

    document.querySelectorAll('.btn-action ion-icon[name="heart-outline"]').forEach(btn => {
        btn.parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const productCard = btn.closest('.showcase, .product-card');

            if (!productCard) return;

            const title = productCard.querySelector('.showcase-title')?.textContent.trim();
            const price = productCard.querySelector('.price')?.textContent.trim();
            const img = productCard.querySelector('img')?.src;

            let wishlist = getWishlist();

            if (!wishlist.some(item => item.title === title)) {
                wishlist.push({ title, price, img });
                setWishlist(wishlist);
                updateWishlistCount();
                renderWishlistSidebar();
                alert('Added to wishlist!');
            } else {
                alert('This item is already in your wishlist!');
            }
        });
    });

    document.getElementById('clear-cart-btn')?.addEventListener('click', function () {
        localStorage.removeItem('cart');
        updateCartCount();
        renderCartSidebar();
    });

    const searchInput = document.querySelector('.search-field');
    searchInput?.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        document.querySelectorAll('.product-main .showcase').forEach(card => {
            const title = card.querySelector('.showcase-title')?.textContent.toLowerCase();
            card.style.display = title && title.includes(query) ? '' : 'none';
        });
    });

    updateCartCount();
    updateWishlistCount();
});
