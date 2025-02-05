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

    // Elements for welcome message
    const welcomeNavbar = document.getElementById("welcome-navbar");
    const welcomeOffcanvas = document.getElementById("welcome-offcanvas");

    // Elements for guest message
    const guestMessageNavbar = document.getElementById("guest-navbar");
    const guestMessageOffcanvas = document.getElementById("guest-offcanvas");

    // Elements for login and register buttons
    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");

    // Elements for log out button
    const logoutButton = document.getElementById("logout-button");

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

    // Check and display username from localStorage for welcome message
    function updateWelcomeMessage() {
        const username = localStorage.getItem("username");
        if (username) {
            // Show logged in user's name and hide the guest message
            welcomeNavbar.textContent = `Welcome, ${username}`;
            welcomeOffcanvas.textContent = `Welcome, ${username}`;
            guestMessageNavbar.style.display = "none";
            guestMessageOffcanvas.style.display = "none";

            // Hide login/register buttons
            loginButton.style.display = "none";
            registerButton.style.display = "none";

            // Show logout button
            logoutButton.style.display = "block";
        } else {
            // Show guest message if not logged in
            welcomeNavbar.style.display = "none";
            welcomeOffcanvas.style.display = "none";
            guestMessageNavbar.style.display = "block";
            guestMessageOffcanvas.style.display = "block";

            // Show login/register buttons
            loginButton.style.display = "block";
            registerButton.style.display = "block";

            // Hide logout button
            logoutButton.style.display = "none";
        }
    }

    // Call update function on page load
    updateWelcomeMessage();

    // Handle log out functionality
    logoutButton.addEventListener('click', () => {
        // Remove user data from localStorage
        localStorage.removeItem("username");

        // Redirect to login page
        window.location.href = "../html-folders/login.html";
    });

});

// RestDB API & Forms

const API_URL = "https://fedteam8assg2-c0be.restdb.io/rest/registerteam8"; // RestDB URL
const API_KEY = "67a32a852b46a6d1ffb90fc5"; // Your actual API key

// Handle Register Form
async function handleRegister(event) {
    event.preventDefault();  // Prevent form submission

    // Get form inputs
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    try {
        // Step 1: Check if username or email already exists
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

        // Step 2: Send Registration Data
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
        window.location.href = "../html-folders/login.html"; // Redirect to login page

    } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    }
}

// Handle Login Form
async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    if (!email || !password) {
        alert("Both fields are required.");
        return;
    }

    try {
        // Step 1: Check if email and password match
        const checkResponse = await fetch(`${API_URL}?q={"email":"${email}","password":"${password}"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-apikey": API_KEY, "Cache-Control": "no-cache" }
        });

        if (!checkResponse.ok) throw new Error("Failed to check user.");

        const user = await checkResponse.json();
        if (user.length === 0) {
            document.getElementById("login-msg").style.display = "block"; // Show error message
        } else {
            // Store username in local storage
            localStorage.setItem("username", user[0].username);
            alert("Login successful!");
            window.location.href = "../index.html"; // Redirect to home page
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Login failed. Please try again.");
    }
}

// Attach event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) registerForm.addEventListener("submit", handleRegister); // Register form

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLogin); // Login form
});

