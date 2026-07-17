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

function updateDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        
    });

    document.getElementById("current-date").textContent = date;
    document.getElementById("current-time").textContent = time;
}

// Update immediately
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);

/* ================================================= */
/* DROPDOWN NAVIGATION ALERTS */
/* ================================================= */
