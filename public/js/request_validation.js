const btn_request = document.getElementById("btn-delete");
const btn_confirm = document.querySelector(".confirm");
const btn_cancel = document.querySelector(".cancel");
const error_message = document.querySelector(".error.message");
error_message.textContent = '';

const delete_confirm_window = document.querySelector("#alert");
delete_confirm_window.style.cssText = "display: none"

btn_request.addEventListener('click', () => {
    btn_request_handler("delete")
})

btn_confirm.addEventListener('click', () => {
    btn_request_handler("confirm")
})

btn_cancel.addEventListener('click', () => {
    btn_request_handler("cancel")
})

async function btn_request_handler (value) {

    error_message.textContent = '';

    if (value == "delete") {
        delete_confirm_window.style.cssText = "display: flex"
        btn_request.style.cssText = "display: none"
    }

    if (value == "cancel") {
        delete_confirm_window.style.cssText = "display: none"
        btn_request.style.cssText = ""
    }

    if (value == "confirm") {   
        try {
            let password = document.querySelector("#password").value;
            console.log(password);

            const response = await fetch("/excluir_conta/", {
                method: "DELETE",
                body: JSON.stringify({ password: password }),
                headers: { "Content-Type" : "application/json" }
            })
                .then((res) => {
                    return res;
                })
                .catch((er) => console.log(er))

            const data = await response.json();

            if (data.error_message) {
                error_message.textContent = data.error_message
            }

            if (data.success) {
                error_message.style.cssText = "color: green";
                error_message.textContent = data.success;
                location.assign("/");
            }
        } 
        catch {
            error_message.textContent = "Falha na exclusão.";
        }
    }
}