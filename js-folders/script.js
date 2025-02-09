// wait for the DOM content to load before executing script

document.addEventListener('DOMContentLoaded', () => {
    // selecting important DOM elements for various functionalities
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

    const welcomeNavbar = document.getElementById("welcome-navbar");
    const welcomeOffcanvas = document.getElementById("welcome-offcanvas");

    const guestMessageNavbar = document.getElementById("guest-navbar");
    const guestMessageOffcanvas = document.getElementById("guest-offcanvas");

    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");

    // toggle the offcanvas menu on button click
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
    // move to next image in the carousel
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    // initialize carousel and show the first image
    showImage(currentIndex);
    setInterval(nextImage, 3000);

    // display username from localstorage for welcome message
    function updateWelcomeMessage() {
        const username = localStorage.getItem("username");
        if (username) {
            welcomeNavbar.textContent = `Welcome, ${username}`;
            welcomeOffcanvas.textContent = `Welcome, ${username}`;
            guestMessageNavbar.style.display = "none";
            guestMessageOffcanvas.style.display = "none";

            loginButton.style.display = "none";
            registerButton.style.display = "none";

        } else {
            // guest message if not logged in
            welcomeNavbar.style.display = "none";
            welcomeOffcanvas.style.display = "none";
            guestMessageNavbar.style.display = "block";
            guestMessageOffcanvas.style.display = "block";

            loginButton.style.display = "block";
            registerButton.style.display = "block";
        }
    }

    updateWelcomeMessage();
});

// rest db url and api key for handling registration
const API_URL = "https://fedteam8assg2-c0be.restdb.io/rest/registerteam8"; // restdb url
const API_KEY = "67a32a852b46a6d1ffb90fc5"; // api key

// register form
async function handleRegister(event) {
    event.preventDefault();  

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // validation
    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    try {
        // check if username or email already exists
        const checkResponse = await fetch(`${API_URL}?q={"$or":[{"username":"${username}"},{"email":"${email}"}]}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": API_KEY, "Cache-Control": "no-cache" }
        });

        if (!checkResponse.ok) throw new Error("Failed to check existing users.");

        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
            alert("Username or Email already exists. Please choose another.");
            return;
        }

        // create a new user
        const userData = { username, email, password };
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-apikey": API_KEY, "Cache-Control": "no-cache" },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + JSON.stringify(errorData));
            return;
        }

        alert("Registration successful!");
        window.location.href = "../html-folders/login.html"; 

    } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    }
}

// login form
async function handleLogin(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    // validation
    if (!email || !password) {
        alert("Both fields are required.");
        return;
    }

    try {
        // check if user exists
        const checkResponse = await fetch(`${API_URL}?q={"email":"${email}","password":"${password}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": API_KEY, "Cache-Control": "no-cache" }
        });

        if (!checkResponse.ok) throw new Error("Failed to check user.");

        const user = await checkResponse.json();
        if (user.length === 0) {
            document.getElementById("login-msg").style.display = "block"; 
        } else {
            localStorage.setItem("username", user[0].username);
            alert("Login successful!");
            window.location.href = "../index.html";
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Login failed. Please try again.");
    }
}

// set event listeners on forms
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) registerForm.addEventListener("submit", handleRegister); 

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLogin); 
});

// load profile info from local storage when on profile page
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem("username");

    const profileUsername = document.getElementById("profile-username");

    if (username) {
        profileUsername.textContent = username;
    } else {
        profileUsername.textContent = "Guest";
    }
});

/* cart promo code */
function checkPromo() {
    let promoCode = document.getElementById("promoInput").value;
    let message = document.getElementById("message");

    if (promoCode.toLowerCase() === "hello") {
        message.innerHTML = "✅ Promo applied! You get a 20% discount.";
        message.style.color = "green";
    } else {
        message.innerHTML = "❌ Invalid promo code. Try again.";
        message.style.color = "red";
    }

    // apply promo when Enter key is pressed
    document.getElementById("promoInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkPromo();
        }
    });
}

// load profile and save settings
window.addEventListener('DOMContentLoaded', (event) => {
    const usernameInput = document.getElementById('username');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const bioInput = document.getElementById('bio');

    if (localStorage.getItem('username')) {
        usernameInput.value = localStorage.getItem('username');
    }
    if (localStorage.getItem('firstName')) {
        firstNameInput.value = localStorage.getItem('firstName');
    }
    if (localStorage.getItem('lastName')) {
        lastNameInput.value = localStorage.getItem('lastName');
    }
    if (localStorage.getItem('bio')) {
        bioInput.value = localStorage.getItem('bio');
    }

    const saveButton = document.getElementById('save-changes');
    if (saveButton) {
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();  
            
            localStorage.setItem('username', usernameInput.value);
            localStorage.setItem('firstName', firstNameInput.value);
            localStorage.setItem('lastName', lastNameInput.value);
            localStorage.setItem('bio', bioInput.value);

            alert('Profile updated successfully!');

            window.location.href = '../html-folders/profile.html';
        });
    }
});

