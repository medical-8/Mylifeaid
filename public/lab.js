import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, collectionGroup, query, where, getDocs, collection, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyABwRJyK5SdeC4FM0jTbnVbiV4hU3TXB6I",
    authDomain: "mylaid-f9947.firebaseapp.com",
    projectId: "mylaid-f9947",
    storageBucket: "mylaid-f9947.firebasestorage.app",
    messagingSenderId: "315125553793",
    appId: "1:315125553793:web:af4ac3618e0531fa190b80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let providerId = null;
let myStaffNumber = "";
let pendingLabRequests = [];

/* Sidebar Navigation Toggle */
const navItems = document.querySelectorAll('.sidebar-menu li');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        if(!targetTab) return;

        navItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        item.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

function updateDateTime() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDateStamp').innerText = now.toLocaleDateString('en-ZA', options);
}
setInterval(updateDateTime, 60000);
updateDateTime();

onAuthStateChanged(auth, async function(user) {
    if (user) {
        try {
            const q = query(collectionGroup(db, 'team'), where('email', '==', user.email));
            const snap = await getDocs(q);
            
            if (!snap.empty) {
                const staffDoc = snap.docs[0];
                const staffData = staffDoc.data();
                
                myStaffNumber = staffData.staffNumber;
                providerId = staffDoc.ref.parent.parent.id;
                
                document.getElementById('user-display-name').innerText = staffData.name + " | " + staffData.staffNumber;
                document.getElementById('welcomeMessage').innerText = "Welcome, " + staffData.name;

                loadPendingLabRequests();
            } else {
                alert("Unauthorized access. Staff profile not found.");
                signOut(auth);
            }
        } catch (error) {
            console.error("Error fetching staff profile:", error);
        }
    } else {
        window.location.href = "staff_index.html";
    }
});

async function loadPendingLabRequests() {
    const tbody = document.getElementById('labRequestsTableBody');
    try {
        const bSnap = await getDocs(collection(db, "healthcare_services", providerId, "bookings"));
        pendingLabRequests = [];
        
        bSnap.forEach(function(doc) {
            const b = doc.data();
            
            if (b.status === "Lab Requested" || b.serviceType === "Pathology") {
                const requestData = b;
                requestData.id = doc.id;
                pendingLabRequests.push(requestData);
            }
        });

        pendingLabRequests.sort(function(a, b) {
            return new Date(b.appointmentDate || 0) - new Date(a.appointmentDate || 0);
        });
        
        renderLabRequests();

    } catch (error) {
        console.error("Error loading pathology requests:", error);
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; color:red;'>Failed to load laboratory requests. Check console logs.</td></tr>";
    }
}

function renderLabRequests() {
    const tbody = document.getElementById('labRequestsTableBody');
    tbody.innerHTML = "";

    if (pendingLabRequests.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding: 20px;'>No pending lab orders found.</td></tr>";
        return;
    }

    pendingLabRequests.forEach(function(req) {
        const dateStr = req.appointmentDate || "Today";
        const timeStr = req.appointmentTime || "STAT";
        const idStr = req.idNumber || "N/A";
        const nameStr = req.firstName ? (req.firstName + " " + req.surname) : "Patient";
        const testStr = req.reason || req.testType || "General Blood Panel";
        const priority = req.urgency || "Routine";

        let badgeClass = "badge-routine";
        if (priority === "STAT" || priority === "Critical") badgeClass = "badge-stat";
        else if (priority === "Urgent") badgeClass = "badge-urgent";

        let rowHtml = "<tr>";
        rowHtml += "<td><strong>" + dateStr + "</strong><br><small style='color:#666;'>" + timeStr + "</small></td>";
        rowHtml += "<td class='id-cell'>" + idStr + "</td>";
        rowHtml += "<td><strong>" + nameStr + "</strong></td>";
        rowHtml += "<td>" + testStr + "</td>";
        rowHtml += "<td><span class='badge " + badgeClass + "'>" + priority + "</span></td>";
        rowHtml += "<td>";
        rowHtml += "<div class='action-btns'>";
        rowHtml += "<button class='btn-done' onclick=\"updateLabStatus('" + req.id + "', 'Processing')\">Process</button>";
        rowHtml += "<button class='btn-not-done' onclick=\"updateLabStatus('" + req.id + "', 'Rejected')\">Reject</button>";
        rowHtml += "</div>";
        rowHtml += "</td>";
        rowHtml += "</tr>";

        tbody.innerHTML += rowHtml;
    });
}

window.updateLabStatus = async function(bookingId, newStatus) {
    if(!confirm("Are you sure you want to mark this lab request as " + newStatus + "?")) return;

    try {
        await updateDoc(doc(db, "healthcare_services", providerId, "bookings", bookingId), {
            status: newStatus
        });
        
        pendingLabRequests = pendingLabRequests.filter(function(p) {
            return p.id !== bookingId;
        });
        
        renderLabRequests();
        
    } catch (error) {
        console.error("Error updating lab status:", error);
        alert("Failed to update status. Please try again.");
    }
}

/* Form Event Handlers */
window.handleSpecimenIntake = function(e) {
    e.preventDefault();
    const barcode = document.getElementById('specimenBarcode').value;
    const patientId = document.getElementById('patientIdInput').value;
    alert("Specimen " + barcode + " successfully registered for Patient ID: " + patientId);
    document.getElementById('specimenIntakeForm').reset();
};

window.handleResultSubmission = function(e) {
    e.preventDefault();
    const barcode = document.getElementById('resultBarcode').value;
    alert("Diagnostic test results for sample " + barcode + " have been authorized and published to patient record.");
    document.getElementById('resultsEntryForm').reset();
};

document.getElementById('logoutBtn').addEventListener('click', async function() {
    await signOut(auth);
    window.location.href = "staff_index.html";
});