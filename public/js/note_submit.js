const form = document.querySelector('form');
const errorField = document.querySelector('.error.message')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorField.textContent = '';

    try {
        const res = await fetch('/notepad/criar_anotacao', {
            method: 'POST',
            body: JSON.stringify({
                title: form.title.value,
                content: form.content.value,
                color: form.color.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const data = await res.json();
        if (data.error_message) {
            errorField.textContent = '*' + data.error_message
        }
    
        if (data.note) {
            location.assign('/notepad');
        }
    }
    catch {
        errorField.textContent = 'Houve um erro ao criar a nota.'
    }
})