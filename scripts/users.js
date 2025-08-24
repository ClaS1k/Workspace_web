var selected_user_id = 0;

function show_user_creation(){
    const user_creation_tab = document.querySelector('.user_creation_tab');
    const user_viewer_tab = document.querySelector('.user_viewer_tab');  

    user_creation_tab.style.display = "block";
    user_viewer_tab.style.display = "none";
}

function show_user_viewer(user_id){
    const user_creation_tab = document.querySelector('.user_creation_tab');
    const user_viewer_tab = document.querySelector('.user_viewer_tab');

    user_creation_tab.style.display = "none";
    user_viewer_tab.style.display = "block";

    selected_user_id = user_id;

    Controller.get_user_data(user_id).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const user = data.data.result;

        const user_viewer_name = document.querySelector('.user_viewer_name');
        const user_viewer_surname = document.querySelector('.user_viewer_surname');
        const user_viewer_username = document.querySelector('.user_viewer_username');
        const user_viewer_email = document.querySelector('.user_viewer_email');
        const user_viewer_phone = document.querySelector('.user_viewer_phone');
        const user_viewer_country = document.querySelector('.user_viewer_country');
        const user_viewer_city = document.querySelector('.user_viewer_city');
        const user_viewer_adress = document.querySelector('.user_viewer_adress');

        user_viewer_name.innerText = user.name;
        user_viewer_surname.innerText = user.surname;
        user_viewer_username.innerText = user.username;
        user_viewer_email.innerText = hide_email(user.email);
        user_viewer_phone.innerText = hide_phone(user.phone);
        user_viewer_country.innerText = user.country;
        user_viewer_city.innerText = user.city;
        user_viewer_adress.innerText = user.address;
    });

    get_user_time(user_id);
}

function show_subtab_user(){
    const user_subtab_icon = document.querySelector('.users_creation_profile_icon');
    const usergroup_subtab_icon = document.querySelector('.users_creation_usergroups_icon');
    const user_subtab_container = document.querySelector('.user_creation_subtab_user');
    const usergroup_subtab_container = document.querySelector('.user_creation_subtab_usergroups');

    user_subtab_icon.classList.add('user_creation_subtab_active');
    usergroup_subtab_icon.classList.remove('user_creation_subtab_active');

    user_subtab_container.style.display = "block";
    usergroup_subtab_container.style.display = "none";
}

function show_subtab_usergroups(){
    const user_subtab_icon = document.querySelector('.users_creation_profile_icon');
    const usergroup_subtab_icon = document.querySelector('.users_creation_usergroups_icon');
    const user_subtab_container = document.querySelector('.user_creation_subtab_user');
    const usergroup_subtab_container = document.querySelector('.user_creation_subtab_usergroups');
    
    user_subtab_icon.classList.remove('user_creation_subtab_active');
    usergroup_subtab_icon.classList.add('user_creation_subtab_active');

    user_subtab_container.style.display = "none";
    usergroup_subtab_container.style.display = "block";
}

function show_notes_modal(){
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.notes_modal');

    content_elem.style.filter = "blur(1.5px)";
    modal_elem.style.display = "block";
}

function hide_notes_modal(){
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.notes_modal');

    content_elem.style.filter = "none";
    modal_elem.style.display = "none";
}

function show_finance_modal() {
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.finance_modal');

    content_elem.style.filter = "blur(1.5px)";
    modal_elem.style.display = "block";
}

function hide_finance_modal() {
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.finance_modal');

    content_elem.style.filter = "none";
    modal_elem.style.display = "none";
}

function show_ban_prompt() {
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.ban_prompt');

    content_elem.style.filter = "blur(1px)";
    modal_elem.style.display = "block";
}

function hide_ban_prompt() {
    const content_elem = document.querySelector('.content');
    const modal_elem = document.querySelector('.ban_prompt');

    content_elem.style.filter = "none";
    modal_elem.style.display = "none";
}

function create_user() {
    const name_elem = document.querySelector(".user_creation_name");
    const surname_elem = document.querySelector(".user_creation_surname");
    const username_elem = document.querySelector(".user_creation_username");
    const password_elem = document.querySelector(".user_creation_password");
    const usergroup_elem = document.querySelector(".user_creation_group_selector");
    const email_elem = document.querySelector(".user_creation_email");
    const phone_elem = document.querySelector(".user_creation_phone");
    const country_elem = document.querySelector(".user_creation_country");
    const city_elem = document.querySelector(".user_creation_city");
    const adress_elem = document.querySelector(".user_creation_adress");

    Controller.create_user(username_elem.value, password_elem.value, name_elem.value, surname_elem.value, email_elem.value, phone_elem.value, city_elem.value, country_elem.value, adress_elem.value).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        } else {
            alert("Пользователь создан!");
            search_input_handler(document.querySelector('.users_search_query_input'));
        }
    });
}

