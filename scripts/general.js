window.onload = () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    build_left_menu("dashboard");
}


