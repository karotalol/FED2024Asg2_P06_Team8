document.addEventListener('DOMContentLoaded', () => {
    const offcanvasToggle = document.querySelector('.offcanvas-toggle');
    const offcanvasMenu = document.querySelector('.offcanvas-menu');
    const images = document.querySelectorAll('.carousel-image');
    const notificationButton = document.querySelector('.notification-button');
    const notificationBox = document.querySelector('.notification-box');
    const body = document.querySelector('body');
    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const searchSuggestions = document.getElementById('search-suggestions');
    let currentIndex = 0;

    // toggle offcanvas menu
    offcanvasToggle.addEventListener('click', () => {
        offcanvasMenu.classList.toggle('active');
    });

    // close offcanvas menu when clicking outside
    body.addEventListener('click', (event) => {
        if (!offcanvasMenu.contains(event.target) && !offcanvasToggle.contains(event.target)) {
            offcanvasMenu.classList.remove('active');
        }
    });

    // toggle notification box
    notificationButton.addEventListener('click', () => {
        notificationBox.classList.toggle('active');
    });

    // carousel
    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    showImage(currentIndex);

    // change image every 3 seconds
    setInterval(nextImage, 3000);

    // fetch and display products
    async function fetchProducts(query = '') {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const products = await response.json();

            const filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            );

            productGrid.innerHTML = '';

            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('card');
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        <button class="buy-button">Buy Now</button>
                    `;
                    productGrid.appendChild(productCard);
                });
            } else {
                productGrid.innerHTML = '<p>No products found</p>';
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = '<p>Failed to fetch products. Please try again later.</p>';
        }
    }

    // show search suggestions as cards below the search bar
    function showSearchSuggestions(query) {
        if (!query) {
            searchSuggestions.innerHTML = ''; 
            searchSuggestions.classList.remove('active'); 
            return;
        }

        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(products => {
                const filteredSuggestions = products.filter(product =>
                    product.title.toLowerCase().includes(query.toLowerCase())
                );

                searchSuggestions.innerHTML = '';

                // show suggestions below the search bar
                if (filteredSuggestions.length > 0) {
                    searchSuggestions.classList.add('active'); 
                    filteredSuggestions.forEach(product => {
                        const suggestionCard = document.createElement('div');
                        suggestionCard.classList.add('suggestion-card');
                        suggestionCard.innerHTML = `
                            <img src="${product.image}" alt="${product.title}" class="suggestion-img">
                            <p>${product.title}</p>
                        `;
                        suggestionCard.addEventListener('click', () => {
                            searchBar.value = product.title; 
                            searchSuggestions.innerHTML = ''; 
                            searchSuggestions.classList.remove('active');
                            fetchProducts(product.title); 
                        });
                        searchSuggestions.appendChild(suggestionCard);
                    });
                } else {
                    searchSuggestions.innerHTML = '<p>No suggestions found</p>';
                }
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }

    // product fetch
    fetchProducts();

    // search function
    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        showSearchSuggestions(query);
    });

    // close suggestions when clicking outside
    body.addEventListener('click', (event) => {
        if (!searchSuggestions.contains(event.target) && event.target !== searchBar) {
            searchSuggestions.innerHTML = ''; 
            searchSuggestions.classList.remove('active');
        }
    });
});
