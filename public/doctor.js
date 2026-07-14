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
    idLabel.innerText = "STAFF NUMBER";
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
    openPopup("User Profile Status", "No User Session Detected.\nPlease sign up or log in to view active medical credentials.");
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
        alert("Verification required. Please enter your ID / Staff validation number.");
        return;
    }

    // Dynamic South African Identification Parsing Rule for Staff
    if (btnStaff.classList.contains('active') && userInput.length !== 13) {
        alert("Invalid Formatting: Standard National Staff IDs must follow the 13-digit identification configuration.");
        return;
    }

    // Capture whether the current tab flow is 'admin' or 'staff/doctor'
    const userRole = btnAdmin.classList.contains('active') ? 'admin' : 'staff';

    // Load Form Phase 2 inside dynamic Modal view
    openModal(`
        <h3 style="margin-bottom:20px; color:#1D4352;">Account Verification</h3>
        <input type="hidden" id="regRole" value="${userRole}">
        
        <div class="input-group">
            <label>Full Legal Name</label>
            <input type="text" id="regName" placeholder="Enter full name and surname">
        </div>
        <div class="input-group">
            <label>Secure Email Address</label>
            <input type="email" id="regEmail" placeholder="name@hospital.com">
        </div>
        <div class="input-group">
            <label>Mobile Contact Number</label>
            <input type="tel" id="regPhone" placeholder="e.g. +27 82 123 4567">
        </div>
        <div class="input-group">
            <label>Create Password</label>
            <input type="password" id="regPass" placeholder="••••••••">
        </div>
        <button class="final-signup-btn" id="createBtn">CREATE ACCOUNT</button>
        <p class="login-note">Already have an account? <a href="#" id="modalToLoginLink">Login here</a></p>
    `);
};

// Render Login Interface Directly
function renderLoginModal() {
    openModal(`
        <h3 style="margin-bottom:20px; color:#1D4352;">Welcome to MyLifeAid Login</h3>
        <div class="input-group">
            <label>Role / Account Type</label>
            <select id="loginRole" style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid #ccc;">
                <option value="staff">Staff / Doctor Dashboard</option>
                <option value="admin">Admin Dashboard</option>
            </select>
        </div>
        <div class="input-group">
            <label>Registered Email Address / User ID</label>
            <input type="text" id="loginUser" placeholder="MP-XXXXXXX or Email">
        </div>
        <div class="input-group">
            <label>Password</label>
            <input type="password" id="loginPass" placeholder="••••••••">
        </div>
        <button class="final-signup-btn" id="submitLoginBtn">LOGIN</button>
        <p class="login-note">New to the platform? <a href="#" id="modalToSignupLink">Create an account</a></p>
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
                alert("Please fill out your profile registration fields.");
                return;
            }
            
            alert(`Registration process completed for ${name}! Welcome onboard.`);
            closeModal();

            // Routing validation
            if (role === 'admin') {
                window.location.href = "dashboard_index.html";
            } else {
                window.location.href = "doctor_dashboard.html";
            }
        };
    }

    // Dynamic Form Submission Captures (LOG IN)
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    if (submitLoginBtn) {
        submitLoginBtn.onclick = () => {
            const user = document.getElementById('loginUser').value.trim();
            const selectedRole = document.getElementById('loginRole').value;
            
            if(!user) {
                alert("Authentication details are required.");
                return;
            }
            
            alert("Login handshake successful. Redirecting to your workspace panel...");
            closeModal();

            // Forward to the correct standalone file based on selected role
            if (selectedRole === 'admin') {
                window.location.href = "dashboard_index.html";
            } else {
                window.location.href = "doctor_dashboard.html";
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