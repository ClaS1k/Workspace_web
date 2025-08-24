var reservation_selected_user_id = 0;
var reservation_selected_host_id = 0;

function getMinuteDifference(date1, date2) {
    const diffMilliseconds = Math.abs(new Date(date2) - new Date(date1));
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    return diffMinutes;
}

function show_workspace(type, button){
    const workspaces_controls_list = document.querySelectorAll(".hosts_workspaces_controls");
    const workspaces_list = document.querySelectorAll(".hosts_workspaces");

    workspaces_controls_list.forEach(item => item.classList.remove('controls_button_active'));
    workspaces_list.forEach(item => item.style.height = "0");

    button.classList.add('controls_button_active');

    setTimeout((type) => {
        let container;

        switch (type) {
            case 'timeline':
                container = document.querySelector(".hosts_timeline");
                break;
            case 'settings':
                container = document.querySelector(".hosts_settings");
                break;
            case 'reservations':
                container = document.querySelector(".hosts_reservations");
                break;
        }

        container.style.height = "calc(100% - 71px)";
    }, 500, type)
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
            users_inner_html = users_inner_html + `<div class="users_search_container">
                            <svg xmlns="http://www.w3.org/2000/svg" class="users_search_container_icon" 
                                data-name="Layer 1" viewBox="0 0 20 20" width="23" height="22">
                                <path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z" />
                                <circle cx="12" cy="6" r="6" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" class="users_search_container_phone_icon" data-name="Layer 1" viewBox="0 0 24 24"
                                width="18" height="18">
                                <path
                                    d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm5.665,16.587l-.522,.6c-.551,.552-1.277,.813-2,.813-3.714,0-9.143-5.143-9.143-9.143,0-.723,.261-1.449,.813-2l.6-.522c.446-.446,1.17-.446,1.616,0l1,1.302c.446,.446,.446,1.17,0,1.616l-.851,1.069c.901,2.244,2.429,3.71,4.5,4.5l1.069-.851c.446-.446,1.17-.446,1.616,0l1.302,1c.446,.446,.446,1.17,0,1.616Z" />
                            </svg>

                            <p class="users_search_container_username">${item.username}</p>
                            <p class="users_search_container_phone">${hide_phone(item.phone)}</p>
                        </div>`;
        });

        const users_list_container = document.querySelector(".hosts_reservations_users_search_result");

        users_list_container.innerHTML = users_inner_html;
    });
}

function search_input_handler(container) {
    if (container.value.length >= 2) {
        find_users(container.value);
    } else {
        get_users();
    }
}

