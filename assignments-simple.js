// Simple Assignment Manager
document.addEventListener('DOMContentLoaded', function() {
    console.log('Assignment script loaded');
    
    // Initialize assignments
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    
    // Initialize 20 empty slots if needed
    if (assignments.length === 0) {
        for (let i = 1; i <= 20; i++) {
            assignments.push({
                slotNumber: i,
                title: '',
                submissionUrl: '',
                description: '',
                status: 'pending',
                submissionDate: null
            });
        }
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }
    
    // Populate slot select
    function populateSlotSelect() {
        const select = document.getElementById('slotNumber');
        if (select) {
            select.innerHTML = '<option value="">Chọn slot</option>';
            
            for (let i = 1; i <= 20; i++) {
                const assignment = assignments.find(a => a.slotNumber === i);
                const isAvailable = !assignment || assignment.status === 'pending';
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Slot ${i}${isAvailable ? '' : ' (Đã nộp)'}`;
                option.disabled = !isAvailable;
                select.appendChild(option);
            }
        }
    }
    
    // Update statistics
    function updateStats() {
        const submitted = assignments.filter(a => a.status === 'submitted').length;
        const pending = 20 - submitted;
        
        const totalSlotsEl = document.getElementById('totalSlots');
        const submittedCountEl = document.getElementById('submittedCount');
        const pendingCountEl = document.getElementById('pendingCount');
        
        if (totalSlotsEl) totalSlotsEl.textContent = '20';
        if (submittedCountEl) submittedCountEl.textContent = submitted;
        if (pendingCountEl) pendingCountEl.textContent = pending;
    }
    
    // Submit assignment
    function submitAssignment(slotNumber, title, url, description) {
        if (!slotNumber || !title || !url) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return false;
        }
        
        const slotIndex = assignments.findIndex(a => a.slotNumber == slotNumber);
        if (slotIndex !== -1) {
            assignments[slotIndex] = {
                slotNumber: parseInt(slotNumber),
                title: title,
                submissionUrl: url,
                description: description || '',
                status: 'submitted',
                submissionDate: new Date().toISOString()
            };
            
            localStorage.setItem('assignments', JSON.stringify(assignments));
            populateSlotSelect();
            updateStats();
            renderAssignments();
            
            alert('Nộp bài thành công!');
            return true;
        }
        
        alert('Có lỗi xảy ra!');
        return false;
    }
    
    // Render assignments list
    function renderAssignments() {
        const container = document.getElementById('assignmentsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        const submittedAssignments = assignments.filter(a => a.status === 'submitted');
        
        if (submittedAssignments.length === 0) {
            container.innerHTML = '<p class="no-assignments">Chưa có bài tập nào được nộp</p>';
            return;
        }
        
        submittedAssignments.forEach(assignment => {
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = 'assignment-item';
            assignmentDiv.innerHTML = `
                <div class="assignment-header">
                    <span class="slot-number">Slot ${assignment.slotNumber}</span>
                    <span class="status submitted">Đã nộp</span>
                </div>
                <h4>${assignment.title}</h4>
                <p><strong>URL:</strong> <a href="${assignment.submissionUrl}" target="_blank">${assignment.submissionUrl}</a></p>
                ${assignment.description ? `<p><strong>Mô tả:</strong> ${assignment.description}</p>` : ''}
                <p><strong>Ngày nộp:</strong> ${new Date(assignment.submissionDate).toLocaleDateString('vi-VN')}</p>
                <button onclick="deleteAssignment(${assignment.slotNumber})" class="btn btn-danger btn-sm">Xóa</button>
            `;
            container.appendChild(assignmentDiv);
        });
    }
    
    // Delete assignment
    window.deleteAssignment = function(slotNumber) {
        if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
            const slotIndex = assignments.findIndex(a => a.slotNumber == slotNumber);
            if (slotIndex !== -1) {
                assignments[slotIndex] = {
                    slotNumber: parseInt(slotNumber),
                    title: '',
                    submissionUrl: '',
                    description: '',
                    status: 'pending',
                    submissionDate: null
                };
                
                localStorage.setItem('assignments', JSON.stringify(assignments));
                populateSlotSelect();
                updateStats();
                renderAssignments();
                
                alert('Đã xóa bài tập!');
            }
        }
    };
    
    // Handle form submission
    const form = document.getElementById('assignmentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const success = submitAssignment(
                formData.get('slotNumber'),
                formData.get('assignmentTitle'),
                formData.get('submissionUrl'),
                formData.get('description')
            );
            
            if (success) {
                form.reset();
            }
        });
    }
    
    // Initialize everything
    populateSlotSelect();
    updateStats();
    renderAssignments();
    
    console.log('Assignment manager initialized');
});