function get_users() {
    Controller.get_users().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const users = data.data.result;

        users_inner_html = ``;

        users.forEach((item, index) => {
            users_inner_html = users_inner_html + `<div class="user_result_container" onclick="show_user_viewer(${item.user_id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="users_result_profile_icon" data-name="Layer 1" viewBox="0 0 24 24" width="34" height="34">
                            <path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z" />
                            <circle cx="12" cy="6" r="6" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" class="users_result_phone_icon" data-name="Layer 1" viewBox="0 0 24 24"
                            width="22" height="22">
                            <path
                                d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm5.665,16.587l-.522,.6c-.551,.552-1.277,.813-2,.813-3.714,0-9.143-5.143-9.143-9.143,0-.723,.261-1.449,.813-2l.6-.522c.446-.446,1.17-.446,1.616,0l1,1.302c.446,.446,.446,1.17,0,1.616l-.851,1.069c.901,2.244,2.429,3.71,4.5,4.5l1.069-.851c.446-.446,1.17-.446,1.616,0l1.302,1c.446,.446,.446,1.17,0,1.616Z" />
                        </svg>

                        <h2 class="user_result_username">${item.username}</h2>
                        <p class="user_result_username_phone">${hide_phone(item.phone)}</p>
                    </div>`;
        });

        const users_list_container = document.querySelector(".users_search_result");

        users_list_container.innerHTML = users_inner_html;
    });
}

function get_usergroups() {
    Controller.get_usergroups().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const usergroups = data.data.result;

        usergroups_inner_html = ``;

        usergroups.forEach((item, index) => {
            usergroups_inner_html = usergroups_inner_html + `<option value="${item.id}">${item.name}</option>`;
        });

        const usergroups_creation_container = document.querySelector(".user_creation_group_selector");
        const usergroups_viewer_container = document.querySelector(".user_viewer_group_selector");

        usergroups_creation_container.innerHTML = usergroups_inner_html;
        usergroups_viewer_container.innerHTML = usergroups_inner_html;
    });
}

function get_user_time(user_id){
    Controller.get_user_time(user_id).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        let available_time = parseInt(data.data.result);
        //доступное время в секундах

        available_time = parseInt(available_time / 60);
        //доступное время в минутах

        let available_hours = parseInt(available_time / 60);
        let available_mins = available_time % 60;

        const users_viewer_time_container = document.querySelector(".users_viewer_time_value");

        users_viewer_time_container.innerText = `${available_hours}ч ${available_mins}м`;
    });
}

function find_users(query) {
    Controller.find_users(query).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const users = data.data.result;

        users_inner_html = ``;

        users.forEach((item, index) => {
            users_inner_html = users_inner_html + `<div class="user_result_container" onclick="show_user_viewer(${item.user_id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="users_result_profile_icon" data-name="Layer 1" viewBox="0 0 24 24" width="34" height="34">
                            <path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z" />
                            <circle cx="12" cy="6" r="6" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" class="users_result_phone_icon" data-name="Layer 1" viewBox="0 0 24 24"
                            width="22" height="22">
                            <path
                                d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm5.665,16.587l-.522,.6c-.551,.552-1.277,.813-2,.813-3.714,0-9.143-5.143-9.143-9.143,0-.723,.261-1.449,.813-2l.6-.522c.446-.446,1.17-.446,1.616,0l1,1.302c.446,.446,.446,1.17,0,1.616l-.851,1.069c.901,2.244,2.429,3.71,4.5,4.5l1.069-.851c.446-.446,1.17-.446,1.616,0l1.302,1c.446,.446,.446,1.17,0,1.616Z" />
                        </svg>

                        <h2 class="user_result_username">${item.username}</h2>
                        <p class="user_result_username_phone">${hide_phone(item.phone)}</p>
                    </div>`;
        });

        const users_list_container = document.querySelector(".users_search_result");

        users_list_container.innerHTML = users_inner_html;
    });
}

function search_input_handler(container){
    if (container.value.length >= 2){
        find_users(container.value);
    }else{
        get_users();
    }
}

window.onload = () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    build_left_menu("users");

    get_users();
    get_usergroups();
}
