import { auth } from "./config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
//import forgot password
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
//import sign out function
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


//logout Button


// Use Event Delegation to catch the submit event even if the form is added later
document.addEventListener("submit", function(event) {
    // Check if the submitted element is our dynamic login form
    if (event.target && event.target.id === 'login-form') {
        console.log("Login form submitted via dynamic modal");
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await user.reload(); // refresh verification status
                // EMAIL VERIFICATION CHECK
                if (!user.emailVerified) {
                    await signOut(auth);
                    alert("Please verify your email before continuing.");
                    return;
                }
                window.location.href = "patient_dashboard.html?uid=" + encodeURIComponent(user.uid);
            })
            .catch((error) => {
                console.error("Auth Error:", error.code);
                alert("Wrong email or password. Please try again.");
            });
    }
});

// Forgot Password Functionality
document.addEventListener("click", async (event) => {
    const link = event.target.closest("#forgotPasswordLink");
    if (!link) return;

    event.preventDefault();

    // better UX: try to auto-get email if user already typed it
    let email = document.getElementById("email")?.value;

    if (!email) {
        email = prompt("Enter your email for password reset:");
    }

    if (!email) {
        alert("Email is required");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

//exporting signOut
//export const signOut = signOut(auth);

//Logout
// Logout
async function loggingOut() {
    try {
        await signOut(auth);
        alert("Logged out successfully");
        window.location.href = "welcome.html";
    } catch (error) {
        console.error(error);
        alert("Logout failed");
    }
}

const logOutBtn = document.getElementById("logOutBtn");

if (logOutBtn) {
    logOutBtn.addEventListener("click", loggingOut);
}