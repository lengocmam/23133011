// Assignments page specific JavaScript

let currentPage = 1;
const itemsPerPage = 12;
let filteredAssignments = [];
let allAssignments = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assignments data
    initializeAssignments();
    
    // Setup form submission
    setupFormSubmission();
    
    // Initialize pagination
    setupPagination();
});

function initializeAssignments() {
    const assignmentCards = document.querySelectorAll('.assignment-card');
    allAssignments = Array.from(assignmentCards).map(card => ({
        id: parseInt(card.dataset.id),
        title: card.dataset.title,
        element: card,
        submitted: card.classList.contains('submitted')
    }));
    
    filteredAssignments = [...allAssignments];
    updatePagination();
}

function setupFormSubmission() {
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', function(e) {
            // Validate form
            const assignmentId = document.getElementById('assignmentId').value;
            const submissionUrl = document.getElementById('submissionUrl').value;
            
            if (!assignmentId || assignmentId < 1 || assignmentId > 155) {
                e.preventDefault();
                showNotification('ID bài tập phải từ 1 đến 155', 'error');
                return;
            }
            
            if (!isValidUrl(submissionUrl)) {
                e.preventDefault();
                showNotification('URL không hợp lệ', 'error');
                return;
            }
            
            // Check if assignment already submitted
            const existingAssignment = allAssignments.find(a => a.id === parseInt(assignmentId) && a.submitted);
            if (existingAssignment) {
                if (!confirm('Bài tập này đã được nộp. Bạn có muốn ghi đè không?')) {
                    e.preventDefault();
                    return;
                }
            }
        });
    }
}

function filterAssignments() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredAssignments = allAssignments.filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm) || 
                            assignment.id.toString().includes(searchTerm);
        
        let matchesStatus = true;
        if (statusFilter === 'submitted') {
            matchesStatus = assignment.submitted;
        } else if (statusFilter === 'pending') {
            matchesStatus = !assignment.submitted;
        }
        
        return matchesSearch && matchesStatus;
    });
    
    currentPage = 1;
    updatePagination();
    displayCurrentPage();
}

function displayCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Hide all assignments
    allAssignments.forEach(assignment => {
        assignment.element.style.display = 'none';
    });
    
    // Show filtered assignments for current page
    const pageAssignments = filteredAssignments.slice(startIndex, endIndex);
    pageAssignments.forEach(assignment => {
        assignment.element.style.display = 'block';
    });
    
    // Update grid layout
    const grid = document.getElementById('assignmentsGrid');
    if (grid) {
        grid.style.display = pageAssignments.length > 0 ? 'grid' : 'block';
        
        if (pageAssignments.length === 0) {
            if (!grid.querySelector('.no-results')) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = '<p>Không tìm thấy bài tập nào.</p>';
                grid.appendChild(noResults);
            }
        } else {
            const noResults = grid.querySelector('.no-results');
            if (noResults) {
                noResults.remove();
            }
        }
    }
}

function setupPagination() {
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        displayCurrentPage();
        return;
    }
    
    // Previous button
    const prevBtn = createPaginationButton('«', currentPage > 1, () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            displayCurrentPage();
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationContainer.appendChild(createPaginationButton('1', true, () => goToPage(1)));
        if (startPage > 2) {
            paginationContainer.appendChild(createPaginationButton('...', false));
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i.toString(), true, () => goToPage(i));
        if (i === currentPage) {
            btn.classList.add('active');
        }
        paginationContainer.appendChild(btn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationContainer.appendChild(createPaginationButton('...', false));
        }
        paginationContainer.appendChild(createPaginationButton(totalPages.toString(), true, () => goToPage(totalPages)));
    }
    
    // Next button
    const nextBtn = createPaginationButton('»', currentPage < totalPages, () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            displayCurrentPage();
        }
    });
    paginationContainer.appendChild(nextBtn);
    
    displayCurrentPage();
}

function createPaginationButton(text, enabled, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = !enabled;
    
    if (enabled && onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

function goToPage(page) {
    currentPage = page;
    updatePagination();
    displayCurrentPage();
}

function quickSubmit(assignmentId) {
    // Convert to number if it's a string
    const id = typeof assignmentId === 'string' ? parseInt(assignmentId) : assignmentId;
    
    const url = prompt('Nhập URL bài tập:');
    if (url && isValidUrl(url)) {
        // Create form data
        const formData = new FormData();
        formData.append('assignmentId', id);
        formData.append('submissionUrl', url);
        formData.append('title', 'Bài tập ' + id);
        
        // Submit
        fetch('submit', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showNotification('Nộp bài thành công!', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showNotification('Có lỗi xảy ra!', 'error');
            }
        })
        .catch(error => {
            showNotification('Có lỗi xảy ra!', 'error');
        });
    } else if (url) {
        showNotification('URL không hợp lệ!', 'error');
    }
}

function editAssignment(assignmentId) {
    // Convert to number if it's a string
    const id = typeof assignmentId === 'string' ? parseInt(assignmentId) : assignmentId;
    
    // Find assignment data
    const assignment = allAssignments.find(a => a.id === id);
    if (!assignment) return;
    
    // Get current values from the card
    const card = assignment.element;
    const currentUrl = card.querySelector('.submission-url a')?.href || '';
    const currentTitle = card.querySelector('.assignment-title')?.textContent || '';
    
    // Fill edit form
    document.getElementById('editAssignmentId').value = id;
    document.getElementById('editTitle').value = currentTitle;
    document.getElementById('editSubmissionUrl').value = currentUrl;
    
    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Add CSS for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        background-color: #10b981;
    }
    
    .notification-error {
        background-color: #ef4444;
    }
    
    .notification-info {
        background-color: #2563eb;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .no-results {
        text-align: center;
        color: #6b7280;
        font-size: 1.2rem;
        padding: 3rem;
    }
`;
document.head.appendChild(notificationStyle);