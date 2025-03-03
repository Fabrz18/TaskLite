window.onload = function() {
    var checkbox = document.getElementById('show-password');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            var passwordInput = document.getElementById('password');
            var ConfirmPasswordInput = document.getElementById('confirm-password');
            if (this.checked) {
                passwordInput.type = 'text';
                ConfirmPasswordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
                ConfirmPasswordInput.type = 'password';
            }
        });
    } else {
        console.error("Elemento #show-password no encontrado.");
    }
};
