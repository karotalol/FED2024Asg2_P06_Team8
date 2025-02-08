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

    const welcomeNavbar = document.getElementById("welcome-navbar");
    const welcomeOffcanvas = document.getElementById("welcome-offcanvas");

    const guestMessageNavbar = document.getElementById("guest-navbar");
    const guestMessageOffcanvas = document.getElementById("guest-offcanvas");

    const loginButton = document.getElementById("login-button");
    const registerButton = document.getElementById("register-button");


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


const API_URL = "https://fedteam8assg2-c0be.restdb.io/rest/registerteam8"; // RestDB url
const API_KEY = "67a32a852b46a6d1ffb90fc5"; // API key

// register form
async function handleRegister(event) {
    event.preventDefault();  

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("All fields are required.");
        return;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    try {
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

    if (!email || !password) {
        alert("Both fields are required.");
        return;
    }

    try {
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

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    if (registerForm) registerForm.addEventListener("submit", handleRegister); 

    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLogin); 
});

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

    document.getElementById("promoInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkPromo();
        }
    });
}