// load profile data from localstorage
window.addEventListener('DOMContentLoaded', (event) => {
    const profileUsername = document.getElementById('profile-username');
    const profileFirstname = document.getElementById('profile-firstname');
    const profileLastname = document.getElementById('profile-lastname');
    const profileBio = document.querySelector('.description-text p:nth-child(1)');

    if (localStorage.getItem('username')) {
        profileUsername.textContent = localStorage.getItem('username');
    }
    if (localStorage.getItem('firstName')) {
        profileFirstname.textContent = localStorage.getItem('firstName');
    }
    if (localStorage.getItem('lastName')) {
        profileLastname.textContent = localStorage.getItem('lastName');
    }
    if (localStorage.getItem('bio')) {
        profileBio.textContent = localStorage.getItem('bio');
    }
});

// load products and display
const apiUrl = 'https://fakestoreapi.com/products';
let allProducts = []; 

function fetchProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            allProducts = products; 
            displayProducts(products); 
        })
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');

    // if there are no products, display a message
    if (products.length === 0) {
        productContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h2 class="product-name">${product.title}</h2>
            <p class="product-price">$${product.price}</p>
            <a href="product.html?id=${product.id}" class="view-product-btn">View Product</a>
        `;
        productContainer.appendChild(productCard); // append to container
    });
}

// handle product search
function searchProducts() {
    const searchBar = document.getElementById('search-bar');
    const searchTerm = searchBar.value.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts); 
    updateSearchSuggestions(searchTerm);
}

// update and display search suggestions
function updateSearchSuggestions(searchTerm) {
    const suggestionsBox = document.getElementById('search-suggestions');
    suggestionsBox.innerHTML = ''; 

    // if search term is less than 2 characters, hide the suggestions box
    if (searchTerm.length < 2) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // filter products based on title matching search term and limit to 5 suggestions
    const matchingProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    ).slice(0, 5); 

    // if no matching products, hide the suggestions box
    if (matchingProducts.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // for each matching product, create a suggestion item
    matchingProducts.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        
        suggestionItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="suggestion-image">
            <span class="suggestion-text">${product.title}</span>
        `;

        // click event redirect
        suggestionItem.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        suggestionsBox.appendChild(suggestionItem);
    });

    // append suggestion item to suggestions box
    suggestionsBox.style.display = 'block';
}

// get product id from url
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// fetch and display product details based on product id
function fetchProductDetails(productId) {
    const productUrl = `https://fakestoreapi.com/products/${productId}`;
    
    fetch(productUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            // update the page with product details
            document.getElementById('product-category').textContent = product.category;
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = `$${product.price}`;
            document.getElementById('product-image').src = product.image; 
            document.getElementById('product-image').alt = product.title; 
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            alert(error.message);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchProducts(); 

    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', searchProducts);
    }

    document.addEventListener('click', (event) => {
        if (!event.target.matches('.search-bar, .suggestion-item')) {
            document.getElementById('search-suggestions').style.display = 'none';
        }
    });

    const productId = getProductId();
    if (productId) {
        fetchProductDetails(productId);
    }
});

// add new listing
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-listing-form");
    
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const imageInput = document.getElementById("image-upload");
            const category = document.getElementById("category").value;
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            const price = document.getElementById("price").value;

            if (imageInput.files.length === 0) {
                alert("Please upload an image.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;

                const newListing = {
                    image: imageUrl,
                    category: category,
                    title: title,
                    description: description,
                    price: price
                };

                let listings = JSON.parse(localStorage.getItem("listings")) || [];
                listings.push(newListing);
                localStorage.setItem("listings", JSON.stringify(listings));

                alert("Listing added successfully!");
                window.location.href = "../html-folders/listing.html";
            };

            reader.readAsDataURL(imageInput.files[0]);
        });
    }

    // display product listings from local storage
    const productContainer = document.getElementById("product-container");
    if (productContainer) {
        const listings = JSON.parse(localStorage.getItem("listings")) || [];

        listings.forEach((listing) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${listing.image}" class="product-image" alt="Product Image">
                <div class="product-name">${listing.title}</div>
                <div class="product-price">$${listing.price}</div>
                <a href="#" class="view-product-btn">View</a>
            `;

            productContainer.appendChild(productCard);
            
        });
    }
        // clear all listings from local storage
        const clearAllBtn = document.getElementById("clear-all-btn");
        if (clearAllBtn) {
            clearAllBtn.addEventListener("click", function () {
                localStorage.removeItem("listings");
    
                const productCards = document.querySelectorAll(".product-card");
                productCards.forEach(card => card.remove());
    
                alert("All listings have been cleared.");
            });
        }
});

// profile image upload
document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.getElementById("profile-img");
    const profileUpload = document.getElementById("profile-upload");

    // check if profile picture is stored in local storage and display it
    if (localStorage.getItem("profilePicture")) {
        profileImg.src = localStorage.getItem("profilePicture");
    }

    // image upload and save to local storage
    profileUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImg.src = e.target.result;  
                localStorage.setItem("profilePicture", e.target.result); 
            };
            reader.readAsDataURL(file);
        }
    });
});


