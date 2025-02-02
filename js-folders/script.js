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

    // show search suggestions as cards below the search bar
    function showSearchSuggestions(query) {
        if (!query) {
            searchSuggestions.innerHTML = '';
            searchSuggestions.classList.remove('active');
            return;
        }

        const suggestions = [
            { title: 'Product 1', image: 'path-to-image1.jpg' },
            { title: 'Product 2', image: 'path-to-image2.jpg' },
            { title: 'Product 3', image: 'path-to-image3.jpg' },
        ];

        const filteredSuggestions = suggestions.filter(suggestion =>
            suggestion.title.toLowerCase().includes(query.toLowerCase())
        );

        searchSuggestions.innerHTML = '';

        if (filteredSuggestions.length > 0) {
            searchSuggestions.classList.add('active');
            filteredSuggestions.forEach(suggestion => {
                const suggestionCard = document.createElement('div');
                suggestionCard.classList.add('suggestion-card');
                suggestionCard.innerHTML = `
                    <img src="${suggestion.image}" alt="${suggestion.title}" class="suggestion-img">
                    <p>${suggestion.title}</p>
                `;
                suggestionCard.addEventListener('click', () => {
                    searchBar.value = suggestion.title;
                    searchSuggestions.innerHTML = '';
                    searchSuggestions.classList.remove('active');
                    fetchProducts(suggestion.title);
                });
                searchSuggestions.appendChild(suggestionCard);
            });
        } else {
            searchSuggestions.innerHTML = '<p>No suggestions found</p>';
        }
    }

    // product fetch
    fetchProducts();

    // search function
    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        showSearchSuggestions(query);
    });

    body.addEventListener('click', (event) => {
        if (!searchSuggestions.contains(event.target) && event.target !== searchBar) {
            searchSuggestions.innerHTML = '';
            searchSuggestions.classList.remove('active');
        }
    });
});

function handleRegister(event) {
    event.preventDefault(); 


    window.location.href = '../index.html';
}
