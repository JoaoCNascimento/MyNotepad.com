const form = document.querySelector('form');
const errorField = document.querySelector('.error.message')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorField.textContent = '';

    try {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const data = await res.json();
        if (data.error_message) {
            errorField.textContent = '*' + data.error_message
        }
    
        if (data.user) {
            location.assign('/notepad');
        }
    }
    catch {
        errorField.textContent = "Erro ao tentar fazer login";
    }
})