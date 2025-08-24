function build_left_menu(selected_tab){
    Controller.get_flags().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const flags = data.data.result;

        const left_menu_container = document.querySelector("nav");

        let left_menu_buttons_html = "";

        if (selected_tab == "dashboard"){
            left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Дашборд</p></div>`;
        }else{
            left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='general.html'"><p class="nav_button_text">Дашборд</p></div>`;
        }

        if (flags.web.tabs_flags.sales){
            if (selected_tab == "sales") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Продажи</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button"><p class="nav_button_text">Продажи</p></div>`;
            }
        }

        if (flags.web.tabs_flags.hosts) {
            if (selected_tab == "hosts") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Хосты</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='hosts.html'"><p class="nav_button_text">Хосты</p></div>`;
            }
        }

        if (flags.web.tabs_flags.users) {
            if (selected_tab == "users") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Пользователи</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='users.html'"><p class="nav_button_text">Пользователи</p></div>`;
            }
        }

        if (flags.web.tabs_flags.market) {
            if (selected_tab == "market") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Магазин</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='market.html'"><p class="nav_button_text">Магазин</p></div>`;
            }
        }

        if (flags.web.tabs_flags.staff) {
            if (selected_tab == "staff") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Сотрудники</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='staff.html'"><p class="nav_button_text">Сотрудники</p></div>`;
            }
        }

        if (flags.web.tabs_flags.apps) {
            if (selected_tab == "apps") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Приложения</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button"><p class="nav_button_text">Приложения</p></div>`;
            }
        }

        if (flags.web.tabs_flags.config) {
            if (selected_tab == "config") {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button nav_button_active"><p class="nav_button_text">Конфигурация</p></div>`;
            } else {
                left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="document.location='config.html'"><p class="nav_button_text">Конфигурация</p></div>`;
            }
        }

        left_menu_buttons_html = left_menu_buttons_html + `<div class="nav_button" onclick="logout()"><p class="nav_button_text">Выход</p></div>`;

        left_menu_container.innerHTML = left_menu_buttons_html;
    });
}

function hide_email(email){
    var atIndex = email.indexOf('@');
    if (atIndex > 1) {
        return email.replace(email.substring(1, atIndex), '***');
    } else {
        return email;
    }
}

function hide_phone(phone) {
    let retrun_value = "";

    for (let i = 0; i < phone.length; i++) {   
        if(phone[0] == "+"){
            if (i >= 2 && i < phone.length - 4){
                retrun_value = retrun_value + "*";
            }else{
                retrun_value = retrun_value + phone[i];
            }
        }else{
            if (i >= 1 && i < phone.length - 4) {
                retrun_value = retrun_value + "*";
            } else {
                retrun_value = retrun_value + phone[i];
            }
        }
    }

    return retrun_value;
}

function logout(){
    Controller.logout();
    document.location = "index.html";
}