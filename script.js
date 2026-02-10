// Global Variables
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const loginModal = document.getElementById('loginModal');
const backToTopBtn = document.getElementById('backToTop');
const ratingStars = document.querySelectorAll('.rating-stars i');

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    setupNavigation();
    setupModals();
    setupRatingSystem();
    setupScrollEffects();
    setupFormHandlers();
    checkAuthStatus();
}

// Navigation Setup
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Modal Setup
function setupModals() {
    if (loginModal) {
        const closeBtn = loginModal.querySelector('.close');

        // Close modal events
        closeBtn.addEventListener('click', closeLogin);

        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLogin();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && loginModal.classList.contains('active')) {
                closeLogin();
            }
        });
    }
}

// Login/Signup Modal Functions
function openLogin() {
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLogin() {
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function showSignup() {
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Rating System
function setupRatingSystem() {
    if (ratingStars.length > 0) {
        ratingStars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                updateRating(rating);
            });

            star.addEventListener('mouseover', () => {
                highlightStars(index + 1);
            });
        });

        // Reset on mouse leave
        const ratingContainer = document.querySelector('.rating-stars');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                const currentRating = getCurrentRating();
                updateRating(currentRating);
            });
        }
    }
}

function highlightStars(rating) {
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function updateRating(rating) {
    highlightStars(rating);
    localStorage.setItem('userRating', rating);
}

function getCurrentRating() {
    return parseInt(localStorage.getItem('userRating')) || 0;
}

// Scroll Effects
function setupScrollEffects() {
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Form Handlers
function setupFormHandlers() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup Form  
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackForm);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Logging in...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Mock login success
        isLoggedIn = true;
        currentUser = { email: email, name: 'User' };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        updateAuthUI();
        closeLogin();
        showAlert('Login successful!', 'success');

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const phone = e.target.querySelector('input[type="tel"]').value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Creating Account...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Mock signup success
        isLoggedIn = true;
        currentUser = { email: email, name: name, phone: phone };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        updateAuthUI();
        closeLogin();
        showAlert('Account created successfully!', 'success');

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleContactForm(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate sending
    setTimeout(() => {
        showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleFeedbackForm(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate sending
    setTimeout(() => {
        showAlert('Thank you for your feedback!', 'success');
        e.target.reset();

        // Reset rating
        ratingStars.forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
        localStorage.removeItem('userRating');

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Authentication Functions
function checkAuthStatus() {
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedUser = localStorage.getItem('currentUser');

    if (savedAuth === 'true' && savedUser) {
        isLoggedIn = true;
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (isLoggedIn && currentUser) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            loginBtn.onclick = showUserMenu;
        } else {
            loginBtn.innerHTML = 'Login / Signup';
            loginBtn.onclick = openLogin;
        }
    }
}

function showUserMenu() {
    // Simple logout for now
    if (confirm('Do you want to logout?')) {
        logout();
    }
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showAlert('Logged out successfully!', 'info');
}

// Service Functions - Updated to show coming soon instead of redirecting
function showComingSoon() {
    showAlert('This service is coming soon! We are working hard to bring you the best healthcare experience.', 'info');
}

// Emergency Functions
function callAmbulance() {
    const confirmCall = confirm('This will initiate an emergency ambulance call. Do you want to continue?');

    if (confirmCall) {
        showAlert('Connecting to emergency services...', 'warning');

        setTimeout(() => {
            showAlert('Emergency services have been notified. Help is on the way!', 'success');
        }, 2000);
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Auto remove
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize rating on page load
window.addEventListener('load', () => {
    const savedRating = getCurrentRating();
    if (savedRating > 0) {
        updateRating(savedRating);
    }
});