var staff_global = [];
var staffgroups_global = [];

var selected_staffgroup = 0;
var selected_staff = 0;

function open_staff_tab(){
    const staff_button = document.querySelector(".workspace_controls_staff");
    const staffgroups_button = document.querySelector(".workspace_controls_staffgroups");

    const staff_tab = document.querySelector(".workspace_staff_tab");
    const staffgroups_tab = document.querySelector(".workspace_staffgroups_tab");

    staff_button.classList.add("tab_active");
    staffgroups_button.classList.remove("tab_active");

    staff_tab.style.display = "block";
    staffgroups_tab.style.display = "none";
}

function open_staffgroup_tab(){
    const staff_button = document.querySelector(".workspace_controls_staff");
    const staffgroups_button = document.querySelector(".workspace_controls_staffgroups");

    const staff_tab = document.querySelector(".workspace_staff_tab");
    const staffgroups_tab = document.querySelector(".workspace_staffgroups_tab");

    staff_button.classList.remove("tab_active");
    staffgroups_button.classList.add("tab_active");

    staff_tab.style.display = "none";
    staffgroups_tab.style.display = "block";
}

function get_staff(){
    Controller.get_staff().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const staff = data.data.result;

        staff_inner_html = `<div class="workspace_staffgroup_button" onclick="open_staff_creation_menu()"><p class="workspace_staffgroup_text">Создать +</p></div>`;

        staff.forEach((item, index) => {
            staff_inner_html = staff_inner_html + `<div class="workspace_staffgroup_button" onclick="open_staff_viewer(${index})"><p class="workspace_staffgroup_text">${item.name}</p></div>`;
        });

        const staff_list_container = document.querySelector(".workspace_staff_list");

        staff_list_container.innerHTML = staff_inner_html;

        staff_global = staff;
    });
}

function get_staffgroups() {
    Controller.get_staffgroups().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const staffgroups = data.data.result;

        staffgroups_inner_html = `<div class="workspace_staffgroup_button"><p class="workspace_staffgroup_text" onclick="open_staffgroup_creation_menu()">Создать +</p></div>`;
        staffgroup_selector_html = ``;

        staffgroups.forEach((item, index) => {
            staffgroups_inner_html = staffgroups_inner_html + `<div class="workspace_staffgroup_button" onclick="open_staffgroup_viewer(${index})"><p class="workspace_staffgroup_text" show_>${item.name}</p></div>`;
            staffgroup_selector_html = staffgroup_selector_html + `<option value="${item.id}">${item.name}</option>`;
        });

        const staffgroups_list_container = document.querySelector(".workspace_staffgroups_list");
        const staff_creation_staffgroup_selector = document.querySelector(".workspace_staff_creation_staffgroup_selector");
        const staff_edit_staffgroup_selector = document.querySelector(".workspace_staff_edit_staffgroup_selector");

        staffgroups_list_container.innerHTML = staffgroups_inner_html;
        staff_creation_staffgroup_selector.innerHTML = staffgroup_selector_html;
        staff_edit_staffgroup_selector.innerHTML = staffgroup_selector_html;

        staffgroups_global = staffgroups;
    });
}

function create_staff() {
    const name_elem = document.querySelector('.workspace_staff_creation_name_input');
    const second_name_elem = document.querySelector('.workspace_staff_creation_second_name_input');
    const staffgroup_elem = document.querySelector('.workspace_staff_creation_staffgroup_selector');
    const username_elem = document.querySelector('.workspace_staff_creation_login_input');
    const password_elem = document.querySelector('.workspace_staff_creation_password_input');

    Controller.create_staff(username_elem.value, password_elem.value, staffgroup_elem.value, name_elem.value, second_name_elem.value).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        } else {
            get_staff();
        }
    });
}

function update_staff() {
    const selector = document.querySelector(".workspace_staff_edit_staffgroup_selector");

    Controller.update_staff_staffgroup(staff_global[selected_staff].id, selector.value).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        get_staff();
    });
}

