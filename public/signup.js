//import config
import { auth, db } from "./config.js";
//create user with email and password
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
//import Firestore functions
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
//import send email verification
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
//import sign out function
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("click", async (event) => {

  if (event.target?.id !== "createBtn") return;

  const emailEl = document.getElementById('SignEmail');
  const passEl = document.getElementById('SignPassword');
  const phoneEl = document.getElementById('SignPhone');
  const nameEl = document.getElementById('fullName');

  if (!emailEl || !passEl || !phoneEl || !nameEl) {
    alert("Form not loaded properly. Try again.");
    return;
  }

  const email = emailEl.value.trim();
  const password = passEl.value.trim();
  const phone = phoneEl.value.trim();
  const fullName = nameEl.value.trim();

  if (!email || !password || !phone || !fullName) {
    alert("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the newly created user
    const user = userCredential.user;
    // Force refresh to get the latest user data
    await user.getIdToken(true);
    // Send email verification
    await sendEmailVerification(user);
    alert("Verification email sent! Please check your inbox.");


    // Save additional user info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      phone,
      fullName,
      createdAt: new Date()
    });

    // Sign out the user immediately after signup to prevent unverified access
    await signOut(auth);
    alert("Account created!");
    // Redirect to login page after successful signup
      window.location.href = "welcome.html";
    

  } catch (err) {
    console.error(err);
    console.log("Error code: " + err.code);
    alert(err.message);
  }
});