document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const productDetails = document.getElementById('product-details');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout');
    const cartCountEl = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Met à jour le compteur de produits dans le panier
    function updateCartCount() {
        if (cartCountEl) {
            cartCountEl.textContent = cart.length;
        }
    }

    // Initialisation du compteur de panier
    updateCartCount();

    // Charger et afficher les produits sur la page d'accueil
    if (productList) {
        fetch('data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                productList.innerHTML = products.map(product => `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">Prix : ${product.price}€</p>
                                <a href="product.html?id=${product.id}" class="btn btn-primary">Voir le produit</a>
                            </div>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Erreur lors du chargement des produits :', error));
    }

    // Charger et afficher les détails du produit sur la page produit
    if (productDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        fetch('data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                const product = products.find(p => p.id === productId);

                if (product) {
                    productDetails.innerHTML = `
                        <div class="card">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h3 class="card-title">${product.name}</h3>
                                <p>${product.description}</p>
                                <p>Prix : ${product.price}€</p>
                                <button class="btn btn-success" id="add-to-cart">Ajouter au panier</button>
                            </div>
                        </div>
                    `;

                    // Ajouter au panier
                    document.getElementById('add-to-cart').addEventListener('click', () => {
                        cart.push(product);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert('Produit ajouté au panier !');
                        updateCartCount();
                    });
                } else {
                    productDetails.innerHTML = '<p>Produit non trouvé.</p>';
                }
            })
            .catch(error => console.error('Erreur lors du chargement des détails du produit :', error));
    }

    // Afficher les produits dans le panier
    if (cartItemsContainer && totalPriceEl) {
        renderCart();
    }

    // Fonction pour afficher le panier
    function renderCart() {
        let totalPrice = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            totalPrice += item.price;
            return `
                <p>
                    ${item.name} - ${item.price}€
                </p>
            `;
        }).join('');
        totalPriceEl.textContent = totalPrice.toFixed(2);
    }

    // Confirmer la commande (vider le panier et rediriger)
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Votre panier est vide !');
                return;
            }
            alert('Merci pour votre commande !');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();

            // Rediriger vers checkout.html
            window.location.href = 'checkout.html';
        });
    }
});