function create_staffgroup(){
    const name_elem = document.querySelector('.workspace_staffgroups_creation_name_input');

    const web_access_input = document.querySelector(".web_platform_access_input");
    const mobile_access_input = document.querySelector(".mobile_platform_access_input");
    const access_users_get_input = document.querySelector(".users_get_flag_access_input");
    const access_users_edit_input = document.querySelector(".users_edit_flag_access_input");
    const access_payments_input = document.querySelector(".payments_flag_access_input");
    const access_config_input = document.querySelector(".config_flag_access_input");
    const access_staff_input = document.querySelector(".staff_flag_access_input");
    const access_staffgroups_input = document.querySelector(".staffgroups_flag_access_input");
    const access_hosts_controls_input = document.querySelector(".hosts_controls_flag_access_input");
    const access_hosts_edit_input = document.querySelector(".hosts_edit_flag_access_input");
    const access_market_main_input = document.querySelector(".market_main_flag_access_input");
    const access_market_edit_input = document.querySelector(".market_edit_flag_access_input");
    const access_apps_input = document.querySelector(".apps_flag_access_input");
    const tabs_hosts_input = document.querySelector(".hosts_tabs_access_input");
    const tabs_sales_input = document.querySelector(".sales_tabs_access_input");
    const tabs_market_input = document.querySelector(".market_tabs_access_input");
    const tabs_staff_input = document.querySelector(".staff_tabs_access_input");
    const tabs_apps_input = document.querySelector(".apps_tabs_access_input");
    const tabs_config_input = document.querySelector(".config_tabs_access_input");
    const tabs_users_input = document.querySelector(".users_tabs_access_input");

    const rights = {
        access_flags:{
            users_get: access_users_get_input.checked,
            users_edit: access_users_edit_input.checked,
            payments: access_payments_input.checked,
            config: access_config_input.checked,
            staff: access_staff_input.checked,
            staffgroups: access_staffgroups_input.checked,
            hosts_controls: access_hosts_controls_input.checked,
            hosts_edit: access_hosts_edit_input.checked,
            market_main: access_market_main_input.checked,
            market_edit: access_market_edit_input.checked,
            apps: access_apps_input.checked
        },
        web:{
            access: web_access_input.checked,
            tabs_flags:{
                hosts: tabs_hosts_input.checked,
                sales: tabs_sales_input.checked,
                market: tabs_market_input.checked,
                staff: tabs_staff_input.checked,
                apps: tabs_apps_input.checked,
                config: tabs_config_input.checked,
                users: tabs_users_input.checked
            }
        },
        mobile:{
            access: mobile_access_input.checked,
        }
    }

    Controller.create_staffgroup(name_elem.value, rights).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        } else {
            get_staffgroups();
        }
    });
}

function update_staffgroup() {
    const web_access_input = document.querySelector(".edit_web_platform_access_input");
    const mobile_access_input = document.querySelector(".edit_mobile_platform_access_input");
    const access_users_get_input = document.querySelector(".edit_users_get_flag_access_input");
    const access_users_edit_input = document.querySelector(".edit_users_edit_flag_access_input");
    const access_payments_input = document.querySelector(".edit_payments_flag_access_input");
    const access_config_input = document.querySelector(".edit_config_flag_access_input");
    const access_staff_input = document.querySelector(".edit_staff_flag_access_input");
    const access_staffgroups_input = document.querySelector(".edit_staffgroups_flag_access_input");
    const access_hosts_controls_input = document.querySelector(".edit_hosts_controls_flag_access_input");
    const access_hosts_edit_input = document.querySelector(".edit_hosts_edit_flag_access_input");
    const access_market_main_input = document.querySelector(".edit_market_main_flag_access_input");
    const access_market_edit_input = document.querySelector(".edit_market_edit_flag_access_input");
    const access_apps_input = document.querySelector(".edit_apps_flag_access_input");
    const tabs_hosts_input = document.querySelector(".edit_hosts_tabs_access_input");
    const tabs_sales_input = document.querySelector(".edit_sales_tabs_access_input");
    const tabs_market_input = document.querySelector(".edit_market_tabs_access_input");
    const tabs_staff_input = document.querySelector(".edit_staff_tabs_access_input");
    const tabs_apps_input = document.querySelector(".edit_apps_tabs_access_input");
    const tabs_config_input = document.querySelector(".edit_config_tabs_access_input");
    const tabs_users_input = document.querySelector(".edit_users_tabs_access_input");

    const rights = {
        access_flags: {
            users_get: access_users_get_input.checked,
            users_edit: access_users_edit_input.checked,
            payments: access_payments_input.checked,
            config: access_config_input.checked,
            staff: access_staff_input.checked,
            staffgroups: access_staffgroups_input.checked,
            hosts_controls: access_hosts_controls_input.checked,
            hosts_edit: access_hosts_edit_input.checked,
            market_main: access_market_main_input.checked,
            market_edit: access_market_edit_input.checked,
            apps: access_apps_input.checked
        },
        web: {
            access: web_access_input.checked,
            tabs_flags: {
                hosts: tabs_hosts_input.checked,
                sales: tabs_sales_input.checked,
                market: tabs_market_input.checked,
                staff: tabs_staff_input.checked,
                apps: tabs_apps_input.checked,
                config: tabs_config_input.checked,
                users: tabs_users_input.checked
            }
        },
        mobile: {
            access: mobile_access_input.checked,
        }
    }

    Controller.update_staffgroup(staffgroups_global[selected_staffgroup].id, rights).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        get_staffgroups();
    });
}

function open_staffgroup_creation_menu(){
    const creation_container = document.querySelector(".workspace_staffgroups_creation");
    const edit_container = document.querySelector(".workspace_staffgroups_edit");

    creation_container.style.display = "block";
    edit_container.style.display = "none";
}

