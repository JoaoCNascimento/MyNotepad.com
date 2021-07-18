const edit_remove_container = document.querySelector(".edit-remove")
const edit_button = document.querySelector(".edit");
const remove_button = document.querySelector(".remove")
//save / cancel
const save_cancel_container = document.querySelector(".save-cancel");
const save_button = document.querySelector(".save");
const cancel_button = document.querySelector(".cancel");
// note elements
const noteId = document.querySelector("#noteId").textContent.toString();

var noteDefault = {
    title: title.value,
    content: textarea.value,
    color: select.value
}
//error text field
const error_message = document.querySelector(".error.message");

edit_button.addEventListener('click', () => {
    btn_action("edit");
})

remove_button.addEventListener('click', () => {
    btn_action("remove");
})

save_button.addEventListener('click', () => {
    btn_action("save");
})

cancel_button.addEventListener('click', () => {
    btn_action("cancel");
})



function btn_action (arg) {

    error_message.textContent = "";

    if(arg == "edit"){
        edit_remove_container.style.cssText = "display: none";
        save_cancel_container.style.cssText = "display: flex";
        title.disabled = false;
        textarea.disabled = false;
        select.disabled = false;
    }
    else if(arg == "save"){
        edit_remove_container.style.cssText = "display: flex";
        save_cancel_container.style.cssText = "display: none";
        title.disabled = true;
        textarea.disabled = true;
        select.disabled = true;

        save()
    }
    else if(arg == "cancel"){
        edit_remove_container.style.cssText = "display: flex";
        save_cancel_container.style.cssText = "display: none";
        select.disabled = true;
        title.value = noteDefault.title;
        textarea.value = noteDefault.content;
        select.value = noteDefault.color;
        set_note_color();
    }   
    else if(arg == "remove"){
        remove()
    }
    else {
        location.reload();
    }

}

async function save() {
    try {
        const res = await fetch("/notepad/alterar_anotacao/"+noteId, {
            method: 'PUT',
            body: JSON.stringify({
                title: title.value,
                content: textarea.value,
                color: select.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        const data = await res.json();
    
        if (data.error_message){
            error_message.textContent = data.error_message;
        }
    
        if (data.success){
            error_message.textContent = data.success;
            error_message.style.cssText = "color: green"
        }
    }
    catch {
        error_message.textContent = "Houve um erro ao salvar as alterações.";
    }
}

async function remove() {
    try {
        const res = await fetch("/notepad/excluir_anotacao/" + noteId, {
            method: 'DELETE'
        });
        
        const data = await res.json();
    
        if (data.error_message){
            error_message.textContent = data.error_message;
            return;
        }
    
        if (data.success) {
            return location.assign('/notepad');
        }
    }
    catch {
        error_message.textContent = "Houve um erro ao tentar excluir a nota."
    }
}