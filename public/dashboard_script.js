document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('userButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. Toggle user dropdown visibility when clicking the 👤 icon
    if (userButton && userDropdown) {
        userButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents immediate closing
            const isDisplayed = userDropdown.style.display === 'block';
            userDropdown.style.display = isDisplayed ? 'none' : 'block';
        });
    }

    // 2. Close user dropdown if clicking anywhere else on the document
    document.addEventListener('click', () => {
        if (userDropdown) userDropdown.style.display = 'none';
    });

    // 3. Handle Logout action and redirection
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Stop default anchor link jumps

            // Clear authentication sessions here if applicable
            // Example: sessionStorage.clear(); localStorage.removeItem('token');

            alert("Logging you out..."); // Optional user notification

            // Redirects browser back to home page (change 'index.html' if named differently)
            window.location.href = 'index.html'; 
        });
    }
});