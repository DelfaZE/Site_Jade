document.addEventListener('DOMContentLoaded', () => {
    // Variables pour le panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout');

    // Ajouter un produit au panier
    addToCartButtons?.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
            };

            cart.push(product);
            totalPrice += product.price;

            saveCart();
            alert(`Le produit "${product.name}" a été ajouté au panier !`);
        });
    });

    // Afficher les produits dans le panier
    if (cartItemsContainer && totalPriceEl) {
        renderCart();
    }

    // Supprimer un produit du panier
    cartItemsContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const productId = e.target.dataset.id;

            // Trouver l'index du produit et le retirer du panier
            const productIndex = cart.findIndex(item => item.id === productId);
            if (productIndex !== -1) {
                totalPrice -= cart[productIndex].price;
                cart.splice(productIndex, 1);
                saveCart();
                renderCart();
            }
        }
    });

    // Passer commande (vider le panier)
    checkoutButton?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre panier est vide !');
            return;
        }
        alert('Merci pour votre commande !');
        cart = [];
        totalPrice = 0;
        saveCart();
        renderCart();
    });

    // Fonction pour afficher le panier
    function renderCart() {
        cartItemsContainer.innerHTML = cart.map(item => `
            <p>
                ${item.name} - ${item.price}€
                <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Supprimer</button>
            </p>
        `).join('');
        totalPriceEl.innerText = totalPrice.toFixed(2);
    }

    // Fonction pour sauvegarder le panier dans localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    }
});
