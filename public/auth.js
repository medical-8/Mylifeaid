//AUTH STATE CHANGE: allows users to only use the dashboard if they are logged in, otherwise redirects to login page

//get auth from config.js
import { auth } from "./config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User not logged in, redirect to login page
    window.location.replace("welcome.html");
    return;
  } else {
    console.log("User is signed in: " + user.email)
    console.log(user.uid);
  }
});