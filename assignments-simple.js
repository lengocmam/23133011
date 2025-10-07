// Read-only Assignment List - Chỉ hiển thị, không cho chỉnh sửa
document.addEventListener('DOMContentLoaded', function() {
    console.log('Assignment list loaded (read-only mode)');
    
    // Predefined assignments - bài tập có sẵn (chỉ đọc)
    const assignments = [
        {
            slotNumber: 1,
            title: 'Trang giới thiệu công ty - Odoo',
            submissionUrl: 'https://duyle.odoo.com/about-us',
            description: 'Website giới thiệu công ty sử dụng Odoo platform',
            submissionDate: ''
        },
        {
            slotNumber: 2,
            title: 'Website mới - Render Deployment',
            submissionUrl: 'https://webmoi-t953.onrender.com/',
            description: 'Website được deploy trên Render platform',
            submissionDate: ''
        },
        {
            slotNumber: 3,
            title: 'Tuần 2 - Bài tập Duy',
            submissionUrl: 'https://tuan2duy.onrender.com/',
            description: 'Bài tập tuần 2 về HTML/CSS cơ bản',
            submissionDate: ''
        },
        {
            slotNumber: 4,
            title: 'Buổi 4 Web - 23133011',
            submissionUrl: 'https://buoi4web-23133011-duy.onrender.com',
            description: 'Bài tập buổi 4 về JavaScript và DOM',
            submissionDate: ''
        },
        {
            slotNumber: 6,
            title: 'Tuần 3 - Chương 6 (Part 1)',
            submissionUrl: 'https://tuan3-chuong6.onrender.com',
            description: 'Bài tập chương 6 phần 1 về form handling',
            submissionDate: ''
        },
        {
            slotNumber: 7,
            title: 'Chương 6 (Part 2) - TV49',
            submissionUrl: 'https://chuong6-2-tv49.onrender.com',
            description: 'Bài tập chương 6 phần 2 về validation',
            submissionDate: ''
        },
        {
            slotNumber: 8,
            title: 'Chương 8 - Advanced Features',
            submissionUrl: 'https://chuong8.onrender.com',
            description: 'Bài tập chương 8 về các tính năng nâng cao',
            submissionDate: ''
        },
        {
            slotNumber: 9,
            title: 'Chương 9 (Part 2) - Final Project',
            submissionUrl: 'https://chuong9-2.onrender.com',
            description: 'Bài tập chương 9 phần 2 - dự án cuối kỳ',
            submissionDate: ''
        },
        {
            slotNumber: 10,
            title: 'Chương 9 (Part 1) - Introduction',
            submissionUrl: 'https://chuong9-1.onrender.com',
            description: 'Bài tập chương 9 phần 1 - giới thiệu framework',
            submissionDate: ''
        },
        {
            slotNumber: 11,
            title: 'Shopping Cart - Chương 7 Part 1',
            submissionUrl: 'https://chuong7-1.onrender.com',
            description: 'Xây dựng giỏ hàng với JavaScript',
            submissionDate: ''
        },
        {
            slotNumber: 12,
            title: 'Download Feature - Chương 7 Part 2',
            submissionUrl: 'https://chuong7-2a.onrender.com/',
            description: 'Tính năng download và xử lý file',
            submissionDate: ''
        },
        {
            slotNumber: 13,
            title: 'Chương 12 - Database Integration',
            submissionUrl: 'https://chuong12-rojr.onrender.com',
            description: 'Tích hợp cơ sở dữ liệu và backend',
            submissionDate: ''
        },
        {
            slotNumber: 14,
            title: 'Chương 12 - Database Integration',
            submissionUrl: 'https://bai13-1-z9i6.onrender.com',
            description: 'Tích hợp cơ sở dữ liệu và backend',
            submissionDate: ''
        },
        {
            slotNumber: 15,
            title: 'Chương 14 - email',
            submissionUrl: 'https://one4-1.onrender.com',
            description: '',
            submissionDate: ''
        }
        
    ];
    
    // Update statistics (read-only)
    function updateStats() {
        const totalSlots = 20;
        const submitted = assignments.length;
        const pending = totalSlots - submitted;
        
        const totalSlotsEl = document.getElementById('totalSlots');
        const submittedCountEl = document.getElementById('submittedCount');
        const pendingCountEl = document.getElementById('pendingCount');
        
        if (totalSlotsEl) totalSlotsEl.textContent = totalSlots;
        if (submittedCountEl) submittedCountEl.textContent = submitted;
        if (pendingCountEl) pendingCountEl.textContent = pending;
    }
    
    // Render assignments list (read-only)
    function renderAssignments() {
        const container = document.getElementById('assignmentsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (assignments.length === 0) {
            container.innerHTML = '<p class="no-assignments">Chưa có bài tập nào</p>';
            return;
        }
        
        // Sort by slot number
        const sortedAssignments = [...assignments].sort((a, b) => a.slotNumber - b.slotNumber);
        
        sortedAssignments.forEach(assignment => {
            const assignmentDiv = document.createElement('div');
            assignmentDiv.className = 'assignment-item';
            assignmentDiv.innerHTML = `
                <div class="assignment-header">
                    <span class="slot-number">Slot ${assignment.slotNumber}</span>
                    <span class="status submitted">Đã hoàn thành</span>
                </div>
                <h4>${assignment.title}</h4>
                <p><strong>🔗 URL:</strong> <a href="${assignment.submissionUrl}" target="_blank" rel="noopener">${assignment.submissionUrl}</a></p>
                ${assignment.description ? `<p><strong>📝 Mô tả:</strong> ${assignment.description}</p>` : ''}
                <p><strong>📅 Ngày hoàn thành:</strong> ${assignment.submissionDate}</p>
            `;
            container.appendChild(assignmentDiv);
        });
    }
    
    // Add info note
    function addInfoNote() {
        const container = document.querySelector('.assignments-section .container');
        if (container && !document.querySelector('.info-note')) {
            const note = document.createElement('div');
            note.className = 'info-note';
            note.style.cssText = `
                background: linear-gradient(135deg, #e8f5e8, #c8e6c8);
                border: 2px solid #4caf50;
                border-radius: 15px;
                padding: 1.5rem;
                margin: 2rem 0;
                text-align: center;
                color: #2e7d32;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
            `;
            note.innerHTML = `
                <i class="fas fa-check-circle" style="margin-right: 0.5rem; font-size: 1.2rem; color: #4caf50;"></i>
                <strong>Danh sách các bài tập đã hoàn thành trong khóa học Web Development</strong>
                <br><small style="margin-top: 0.5rem; display: block; opacity: 0.8;">Click vào các link để xem chi tiết từng bài tập</small>
            `;
            
            // Insert after the stats
            const stats = container.querySelector('.stats-summary');
            if (stats) {
                stats.after(note);
            }
        }
    }
    
    // Initialize everything (read-only mode)
    updateStats();
    renderAssignments();
    addInfoNote();
    
    console.log('Read-only assignment list initialized with', assignments.length, 'assignments');
});
