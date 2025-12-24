// firebase.js - Firebase Authentication for Uplodify

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyCVRlmw3-PCtGd5s3R-a0fJQsBF1YjPRWI",
    authDomain: "uplodify-9eb07.firebaseapp.com",
    databaseURL: "https://uplodify-9eb07-default-rtdb.firebaseio.com",
    projectId: "uplodify-9eb07",
    storageBucket: "uplodify-9eb07.firebasestorage.app",
    messagingSenderId: "158848017856",
    appId: "1:158848017856:web:94aaaf14320490d52a5425",
    measurementId: "G-1PLGMECD19"
};

// Initialize Firebase
let app;
let auth;

try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    auth = firebase.auth();
    
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// ===== AUTH STATE LISTENER =====
auth?.onAuthStateChanged((user) => {
    console.log("Auth state changed. User:", user ? user.email : "No user");
    
    if (user) {
        // User is signed in
        if (user.emailVerified) {
            // Email is verified, show permission section
            if (typeof showSection === 'function') {
                showSection('permissionSection');
            }
            
            // Update UI elements if they exist
            updateUIForLoggedInUser(user);
        } else {
            // Email not verified, show verification reminder
            showEmailVerificationReminder(user);
            
            // Return to login section
            if (typeof showSection === 'function') {
                showSection('loginSection');
            }
        }
    } else {
        // User is signed out
        if (typeof showSection === 'function') {
            showSection('loginSection');
        }
    }
});

// ===== REGISTER USER =====
function registerUser(email, password) {
    if (!auth) {
        showError("Firebase not initialized");
        return Promise.reject("Firebase not initialized");
    }
    
    // Show loading state on register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.textContent = 'Creating Account...';
        registerBtn.disabled = true;
    }
    
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Send email verification
            return sendEmailVerification(userCredential.user);
        })
        .then(() => {
            showSuccess("Registration successful! Please check your email for verification.");
            
            // Auto logout to force email verification
            return auth.signOut();
        })
        .catch((error) => {
            handleAuthError(error, 'register');
            
            // Reset button state
            if (registerBtn) {
                registerBtn.textContent = 'Sign Up';
                registerBtn.disabled = false;
            }
            
            throw error;
        });
}

// ===== LOGIN USER =====
function loginUser(email, password) {
    if (!auth) {
        showError("Firebase not initialized");
        return Promise.reject("Firebase not initialized");
    }
    
    // Show loading state on login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
    }
    
    return auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            if (!user.emailVerified) {
                // Log out user if email not verified
                return auth.signOut()
                    .then(() => {
                        throw new Error('EMAIL_NOT_VERIFIED');
                    });
            }
            
            showSuccess("Login successful!");
            return user;
        })
        .catch((error) => {
            handleAuthError(error, 'login');
            
            // Reset button state
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.disabled = false;
            }
            
            throw error;
        });
}

// ===== FORGOT PASSWORD =====
function sendPasswordResetEmail(email) {
    if (!auth) {
        showError("Firebase not initialized");
        return Promise.reject("Firebase not initialized");
    }
    
    return auth.sendPasswordResetEmail(email)
        .then(() => {
            showSuccess("Password reset email sent! Check your inbox.");
            return true;
        })
        .catch((error) => {
            handleAuthError(error, 'reset');
            throw error;
        });
}

// ===== LOGOUT USER =====
function logoutUser() {
    if (!auth) {
        showError("Firebase not initialized");
        return Promise.reject("Firebase not initialized");
    }
    
    return auth.signOut()
        .then(() => {
            showSuccess("Logged out successfully");
            return true;
        })
        .catch((error) => {
            handleAuthError(error, 'logout');
            throw error;
        });
}

// ===== DELETE ACCOUNT =====
function deleteUserAccount() {
    if (!auth || !auth.currentUser) {
        showError("No user logged in");
        return Promise.reject("No user logged in");
    }
    
    const user = auth.currentUser;
    
    // Confirm deletion
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        return Promise.reject("User cancelled deletion");
    }
    
    return user.delete()
        .then(() => {
            showSuccess("Account deleted successfully");
            return true;
        })
        .catch((error) => {
            // If error is due to recent login, re-authenticate
            if (error.code === 'auth/requires-recent-login') {
                showError("Please login again to delete your account");
                // Trigger re-login flow
                promptReauthentication();
                throw error;
            }
            
            handleAuthError(error, 'delete');
            throw error;
        });
}

// ===== HELPER FUNCTIONS =====

// Send email verification
function sendEmailVerification(user) {
    return user.sendEmailVerification()
        .then(() => {
            console.log("Verification email sent to:", user.email);
            return user;
        })
        .catch((error) => {
            console.error("Error sending verification email:", error);
            throw error;
        });
}

