document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const userId = document.getElementById('userId');
    const password = document.getElementById('password');
    const userIdError = document.getElementById('userIdError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    
    // Add animation to form elements
    animateLoginForm();
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Real-time validation
    userId.addEventListener('input', function() {
        validateStudentId(this.value);
    });
    
    // Form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Reset error messages
        userIdError.style.display = 'none';
        passwordError.style.display = 'none';
        
        // Validate Student ID format
        if (!validateStudentId(userId.value)) {
            isValid = false;
        }
        
        if (isValid) {
            // For demo purposes, we'll use a simple login process
            // that accepts any password
            loginUser(userId.value);
        }
    });
    
    function validateStudentId(value) {
        // Updated pattern: 'sec' followed by any 7 characters/numbers
        const userIdPattern = /^sec.{7}$/i;
        if (!userIdPattern.test(value)) {
            userIdError.textContent = 'Student ID must start with "sec" followed by 7 characters';
            userIdError.style.display = 'block';
            return false;
        }
        userIdError.style.display = 'none';
        return true;
    }
    
    function loginUser(userId) {
        // Simulate API call with timeout
        const loadingBtn = document.querySelector('.login-btn');
        const originalText = loadingBtn.textContent;
        loadingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loadingBtn.disabled = true;
        
        setTimeout(() => {
            // Store user info in sessionStorage
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            loadingBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            loadingBtn.style.backgroundColor = 'var(--success-color)';
            
            // Redirect to dashboard after showing success
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        }, 1000);
    }
    
    function animateLoginForm() {
        const formElements = [
            document.querySelector('.login-header'),
            ...document.querySelectorAll('.input-group'),
            document.querySelector('.remember-forgot'),
            document.querySelector('.login-btn'),
            document.querySelector('.login-footer')
        ];
        
        formElements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
                element.style.transitionDelay = `${index * 0.1}s`;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Add shake animation for error feedback
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}); 