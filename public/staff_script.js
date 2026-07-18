// DOM Element Selectors
const btnStaff = document.getElementById('btn-Staff');
const btnAdmin = document.getElementById('btn-Admin');
const idLabel = document.getElementById('id-label');
const idInput = document.getElementById('id-input');
const nextBtn = document.getElementById('nextBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalBodyDiv = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

const popupBackground = document.getElementById('popupBackground');
const popupTitle = document.getElementById('popupTitle');
const popupMessage = document.getElementById('popupMessage');
const closePopupButton = document.getElementById('closePopupButton');

/* ================================================= */
/* SIGNUP CARD TOGGLE CONTROLS */
/* ================================================= */
btnStaff.onclick = () => {
    btnStaff.classList.add('active');
    btnAdmin.classList.remove('active');
    idLabel.innerText = "STAFF ID";
    idInput.placeholder = "Enter STAFF ID";
};

btnAdmin.onclick = () => {
    btnAdmin.classList.add('active');
    btnStaff.classList.remove('active');
    idLabel.innerText = "ADMIN ID";
    idInput.placeholder = "Enter ADMIN ID";
};

/* ================================================= */
/* POPUP SYSTEM (For Help & Static Alert Messages) */
/* ================================================= */
function openPopup(title, message) {
    popupTitle.innerText = title;
    popupMessage.innerText = message;
    popupBackground.style.display = "flex";
}

function closePopup() {
    popupBackground.style.display = "none";
}

closePopupButton.onclick = closePopup;
popupBackground.onclick = (e) => { if (e.target === popupBackground) closePopup(); };

// Navbar Hookups for Popups
document.getElementById("helpButton").onclick = () => {
    openPopup("Need Help?", "Customer Care Hotline: 0800 123 456\nEmail Support: support@mylifeaid.co.za");
};

document.getElementById("userButton").onclick = () => {
    openPopup("User Profile Status", "No User Session Detected.\nPlease enter your Staff or Admin number to view active medical credentials.");
};

/* ================================================= */
/* MODAL VIEW MANAGER (Sign-Up / Login Integration)  */
/* ================================================= */
function openModal(bodyHtml) {
    modalBodyDiv.innerHTML = bodyHtml;
    modalOverlay.style.display = 'flex';
    attachModalDynamicEvents();
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

closeModalBtn.onclick = closeModal;
modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };

/* ================================================= */
/* MULTI-STEP WORKFLOW VALIDATIONS */
/* ================================================= */
nextBtn.onclick = () => {
    const userInput = idInput.value.trim();

    if (userInput === "") {
        openPopup("Verification required.",
            " Please enter your ID / Staff validation number.");
        return;
    }

    // Dynamic South African Identification Parsing Rule
    if (btnStaff.classList.contains('active') && userInput.length !== 13) {
        openPopup("Invalid Formatting:",
            "Standard National Staff IDs must follow the 13-digit identification configuration.");
        return;
    }

    // Track if the user selected Admin for the registration setup
    nextBtn.onclick = () => {
        const userInput = idInput.value.trim();

        if (userInput === "") {
            openPopup(
                "Verification Required",
                "Please enter your Staff ID or Admin ID."
            );
            return;
        }

        if (btnStaff.classList.contains("active")) {
            window.location.href = "doctor.html";
        } else if (btnAdmin.classList.contains("active")) {
            window.location.href = "admin_dashboard.html";
        }
    };
};

// Render Login Interface Directly
function renderLoginModal() {
    openModal(`
        <h3 style="margin-bottom:20px; color:#1D4352;">Welcome to MyLifeAid Login</h3>
        <div class="input-group">
            <label>Registered Email Address / User ID</label>
            <input type="text" id="loginUser" placeholder="MP-XXXXXXX or Email">
        </div>
        <div class="input-group">
            <label>Password</label>
            <input type="password" id="loginPass" placeholder="••••••••">
        </div>
        <button class="final-signup-btn" id="submitLoginBtn">LOGIN</button>
    `);
}

// Bind Global Header Login Click Events
document.getElementById("loginHeaderBtn").onclick = (e) => {
    e.preventDefault();
    renderLoginModal();
};
/* ================================================= */
/* DYNAMIC CONTEXT EVENT LISTENERS */
/* ================================================= */
function attachModalDynamicEvents() {
    // Inter-modal connection link redirects
    const modalToLoginLink = document.getElementById('modalToLoginLink');
    if (modalToLoginLink) {
        modalToLoginLink.onclick = (e) => {
            e.preventDefault();
            renderLoginModal();
        };
    }

    const modalToSignupLink = document.getElementById('modalToSignupLink');
    if (modalToSignupLink) {
        modalToSignupLink.onclick = (e) => {
            e.preventDefault();
            idInput.value = ""; // Clear out state elements
            closeModal();
            idInput.focus();
        };
    }

    // Dynamic Form Submission Captures (SIGN UP)
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.onclick = () => {
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const role = document.getElementById('regRole').value;
            
            if(!name || !email) {
                openPopup("","Please fill out your profile registration fields.");
                return;
            }
            
            openPopup("",`Registration process completed for ${name}! Welcome onboard.`);
            closeModal();

            // Redirect to dashboard layout if registered user is an ADMING
            if (role === 'admin') {
                window.location.href = "dashedboard_index.html";
            }

             if (role === 'staff') {
                window.location.href = "Doctor.html";
            }
        };
    }

    // Dynamic Form Submission Captures (LOG IN)
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    if (submitLoginBtn) {
        submitLoginBtn.onclick = () => {
            const user = document.getElementById('loginUser').value.trim();
            if(!user) {
                alert("Authentication details are required.");
                return;
            }
            
            alert("Login handshake successful. Redirecting to your workspace panel...");
            closeModal();

            // Since this app connects directly to the admin dashboard panel, redirect here
            if (role === 'admin') {
                window.location.href = "dashedboard_index.html";
            }
        };
    }
}

/* ================================================= */
/* DROPDOWN NAVIGATION ALERTS */
/* ================================================= */
document.getElementById('ourStoryButton').onclick = (e) => { e.preventDefault(); openPopup('Our Story', 'MyLifeAid was founded in 2026 to connect people with critical healthcare resources instantly via centralized cloud monitoring.'); };
document.getElementById('theTeamButton').onclick = (e) => { e.preventDefault(); openPopup('The Team', 'Developed with care by Medical 8:8 UJ Students.'); };
document.getElementById('bedAvailabilityBtn').onclick = (e) => { e.preventDefault(); openPopup('Bed Availability Dashboard', 'Loading resource telemetry mapping vectors... Map access active.'); };
document.getElementById('emergencySearchBtn').onclick = (e) => { e.preventDefault(); openPopup('Emergency Contacts', 'Ambulance dispatch: 10177\nPolice response: 10111\nNational Emergency Router: 112'); };
document.getElementById('faqBtn').onclick = (e) => { e.preventDefault(); openPopup('FAQ Hub', 'Q: How do I map local assets?\nA: Input requirements into the telemetry dashboard query filter.\n\nQ: Is personal encryption used?\nA: All healthcare transactions utilize automated AES-256 endpoints.'); };