function get_hosts() {
    Controller.get_hosts().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const hosts = data.data.result;

        timeline_primary_hosts_html = ``;
        timeline_secondary_hosts_html = `<div class="hosts_timeline_item">`;
        hosts_settings_list_html = ``;
        reservations_list_html = ``;

        for (let i = 0; i < 25; i++) {
            let inner_time;
            if (i < 10) {
                inner_time = "0" + i;
            } else {
                inner_time = i;
            }

            timeline_secondary_hosts_html = timeline_secondary_hosts_html + `<div class="hosts_timeline_item_separator"><p class="hosts_timeline_item_separator_text">${inner_time}</p></div>`;
        }

        timeline_secondary_hosts_html = timeline_secondary_hosts_html + "</div>";

        hosts.forEach((item, index) => {
            timeline_primary_hosts_html = timeline_primary_hosts_html + `<div class="hosts_timeline_primary_item">
                <svg xmlns="http://www.w3.org/2000/svg" class="hosts_timeline_primary_item_icon ${item.status == "playing" ? "primary_item_playing" : ""}" 
                    viewBox="0 0 24 24" width="18" height="18">
                    <path d="M5,19h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V19h6a5.009,5.009,0,0,0,4.9-4H.1A5.009,5.009,0,0,0,5,19Z" />
                    <path d="M19,1H5A5.006,5.006,0,0,0,0,6v7H24V6A5.006,5.006,0,0,0,19,1Z" />
                </svg>
                <p class="hosts_timeline_primary_item_name">${item.name}</p>
                <p class="hosts_timeline_primary_item_username">${item.player.username}</p>
            </div>`;
            
            timeline_secondary_hosts_html = timeline_secondary_hosts_html + `<div class="hosts_timeline_item">`;

            for (let i = 0; i < 25; i++) {
                timeline_secondary_hosts_html = timeline_secondary_hosts_html + `<div class="hosts_timeline_item_separator"></div>`;
            }

            timeline_secondary_hosts_html = timeline_secondary_hosts_html + `</div>`;

            hosts_settings_list_html = hosts_settings_list_html + `<div class="hosts_settings_item_container">
                <svg xmlns="http://www.w3.org/2000/svg" class="hosts_settings_item_delete_button" data-name="Layer 1"
                    viewBox="0 0 24 24" width="22" height="22">
                    <path
                        d="M17,4V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2V4ZM11,17H9V11h2Zm4,0H13V11h2ZM15,4H9V2h6Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="hosts_settings_item_icon"
                 viewBox="0 0 24 24" width="22" height="22">
                    <path d="M5,19h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V19h6a5.009,5.009,0,0,0,4.9-4H.1A5.009,5.009,0,0,0,5,19Z" />
                    <path d="M19,1H5A5.006,5.006,0,0,0,0,6v7H24V6A5.006,5.006,0,0,0,19,1Z" />
                </svg>
                <h3 class="hosts_settings_item_name">${item.name}</h3>
                <p class="hosts_settings_item_identifier">${item.identifier}</p>
            </div>`;

            reservations_list_html = reservations_list_html + `<div class="hosts_reservations_item_container" onclick="select_reservation_host(this, ${item.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="hosts_reservations_item_icon" viewBox="0 0 24 24" width="26" height="26">
                            <path
                                d="M5,19h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V19h6a5.009,5.009,0,0,0,4.9-4H.1A5.009,5.009,0,0,0,5,19Z" />
                            <path d="M19,1H5A5.006,5.006,0,0,0,0,6v7H24V6A5.006,5.006,0,0,0,19,1Z" />
                        </svg>
                    
                        <h3 class="hosts_reservations_item_name">${item.name}</h3>
                    </div>`;
        });

        const timeline_primary_container = document.querySelector(".hosts_timeline_hosts_primary");
        const timeline_secondary_container = document.querySelector(".hosts_timeline_hosts_lines");
        const hosts_settings_container = document.querySelector(".hosts_settings_items_list");
        const reservations_container = document.querySelector(".hosts_reservations_hosts_selector");

        timeline_primary_container.innerHTML = timeline_primary_hosts_html;
        timeline_secondary_container.innerHTML = timeline_secondary_hosts_html;
        hosts_settings_container.innerHTML = hosts_settings_list_html;
        reservations_container.innerHTML = reservations_list_html;
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
            users_inner_html = users_inner_html + `<div class="users_search_container" onclick="select_reservation_user(this, ${item.user_id})">
                            <svg xmlns="http://www.w3.org/2000/svg" class="users_search_container_icon" 
                                data-name="Layer 1" viewBox="0 0 20 20" width="23" height="22">
                                <path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z" />
                                <circle cx="12" cy="6" r="6" />
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" class="users_search_container_phone_icon" data-name="Layer 1" viewBox="0 0 24 24"
                                width="18" height="18">
                                <path
                                    d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm5.665,16.587l-.522,.6c-.551,.552-1.277,.813-2,.813-3.714,0-9.143-5.143-9.143-9.143,0-.723,.261-1.449,.813-2l.6-.522c.446-.446,1.17-.446,1.616,0l1,1.302c.446,.446,.446,1.17,0,1.616l-.851,1.069c.901,2.244,2.429,3.71,4.5,4.5l1.069-.851c.446-.446,1.17-.446,1.616,0l1.302,1c.446,.446,.446,1.17,0,1.616Z" />
                            </svg>

                            <p class="users_search_container_username">${item.username}</p>
                            <p class="users_search_container_phone">${hide_phone(item.phone)}</p>
                        </div>`;
        });

        const users_list_container = document.querySelector(".hosts_reservations_users_search_result");

        users_list_container.innerHTML = users_inner_html;
    });
}

function select_reservation_user(container, user_id){
    const users_containers = document.querySelectorAll(".users_search_container");

    users_containers.forEach(item => item.classList.remove("users_search_container_active"));
    
    container.classList.add("users_search_container_active");

    reservation_selected_user_id = user_id;
}

function select_reservation_host(container, host_id){
    const users_containers = document.querySelectorAll(".hosts_reservations_item_container");

    users_containers.forEach(item => item.classList.remove("hosts_reservations_item_active"));

    container.classList.add("hosts_reservations_item_active");

    reservation_selected_host_id = host_id;
}

