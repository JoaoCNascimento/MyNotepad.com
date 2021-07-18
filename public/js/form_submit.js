const form = document.querySelector('form');
const errorField = document.querySelector('.error.message')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorField.textContent = '';

    try {
        const res = await fetch('/cadastrar', {
            method: 'POST',
            body: JSON.stringify({
                name: form.name.value,
                email: form.email.value,
                birthDate: form.birthDate.value,
                password: form.password.value,
                passwordConfirm: form.passwordConfirm.value
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
        errorField.textContent = "Houve um erro ao tentar se cadastrar.";
    }
})