function auth(){
    let login = document.querySelector(".login_input").value;
    let password = document.querySelector(".password_input").value;

    Controller.auth(login, password).then(data => {
        if (data.is_error) {
            const error_message_elem = document.querySelector(".error_message");
            error_message_elem.innerText = data.message;
            return;
        } else {
            document.location = "general.html";
        }
    });
}

function keyDownHandler(e) {
    let keyCode = e.keyCode;

    if (keyCode == 13) {
        auth();
    }
}

document.addEventListener("keydown", keyDownHandler, false);