function get_reservations() {
    Controller.get_nearest_reservations().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const reservations = data.data.result;

        reservations_inner_html = ``;

        reservations.forEach((item, index) => {
            let date_from = item.date_from;
            let date_to = item.date_to;

            let time_begin = date_from.split("T");
            time_begin = time_begin[1].split(":");
            //here something like ["20", "00", "00"]
            // where              hour   min   secs
 
            time_begin = `${time_begin[0]}:${time_begin[1]}`;

            let duration = getMinuteDifference(date_from, date_to);

            reservations_inner_html = reservations_inner_html + `<div class="reservations_list_item">
                        <svg xmlns="http://www.w3.org/2000/svg" class="reservations_list_item_icon" 
                            data-name="Layer 1" viewBox="0 0 24 24" width="30"
                            height="30">
                            <path
                                d="m7.456,22h16.515l-3.075-17.424c-.263-1.493-1.554-2.576-3.07-2.576H6.148c-1.516,0-2.807,1.083-3.07,2.576L.003,22h5.198l-.333-2-1.148-7.553,1.025-5.808,2.711,15.361Zm11.57-5h-8.391l-.353-2h8.391l.353,2Zm-1.059-6l.353,2h-8.391l-.353-2h8.391Zm-.706-4l.353,2h-8.391l-.353-2h8.391Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="reservations_list_delete_button" 
                            data-name="Layer 1"
                            viewBox="0 0 24 24" width="30" height="30">
                            <path
                                d="M17,4V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2V4ZM11,17H9V11h2Zm4,0H13V11h2ZM15,4H9V2h6Z" />
                        </svg>
                        <p class="reservations_list_item_pc_name">${item.host.name}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="reservations_list_item_user_icon" data-name="Layer 1" viewBox="0 0 20 20"
                            width="23" height="22">
                            <path d="M16.043,14H7.957A4.963,4.963,0,0,0,3,18.957V24H21V18.957A4.963,4.963,0,0,0,16.043,14Z" />
                            <circle cx="12" cy="6" r="6" />
                        </svg>
                        <p class="reservations_list_item_username">${item.player.username}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="reservations_list_item_time_begin_icon"
                        data-name="Layer 1" viewBox="0 0 24 24" width="23" height="22">
                            <path
                                d="m24,4v14c0,2.209-1.791,4-4,4h-2.015s0,0-.001-.002c.836-2.512,2.016-6.892,2.013-11.634l.003-1.846c.264.133.54.24.823.319.589.165,1.177-.265,1.177-.876h0c0-.478-.286-.931-.741-1.076-.326-.104-.627-.276-.888-.5-.299-.256-.668-.384-1.037-.384s-.738.128-1.037.384c-.451.386-1.016.616-1.63.616s-1.179-.23-1.63-.616c-.299-.256-.668-.384-1.037-.384s-.738.128-1.037.384c-.451.386-1.016.616-1.63.616s-1.179-.23-1.63-.616c-.299-.256-.668-.384-1.037-.384s-.738.128-1.037.384l-.014.012c-.637.539-1.616.068-1.616-.767v-1.629C6,1.794,7.794,0,10,0h10c2.209,0,4,1.791,4,4Zm-6.001,6.458c0,4.144-.978,8.03-1.798,10.567-.575,1.779-2.223,2.975-4.1,2.975H3.322c-1.121,0-2.208-.582-2.837-1.52-.581-.864-.695-1.895-.314-2.825.823-2.012,2.356-5.757,2.406-9.17.004-.289.133-.561.353-.748.484-.402,1.22-.73,1.813-.739.621-.01,1.244.196,1.75.616.608.504,1.48.504,2.087,0,.99-.821,2.428-.821,3.418,0,.607.504,1.479.504,2.087,0,.511-.424,1.141-.629,1.767-.615.588.013,1.257.284,1.737.682.246.18.396.461.409.766v.012Zm-7.521,2.663c-.37-.201-.83-.149-1.146.135l-1.5,1.346c-.411.368-.445,1.001-.076,1.412.238.266.585.374.916.317-.17,1.227-.383,2.568-.645,3.353-.175.524.108,1.091.632,1.265.105.035.212.052.316.052.419,0,.809-.265.949-.684.399-1.198,1.004-5.781,1.064-6.16.066-.418-.138-.833-.51-1.035Z" />
                        </svg>
                        <p class="reservations_list_item_time_begin">${time_begin}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" class="reservations_list_item_duration_icon" data-name="Layer 1" viewBox="0 0 24 24"
                            width="24" height="24">
                            <path d="M12,24C5.383,24,0,18.617,0,12S5.383,0,12,0s12,5.383,12,12-5.383,12-12,12Zm5-13h-4V5h-2V13h6v-2Z" />
                        </svg>
                        <p class="reservations_list_item_duration">${duration}м</p>
                    </div>`;
        });

        const reservations_list_container = document.querySelector(".reservations_list");

        reservations_list_container.innerHTML = reservations_inner_html;
    });
}

function create_host(){
    const name_elem = document.querySelector(".hosts_settings_creation_form_name");
    const identifier_elem = document.querySelector(".hosts_settings_creation_form_identifier");

    Controller.create_host(name_elem.value, identifier_elem.value).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        } else {
            get_hosts();
        }
    });
}

function create_reservation(){
    if (reservation_selected_user_id == 0 || reservation_selected_host_id == 0){
        alert("Пользователь или хост не выбран!");
        return;
    }

    const date_begin_elem = document.querySelector(".date_selector_begin_date_input");
    const time_begin_elem = document.querySelector(".date_selector_begin_time_input");
    const date_end_elem = document.querySelector(".date_selector_end_date_input");
    const time_end_elem = document.querySelector(".date_selector_end_time_input");

    Controller.create_reservation(reservation_selected_user_id, reservation_selected_host_id, `${date_begin_elem.value}T${time_begin_elem.value}:00`, `${date_end_elem.value}T${time_end_elem.value}:00`).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        } else {
            get_reservations();
        }
    });
}

window.onload = () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    build_left_menu("hosts");

    get_hosts();
    get_reservations();
    get_users();
}
