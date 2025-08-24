function get_config(){
    Controller.get_config().then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        const config = data.data.result;

        const service_token_container = document.querySelector(".service_token_param");
        const terminal_feauters_container = document.querySelector(".terminal_feauters_param");
        const tv_feauters_container = document.querySelector(".tv_feauters_param");

        const app_feauters_container = document.querySelector(".app_feauters_param");
        const app_adress_container = document.querySelector(".app_adress_param");

        const telegram_status_container = document.querySelector(".telegram_status_param");
        const telegram_message_prefix_container = document.querySelector(".telegram_message_prefix_param");
        const notify_open_shift_container = document.querySelector(".notify_open_shift_param");
        const notify_close_shift_container = document.querySelector(".notify_close_shift_param");
        const daily_report_container = document.querySelector(".daily_report_param");
        const weekly_report_container = document.querySelector(".weekly_report_param");
        const monthly_report_container = document.querySelector(".monthly_report_param");

        service_token_container.value = config.SERVICE_TOKEN;
        terminal_feauters_container.innerHTML = config.TERMINAL_FEAUTERS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        tv_feauters_container.innerHTML = config.TV_FEAUTERS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
    
        app_feauters_container.innerHTML = config.CLIENT_APP_FEAUTERS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        app_adress_container.value = config.CLIENT_APP_ADDRESS;

        telegram_status_container.innerHTML = config.TELEGRAM_NOTIFICATIONS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        telegram_message_prefix_container.value = config.WORKSPACE_MESSAGE_PREFIX;
        notify_open_shift_container.innerHTML = config.SHIFT_OPEN_REPORTS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        notify_close_shift_container.innerHTML = config.SHIFT_CLOSE_REPORTS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        daily_report_container.innerHTML = config.DAILY_REPORTS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        weekly_report_container.innerHTML = config.WEEKLY_REPORTS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
        monthly_report_container.innerHTML = config.MONTHLY_REPORTS == "enabled" ? `<option value="disabled">Отключено</option><option selected value="enabled">Включено</option>` : `<option selected value="disabled">Отключено</option><option value="enabled">Включено</option>`;
    });
}

function update_param(param){
    let value_container;

    switch(param){
        case 'TELEGRAM_NOTIFICATIONS':
            value_container = document.querySelector(".telegram_status_param");
        break;
        case 'WORKSPACE_MESSAGE_PREFIX':
            value_container = document.querySelector(".telegram_message_prefix_param");
        break;
        case 'CLIENT_APP_FEAUTERS':
            value_container = document.querySelector(".app_feauters_param");
        break;
        case 'CLIENT_APP_ADDRESS':
            value_container = document.querySelector(".app_adress_param");
        break;
        case 'TERMINAL_FEAUTERS':
            value_container = document.querySelector(".terminal_feauters_param");
        break;
        case 'TV_FEAUTERS':
            value_container = document.querySelector(".tv_feauters_param");
        break;
        case 'SERVICE_TOKEN':
            value_container = document.querySelector(".service_token_param");
        break;
        case 'SHIFT_OPEN_REPORTS':
            value_container = document.querySelector(".notify_open_shift_param");
        break;
        case 'SHIFT_CLOSE_REPORTS':
            value_container = document.querySelector(".notify_close_shift_param");
        break;
        case 'DAILY_REPORTS':
            value_container = document.querySelector(".daily_report_param");
        break;
        case 'WEEKLY_REPORTS':
            value_container = document.querySelector(".weekly_report_param");
        break;
        case 'MONTHLY_REPORTS':
            value_container = document.querySelector(".monthly_report_param");
        break;
    }

    Controller.update_config_param(param, value_container.value).then(data => {
        if (data.is_error) {
            alert(data.message);
            return;
        }

        alert("Параметр обновлён!");
    });
}

function show_settings_tab(tab, button_container){
    const header_tab_icon_elems = document.querySelectorAll('.header_tab_icon');
    const header_tab_title_elems = document.querySelectorAll('.header_tab_title');
    const header_tab_show_more_button_elems = document.querySelectorAll('.header_tab_show_more_button');

    // remove active styles for all buttons
    header_tab_icon_elems.forEach(item => item.classList.remove('header_tab_active'));
    header_tab_title_elems.forEach(item => item.classList.remove('header_tab_active'));
    header_tab_show_more_button_elems.forEach(item => item.classList.remove('header_tab_active'));

    //get header of active tab
    const active_tab_header = button_container.parentNode;

    const header_tab_icon = active_tab_header.querySelector('.header_tab_icon');
    const header_tab_title = active_tab_header.querySelector('.header_tab_title');
    const header_tab_show_more_button = active_tab_header.querySelector('.header_tab_show_more_button');

    // add active styles to header
    header_tab_icon.classList.add('header_tab_active');
    header_tab_title.classList.add('header_tab_active');
    header_tab_show_more_button.classList.add('header_tab_active');

    const settings_content_tabs = document.querySelectorAll('.tab_content');
    
    // hide all settings tabs
    settings_content_tabs.forEach(item => item.style.height = "0px");

    switch(tab){
        case "general":
            container = document.querySelector('.general_tab_content'); 

            container.style.height = "237px";
        break;
        case "payments":
            container = document.querySelector('.payments_tab_content');

            container.style.height = "160px";
        break;
        case "app":
            container = document.querySelector('.app_tab_content');

            container.style.height = "164px";
        break;
        case "telegram":
            container = document.querySelector('.telegram_tab_content');

            container.style.height = "878px";
        break;
    }
}

window.onload = () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    get_config();

    build_left_menu("config");
}