function open_staffgroup_viewer(staffgroup_index){
    const creation_container = document.querySelector(".workspace_staffgroups_creation");
    const edit_container = document.querySelector(".workspace_staffgroups_edit");

    creation_container.style.display = "none";
    edit_container.style.display = "block";

    const staffgroup_data = staffgroups_global[staffgroup_index];

    const staffgroup_header_container = document.querySelector(".workspace_staffgroups_edit_header");

    staffgroup_header_container.innerText = staffgroup_data.name;
    
    const web_access_input = document.querySelector(".edit_web_platform_access_input");
    const mobile_access_input = document.querySelector(".edit_mobile_platform_access_input");
    const access_users_get_input = document.querySelector(".edit_users_get_flag_access_input");
    const access_users_edit_input = document.querySelector(".edit_users_edit_flag_access_input");
    const access_payments_input = document.querySelector(".edit_payments_flag_access_input");
    const access_config_input = document.querySelector(".edit_config_flag_access_input");
    const access_staff_input = document.querySelector(".edit_staff_flag_access_input");
    const access_staffgroups_input = document.querySelector(".edit_staffgroups_flag_access_input");
    const access_hosts_controls_input = document.querySelector(".edit_hosts_controls_flag_access_input");
    const access_hosts_edit_input = document.querySelector(".edit_hosts_edit_flag_access_input");
    const access_market_main_input = document.querySelector(".edit_market_main_flag_access_input");
    const access_market_edit_input = document.querySelector(".edit_market_edit_flag_access_input");
    const access_apps_input = document.querySelector(".edit_apps_flag_access_input");
    const tabs_hosts_input = document.querySelector(".edit_hosts_tabs_access_input");
    const tabs_sales_input = document.querySelector(".edit_sales_tabs_access_input");
    const tabs_market_input = document.querySelector(".edit_market_tabs_access_input");
    const tabs_staff_input = document.querySelector(".edit_staff_tabs_access_input");
    const tabs_apps_input = document.querySelector(".edit_apps_tabs_access_input");
    const tabs_config_input = document.querySelector(".edit_config_tabs_access_input");
    const tabs_users_input = document.querySelector(".edit_users_tabs_access_input");

    web_access_input.checked = staffgroup_data.sheme.web.access;
    mobile_access_input.checked = staffgroup_data.sheme.mobile.access;

    access_users_get_input.checked = staffgroup_data.sheme.access_flags.users_get;
    access_users_edit_input.checked = staffgroup_data.sheme.access_flags.users_edit;
    access_payments_input.checked = staffgroup_data.sheme.access_flags.payments;
    access_config_input.checked = staffgroup_data.sheme.access_flags.config;
    access_staff_input.checked = staffgroup_data.sheme.access_flags.staff;
    access_staffgroups_input.checked = staffgroup_data.sheme.access_flags.staffgroups;
    access_hosts_controls_input.checked = staffgroup_data.sheme.access_flags.hosts_controls;
    access_hosts_edit_input.checked = staffgroup_data.sheme.access_flags.hosts_edit;
    access_market_main_input.checked = staffgroup_data.sheme.access_flags.market_main;
    access_market_edit_input.checked = staffgroup_data.sheme.access_flags.market_edit;
    access_apps_input.checked = staffgroup_data.sheme.access_flags.apps;

    tabs_hosts_input.checked = staffgroup_data.sheme.web.tabs_flags.hosts;
    tabs_sales_input.checked = staffgroup_data.sheme.web.tabs_flags.sales;
    tabs_market_input.checked = staffgroup_data.sheme.web.tabs_flags.market;
    tabs_staff_input.checked = staffgroup_data.sheme.web.tabs_flags.staff;
    tabs_apps_input.checked = staffgroup_data.sheme.web.tabs_flags.apps;
    tabs_config_input.checked = staffgroup_data.sheme.web.tabs_flags.config;
    tabs_users_input.checked = staffgroup_data.sheme.web.tabs_flags.users;

    selected_staffgroup = staffgroup_index;
}

function open_staff_creation_menu() {
    const creation_container = document.querySelector(".workspace_staff_creation");
    const edit_container = document.querySelector(".workspace_staff_editor");

    creation_container.style.display = "block";
    edit_container.style.display = "none";
}

function open_staff_viewer(staff_index) {
    const creation_container = document.querySelector(".workspace_staff_creation");
    const edit_container = document.querySelector(".workspace_staff_editor");

    creation_container.style.display = "none";
    edit_container.style.display = "block";

    const staff_data = staff_global[staff_index];

    const workspace_staff_edit_header = document.querySelector(".workspace_staff_edit_header");

    staffgroup_selector_html = ``;

    staffgroups_global.forEach((item, index) => {
        if (staff_global[staff_index].staffgroup.id == item.id){
            staffgroup_selector_html = staffgroup_selector_html + `<option selected value="${item.id}">${item.name}</option>`;
        }else{
            staffgroup_selector_html = staffgroup_selector_html + `<option value="${item.id}">${item.name}</option>`;
        }
    });

    const staff_edit_staffgroup_selector = document.querySelector(".workspace_staff_edit_staffgroup_selector");

    staff_edit_staffgroup_selector.innerHTML = staffgroup_selector_html;

    workspace_staff_edit_header.innerText = staff_data.name;
    selected_staff = staff_index;
}

window.onload = () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    build_left_menu("staff");

    get_staffgroups();
    get_staff();
}