// Show email verification reminder
function showEmailVerificationReminder(user) {
    const message = `Please verify your email (${user.email}) before logging in. Check your inbox for the verification link.`;
    showError(message);
    
    // Add resend verification button functionality
    const resendBtn = document.getElementById('goRegisterBtn');
    if (resendBtn) {
        const originalText = resendBtn.textContent;
        resendBtn.textContent = 'Resend Verification Email';
        resendBtn.onclick = function() {
            sendEmailVerification(user)
                .then(() => {
                    showSuccess("Verification email resent! Check your inbox.");
                    resendBtn.textContent = originalText;
                    resendBtn.onclick = null;
                })
                .catch((error) => {
                    handleAuthError(error, 'verification');
                });
        };
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    // Update any user-specific UI elements here
    console.log("User logged in:", user.email);
    
    // You could update profile section with user info
    const profileSection = document.getElementById('profileSection');
    if (profileSection) {
        const header = profileSection.querySelector('h1');
        if (header) {
            header.textContent = `Profile - ${user.email}`;
        }
    }
}

// Handle authentication errors
function handleAuthError(error, context) {
    console.error(`Auth error (${context}):`, error);
    
    let errorMessage = "An error occurred. Please try again.";
    
    switch (error.code || error.message) {
        case 'auth/email-already-in-use':
            errorMessage = "This email is already registered. Try logging in instead.";
            break;
        case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
        case 'auth/weak-password':
            errorMessage = "Password should be at least 6 characters.";
            break;
        case 'auth/user-not-found':
            errorMessage = "No account found with this email.";
            break;
        case 'auth/wrong-password':
            errorMessage = "Incorrect password. Please try again.";
            break;
        case 'auth/too-many-requests':
            errorMessage = "Too many attempts. Please try again later.";
            break;
        case 'auth/requires-recent-login':
            errorMessage = "Please login again to perform this action.";
            break;
        case 'EMAIL_NOT_VERIFIED':
            errorMessage = "Please verify your email before logging in. Check your inbox.";
            break;
        case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your internet connection.";
            break;
        default:
            if (error.message) {
                errorMessage = error.message;
            }
    }
    
    showError(errorMessage);
}

// Show error message
function showError(message) {
    console.error("Error:", message);
    alert(`Error: ${message}`);
}

// Show success message
function showSuccess(message) {
    console.log("Success:", message);
    alert(`Success: ${message}`);
}

// Prompt reauthentication (for delete account)
function promptReauthentication() {
    const email = prompt("Please enter your email to re-authenticate:");
    if (!email) return;
    
    const password = prompt("Please enter your password:");
    if (!password) return;
    
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    
    if (auth.currentUser) {
        auth.currentUser.reauthenticateWithCredential(credential)
            .then(() => {
                showSuccess("Re-authenticated successfully. Please try deleting your account again.");
            })
            .catch((error) => {
                handleAuthError(error, 'reauthenticate');
            });
    }
}

// ===== EVENT LISTENER SETUP =====
document.addEventListener('DOMContentLoaded', function() {
    // Register button event
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('registerEmail')?.value;
            const password = document.getElementById('registerPassword')?.value;
            const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
            
            if (!email || !password || !confirmPassword) {
                showError("Please fill in all fields.");
                return;
            }
            
            if (password !== confirmPassword) {
                showError("Passwords do not match.");
                return;
            }
            
            if (password.length < 6) {
                showError("Password must be at least 6 characters.");
                return;
            }
            
            registerUser(email, password).catch(() => {
                // Error already handled in registerUser
            });
        });
    }
    
    // Login button event
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                showError("Please enter both email and password.");
                return;
            }
            
            loginUser(email, password).catch(() => {
                // Error already handled in loginUser
            });
        });
    }
    
    // Forgot password button event
    const forgotBtn = document.getElementById('goForgotBtn');
    if (forgotBtn) {
        forgotBtn.addEventListener('click', function() {
            const email = prompt("Enter your email to reset password:");
            if (email) {
                sendPasswordResetEmail(email).catch(() => {
                    // Error already handled
                });
            }
        });
    }
    
    // Logout button event
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser().catch(() => {
                // Error already handled
            });
        });
    }
    
    // Delete account button event
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            deleteUserAccount().catch(() => {
                // Error already handled
            });
        });
    }
    
    // Check if showSection function exists (from app.js)
    if (typeof showSection !== 'function') {
        console.warn("showSection function not found from app.js");
        
        // Create a fallback showSection function
        window.showSection = function(sectionId) {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        };
    }
    
    console.log("Firebase auth handlers initialized");
});

// Export functions for global access (if needed)
window.firebaseAuth = {
    registerUser,
    loginUser,
    sendPasswordResetEmail,
    logoutUser,
    deleteUserAccount,
    getCurrentUser: () => auth?.currentUser
};
