var global_market_groups = [];
var global_market_products = [];
var global_invoices_list = [];
var global_combo_list = [];

var invoice_added_products = [];
var selected_invoice_id = 0;

var currency_list = [];
var coast_sheme = [];
var combo_coast_sheme = [];
var selected_product_id = 0;

var combo_creation_positions = [];
var combo_working_position = 0;

function show_combo_creation(){
    const combo_creation_form = document.querySelector(".combo_creation_form");
    const combo_creation_products_search = document.querySelector(".combo_creation_products_search");
    const combo_viewer = document.querySelector(".combo_viewer");

    combo_creation_form.style.display="block";
    combo_creation_products_search.style.display="block";
    combo_viewer.style.display="none";
}

function show_combo_viewer(combo_index) {
    const combo_creation_form = document.querySelector(".combo_creation_form");
    const combo_creation_products_search = document.querySelector(".combo_creation_products_search");
    const combo_viewer = document.querySelector(".combo_viewer");

    combo_creation_form.style.display = "none";
    combo_creation_products_search.style.display = "none";
    combo_viewer.style.display = "block";

    selected_combo = global_combo_list[combo_index];

    let controls_html = ``;
    let positions_html = ``;

    selected_combo.coast_sheme.forEach((item) => {
        controls_html = controls_html + `<div class="product_container_cast_sheme_item">
                                <p class="products_creation_cast_sheme_item_value">${item.value} ${get_currency_by_id(item.currency_id).symbol}</p>
                            </div>`;
    });

    selected_combo.products.forEach((item) => {
        positions_html = positions_html + `<div class="combo_creation_position">`;

        item.forEach((subitem) => {
            let data = get_market_product_by_id(subitem.product_id);
            positions_html = positions_html + `<p class="combo_creation_position_text">${data.name} х${subitem.product_count}</p>`;
        });

        positions_html = positions_html + `</div>`;
    });

    const controls_container = document.querySelector(".combo_viewer_controls");
    const positions_container = document.querySelector(".combo_viewer_positions");

    controls_container.innerHTML = controls_html;
    positions_container.innerHTML = positions_html;
}

function get_market_combo(){
    Controller.get_market_combo().then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let combo = data.data.result;

        html = `<div class="combo_primary_item" onclick="show_combo_creation()">
                        <p class="combo_primary_item_text">Создать комбо</p>
                    </div>`;

        combo.forEach((item, index) => {
            html = html + `<div class="combo_primary_item" onclick="show_combo_viewer(${index})">
                        <p class="combo_primary_item_text">${item.name}</p>
                    </div>`;
        })

        const combo_list = document.querySelector(".combo_primary");

        combo_list.innerHTML = html;

        global_combo_list = combo;
    });
}

function create_combo(){
    const name_elem = document.querySelector(".combo_creation_form_name");
    
    Controller.create_market_combo(name_elem.value, combo_coast_sheme, combo_creation_positions).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Комбо успешно создано!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });

            combo_coast_sheme = [];
            combo_creation_positions = [];
            combo_working_position = 0;

            render_combo_creation_positions();
            get_market_combo();
        }
    });
}

function add_combo_position(){
    if (combo_creation_positions[combo_working_position].length == 0){
        new Toast({
            title: 'Внимание',
            text: "Текущая позиция пуста!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    combo_working_position += 1;
}

function add_combo_subposition(item, product_id){
    const container = item.parentNode;
    const count_input = container.querySelector(".combo_creation_products_search_result_item_value");
    const product_name = container.querySelector(".combo_creation_products_search_result_item_name");

    if (!combo_creation_positions[combo_working_position]){
        combo_creation_positions[combo_working_position] = [];
    }

    combo_creation_positions[combo_working_position].push({
        product_id: product_id,
        product_count: count_input.value,
        name: product_name.innerText
    });

    render_combo_creation_positions();
}

function render_combo_creation_positions(){
    let html = ``;

    combo_creation_positions.forEach((item) => {
        html = html + `<div class="combo_creation_position">`;

        item.forEach((subitem) => {
            html = html + `<p class="combo_creation_position_text">${subitem.name} х${subitem.product_count}</p>`;
        });

        html = html + `</div>`;
    });

    html = html + ` <div class="combo_creation_position_add" onclick="add_combo_position()">
                            <p class="combo_creation_position_text">Добавить позицию</p>
                        </div>`;

    const container = document.querySelector(".combo_creation_positions_controls");

    container.innerHTML = html;
}

function invoice_product_search(item){
    const query = item.value;

    let invoice_products_result_html = ``;

    global_market_products.forEach((item) => {
        if(item.name.includes(query)){
            invoice_products_result_html = invoice_products_result_html + `<div class="combo_creation_products_search_result_item">
                            <p class="combo_creation_products_search_result_item_name">${item.name}</p>
                            <input type="number" class="combo_creation_products_search_result_item_value" placeholder="кол-во">
                    
                            <svg class="combo_creation_products_search_result_item_add_button" onclick="add_invoice_position(this, ${item.id})" height="26" viewBox="0 0 24 24" width="26" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                                <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm5 13h-4v4h-2v-4h-4v-2h4v-4h2v4h4z"></path>
                            </svg>
                        </div>`;
        }
    });

    const result_container = document.querySelector(".invoice_product_search_result");
    result_container.innerHTML = invoice_products_result_html;
}

function combo_product_search(item){
    const query = item.value;

    let invoice_products_result_html = ``;

    global_market_products.forEach((item) => {
        if (item.name.includes(query)) {
            invoice_products_result_html = invoice_products_result_html + `<div class="combo_creation_products_search_result_item">
                            <p class="combo_creation_products_search_result_item_name">${item.name}</p>
                            <input type="number" class="combo_creation_products_search_result_item_value" placeholder="кол-во">
                    
                            <svg class="combo_creation_products_search_result_item_add_button" onclick="add_combo_subposition(this, ${item.id})" height="26" viewBox="0 0 24 24" width="26" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                                <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm5 13h-4v4h-2v-4h-4v-2h4v-4h2v4h4z"></path>
                            </svg>
                        </div>`;
        }
    });

    const result_container = document.querySelector(".combo_creation_products_search_result");
    result_container.innerHTML = invoice_products_result_html;
}

function add_invoice_position(item, product_id){
    const container = item.parentNode;
    const count_input = container.querySelector(".combo_creation_products_search_result_item_value");
    const product_name = container.querySelector(".combo_creation_products_search_result_item_name");

    for (i = 0; i < invoice_added_products.length; i++) {
        if (invoice_added_products[i].product_id == product_id) {
            invoice_added_products[i].value = count_input.value;

            render_invoice_positions();
            return;
        }
    }

    invoice_added_products.push({
        product_id: product_id,
        value: count_input.value,
        name: product_name.innerText
    });

    render_invoice_positions();
}

function render_invoice_positions(){
    let html = ``;

    invoice_added_products.forEach((item) => {
        html = html + `<div class="invoice_constructor_products_item">
                            <p class="invoice_constructor_products_item_text">${item.name} х${item.value}</p>
                        </div>`;
    });

    const container = document.querySelector(".invoice_constructor_products_list");
    container.innerHTML = html;
}

function show_workspace(type, button) {
    const workspaces_controls_list = document.querySelectorAll(".products_workspaces_controls");
    const workspaces_list = document.querySelectorAll(".products_workspaces");

    workspaces_controls_list.forEach(item => item.classList.remove('controls_button_active'));
    workspaces_list.forEach(item => item.style.height = "0");

    button.classList.add('controls_button_active');

    setTimeout((type) => {
        let container;

        switch (type) {
            case 'products':
                container = document.querySelector(".products_space");
            break;
            case 'groups':
                container = document.querySelector(".groups_space");
            break;
            case 'combo':
                container = document.querySelector(".combo_space");
            break;
            case 'invoice':
                container = document.querySelector(".invoice_space");
            break;
            case 'history':
                container = document.querySelector(".history_space");
            break;
        }

        container.style.height = "calc(100% - 71px)";
    }, 500, type)
}

async function get_currency(){
    await Controller.get_currency().then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        currency_list = data.data.result;

        currency_selector_html = ``;

        currency_list.forEach((item) => {
            currency_selector_html = currency_selector_html + `<option value="${item.id}">${item.name}</option>`;
        })

        const currency_selector = document.querySelector(".products_creation_cast_sheme_currency_selector");
        const combo_currency_selector = document.querySelector(".combo_coast_sheme_currency_selector");

        currency_selector.innerHTML = currency_selector_html;
        combo_currency_selector.innerHTML = currency_selector_html;
    });
}

function get_currency_by_id(currency_id){
    for (let i = 0; i < currency_list.length; i++){
        if (currency_list[i].id == currency_id){
            return currency_list[i];
        }
    }

    return false;
}

function get_market_product_by_id(product_id) {
    for (let i = 0; i < global_market_products.length; i++) {
        if (global_market_products[i].id == product_id) {
            return global_market_products[i];
        }
    }

    return false;
}

function get_market_supergroups() {
    Controller.get_market_supergroups().then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let market_groups = data.data.result;

        market_supergroups_html = ``;
        market_supergroups_selector_html = ``;

        market_groups.forEach((item) => {
            market_supergroups_html = market_supergroups_html + `<div class="group_single">
                        <svg xmlns="http://www.w3.org/2000/svg" class="group_single_icon_delete_button" data-name="Layer 1"
                            viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M17,4V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2V4ZM11,17H9V11h2Zm4,0H13V11h2ZM15,4H9V2h6Z" />
                        </svg>
                    
                        <svg xmlns="http://www.w3.org/2000/svg" class="group_single_icon" onclick="show_workspace('groups', this)"
                            data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M11,13H3c-1.657,0-3,1.343-3,3v5c0,1.657,1.343,3,3,3H11V13Zm-7.5,4h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1Zm17.5-4H13v11h8c1.657,0,3-1.343,3-3v-5c0-1.657-1.343-3-3-3Zm-1.5,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1ZM15,0h-6c-1.657,0-3,1.343-3,3V11h12V3c0-1.657-1.343-3-3-3Zm-2,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1Z" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" class="group_single_dropdown_button" onclick="show_subgroups(${item.id})"
                            data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M6.41,9H17.59a1,1,0,0,1,.7,1.71l-5.58,5.58a1,1,0,0,1-1.42,0L5.71,10.71A1,1,0,0,1,6.41,9Z" />
                        </svg>

                    
                        <p class="group_single_name">${item.name}</p>
                    </div>`;

            market_supergroups_selector_html = market_supergroups_selector_html + `<option value="${item.id}">${item.name}</option>`;
        })

        const market_groups_list = document.querySelector(".group_list");
        const market_supergroups_selector = document.querySelector(".groups_creation_supergroup_id");

        market_groups_list.innerHTML = market_supergroups_html;
        market_supergroups_selector.innerHTML = market_supergroups_selector_html;
    });
}

function get_market_groups() {
    Controller.get_market_groups().then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let market_groups = data.data.result;

        market_groups_selector_html = ``;

        market_groups.forEach((item) => {
            market_groups_selector_html = market_groups_selector_html + `<option value="${item.id}">${item.name}</option>`;
        })

        const market_groups_selector = document.querySelector(".products_creation_form_group_selector");

        global_market_groups = market_groups;
        market_groups_selector.innerHTML = market_groups_selector_html;
    });
}

function create_market_group(){
    const name_elem = document.querySelector('.groups_creation_form_name');
    const supergroup_elem = document.querySelector('.groups_creation_supergroup_id');

    Controller.create_market_group(name_elem.value, supergroup_elem.value).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Группа успешно создана!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            get_market_groups();
        }
    });
}

function create_market_supergroup(){
    const name_elem = document.querySelector('.supergroup_creation_name');
    
    Controller.create_market_supergroup(name_elem.value).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Группа успешно создана!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            get_market_supergroups();
        }
    });
}

function add_currency_to_sheme(){
    const currency_selector = document.querySelector(".products_creation_cast_sheme_currency_selector");
    const currency_price = document.querySelector(".products_creation_cast_sheme_currency_value");

    if (currency_price.value == "") {
        new Toast({
            title: 'Внимание',
            text: "Цена не указана!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    for (let i = 0; i < coast_sheme.length; i++){
        if (currency_selector.value == coast_sheme[i].currency_id){
            new Toast({
                title: 'Внимание',
                text: "Валюта уже добавлена!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }
    }

    coast_sheme.push({
        currency_id: currency_selector.value,
        value: currency_price.value
    });

    render_coast_sheme();
}

function combo_add_currency_to_sheme() {
    const currency_selector = document.querySelector(".combo_coast_sheme_currency_selector");
    const currency_price = document.querySelector(".combo_coast_sheme_currency_value");

    if (currency_price.value == "") {
        new Toast({
            title: 'Внимание',
            text: "Цена не указана!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    for (let i = 0; i < combo_coast_sheme.length; i++) {
        if (currency_selector.value == combo_coast_sheme[i].currency_id) {
            new Toast({
                title: 'Внимание',
                text: "Валюта уже добавлена!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }
    }

    combo_coast_sheme.push({
        currency_id: currency_selector.value,
        value: currency_price.value
    });

    render_combo_coast_sheme();
}

function render_coast_sheme(){
    coast_sheme_html = ``;

    coast_sheme.forEach((item) => {
        coast_sheme_html = coast_sheme_html + `<div class="products_creation_cast_sheme_item">
                                <p class="products_creation_cast_sheme_item_value">${item.value} ${get_currency_by_id(item.currency_id).symbol}</p>
                            </div>`;
    });

    const added_currency_container = document.querySelector('.products_creation_cast_sheme_added_currency');
    added_currency_container.innerHTML = coast_sheme_html;
}

function render_combo_coast_sheme() {
    coast_sheme_html = ``;

    combo_coast_sheme.forEach((item) => {
        coast_sheme_html = coast_sheme_html + `<div class="products_creation_cast_sheme_item">
                                <p class="products_creation_cast_sheme_item_value">${item.value} ${get_currency_by_id(item.currency_id).symbol}</p>
                            </div>`;
    });

    const added_currency_container = document.querySelector('.combo_creation_cast_sheme_added_currency');
    added_currency_container.innerHTML = coast_sheme_html;
}

function get_market_products() {
    Controller.get_market_products().then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let products = data.data.result;

        products_html = ``;

        products.forEach((item) => {
            products_html = products_html + `<div class="product_container">
                        <svg xmlns="http://www.w3.org/2000/svg" class="product_container_delete_button" data-name="Layer 1" viewBox="0 0 24 24"
                            width="24" height="24">
                            <path
                                d="M17,4V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2V4ZM11,17H9V11h2Zm4,0H13V11h2ZM15,4H9V2h6Z" />
                        </svg>

                        <p class="product_container_name">${item.name}</p>

                        <svg xmlns="http://www.w3.org/2000/svg" onclick="show_correct_container(this, ${item.id})" class="product_container_quantity_icon" 
                        data-name="Layer 1" viewBox="0 0 24 24"
                            width="24" height="24">
                            <path
                                d="M13.088,5.084c1.065-.696,2.912-2.201,2.912-4.284V0H8V.8c0,2.083,1.847,3.588,2.912,4.284C5.548,5.908,1,12.63,1,18c0,3.309,2.691,6,6,6h10c3.309,0,6-2.691,6-6,0-5.37-4.548-12.092-9.912-12.916Z" />
                        </svg>

                        <p class="product_container_quantity">${item.quantity}</p>

                        <svg xmlns="http://www.w3.org/2000/svg" class="product_container_group_icon" data-name="Layer 1" viewBox="0 0 24 24"
                            width="24" height="24">
                            <path
                                d="M11,13H3c-1.657,0-3,1.343-3,3v5c0,1.657,1.343,3,3,3H11V13Zm-7.5,4h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1Zm17.5-4H13v11h8c1.657,0,3-1.343,3-3v-5c0-1.657-1.343-3-3-3Zm-1.5,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1ZM15,0h-6c-1.657,0-3,1.343-3,3V11h12V3c0-1.657-1.343-3-3-3Zm-2,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1Z" />
                        </svg>

                        <p class="product_container_group">${item.group.name}</p>

                        <div class="product_container_coast_sheme">`;
                            
            item.sheme.forEach((item) => {
                products_html = products_html + `<div class="product_container_cast_sheme_item">
                                <p class="products_creation_cast_sheme_item_value">${item.value} ${get_currency_by_id(item.currency_id).symbol}</p>
                            </div>`;
            });

            products_html = products_html + `</div></div>`;
        })

        const products_list = document.querySelector(".products_list");

        products_list.innerHTML = products_html;
        
        global_market_products = products;

        invoice_product_search({ value: "" });
        combo_product_search({ value: "" });
    });
}

function get_invoices() {
    Controller.get_market_ivoices("all").then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let invoices = data.data.result;

        html = `<div class="invoice_controls_item" onclick="show_invoice_creation()">
                        <p class="invoice_controls_creation_item_text">Создать накладную</p>
                    </div>`;

        invoices.forEach((item, index) => {
            let status_class = "";

            switch(item.status){
                case "accepted":
                    status_class = "invoice_icon_accepted";
                break;
                case "created":
                    status_class = "invoice_icon_await";
                break;
                case "deleted":
                    status_class = "invoice_icon_deleted";
                break;
            }
            html = html + `<div class="invoice_controls_item" onclick="show_invoice_viewer(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="invoice_controls_item_icon ${status_class}"
                            viewBox="0 0 24 24" width="32" height="32" data-name="Layer 1">
                            <path
                                d="m17,0H7C4.243,0,2,2.243,2,5v14c0,2.757,2.243,5,5,5h10c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5ZM7.5,4.5c.828,0,1.5.672,1.5,1.5s-.672,1.5-1.5,1.5-1.5-.672-1.5-1.5.672-1.5,1.5-1.5Zm0,15c-.828,0-1.5-.672-1.5-1.5s.672-1.5,1.5-1.5,1.5.672,1.5,1.5-.672,1.5-1.5,1.5Zm1.365-5.979c-.319.319-.741.479-1.165.479-.427,0-.855-.162-1.182-.487l-.681-.655c-.398-.382-.411-1.016-.028-1.414.383-.399,1.017-.41,1.414-.028l.472.454,1.866-1.815c.396-.385,1.029-.377,1.414.02.385.396.376,1.029-.02,1.414l-2.091,2.034Zm8.135,5.479h-5c-.552,0-1-.448-1-1s.448-1,1-1h5c.552,0,1,.448,1,1s-.448,1-1,1Zm0-6h-3c-.552,0-1-.448-1-1s.448-1,1-1h3c.552,0,1,.448,1,1s-.448,1-1,1Zm0-6h-5c-.552,0-1-.448-1-1s.448-1,1-1h5c.552,0,1,.448,1,1s-.448,1-1,1Z" />
                        </svg>

                        <p class="invoice_controls_item_text">Накладная от ${item.creation_date.split(" ")[0]}</p>
                    </div>`;
        })

        const elem = document.querySelector(".invoice_controls");

        elem.innerHTML = html;

        global_invoices_list = invoices;
    });
}

function create_invoice(){
    const type_element = document.querySelector(".invoice_constructor_form_type_selector");
    const price_element = document.querySelector(".invoice_constructor_form_summ");
    
    if (price_element.value < 0){
        new Toast({
            title: 'Внимание',
            text: "Цена не может быть ниже 0!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    if (invoice_added_products.length < 1) {
        new Toast({
            title: 'Внимание',
            text: "Не добавлен ни один товар.",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    Controller.create_market_ivoice(type_element.value, price_element.value, invoice_added_products).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Накладная успешно создана!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });

            invoice_added_products = [];
            render_invoice_positions();

            get_invoices();
        }
    });
}

function show_invoice_creation(){
    const cunstructor = document.querySelector(".invoice_constructor");
    const constructor_search = document.querySelector(".invoice_constructor_products_search");
    const viewer = document.querySelector(".invoice_viewer");

    cunstructor.style.display = "block";
    constructor_search.style.display = "block";
    viewer.style.display = "none";
}

function show_invoice_viewer(invoice_index){
    const cunstructor = document.querySelector(".invoice_constructor");
    const constructor_search = document.querySelector(".invoice_constructor_products_search");
    const viewer = document.querySelector(".invoice_viewer");

    cunstructor.style.display = "none";
    constructor_search.style.display = "none";
    viewer.style.display = "block";

    const selected_invoice = global_invoices_list[invoice_index];

    const invoice_viewer_title = document.querySelector(".invoice_viewer_title");
    const invoice_viewer_description = document.querySelector(".invoice_viewer_description");
    const invoice_viewer_status = document.querySelector(".invoice_viewer_status");
    const invoice_viewer_products = document.querySelector(".invoice_viewer_products");

    let status_text;

    switch(selected_invoice.status){
        case "created":
            status_text = "Ожидает подтверждения";
        break;
        case "accepted":
            status_text = "Принята";
        break;
        case "deleted":
            status_text = "Удалена";
        break;
    }

    invoice_viewer_title.innerText = `Накладная от ${selected_invoice.creation_date.split(" ")[0]}`;
    invoice_viewer_description.innerText = `${selected_invoice.type == "entrance" ? "Приход" : "Списание"} на ${selected_invoice.price}р`;
    invoice_viewer_status.innerText = status_text;

    invoice_products_html = ``;

    selected_invoice.products_list.forEach((item) => {
        invoice_products_html = invoice_products_html + `<div class="invoice_viewer_product_item">
                            <p class="invoice_viewer_product_item_text">${item.name} х${item.value}</p>
                        </div>`;
    });

    invoice_viewer_products.innerHTML = invoice_products_html;
    selected_invoice_id = selected_invoice.id;
}

function accept_invoice(){
    Controller.market_invoice_accept(selected_invoice_id).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Накладная успешно принята!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });

            get_invoices();
            get_market_products();
        }
    });
}

function delete_invoice() {
    Controller.market_invoice_delete(selected_invoice_id).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Накладная успешно удалена!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });

            get_invoices();
        }
    });
}

function create_market_product() {
    const name_elem = document.querySelector('.products_creation_form_name');
    const group_elem = document.querySelector('.products_creation_form_group_selector');

    if (name_elem.value == ""){
        new Toast({
            title: 'Внимание',
            text: "Название не указано!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    if (coast_sheme.length == 0){
        new Toast({
            title: 'Внимание',
            text: "Цены не добавлены!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    Controller.create_market_product(name_elem.value, group_elem.value, coast_sheme).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Товар успешно создан!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });

            coast_sheme = [];

            render_coast_sheme();
            get_market_products();
        }
    });
}

function show_correct_container(button, product_id){
    const products_quantity_correct_container = document.querySelector(".products_quantity_correct");
    const product_name = button.parentNode.querySelector(".product_container_name").innerText;
    const products_quantity_correct_header = document.querySelector(".products_quantity_correct_header");
    
    products_quantity_correct_header.innerText = `Остаток ${product_name} :`;

    selected_product_id = product_id;

    products_quantity_correct_container.style.display = "block";
}

function update_market_product_remains() {
    const value_elem = document.querySelector('.products_quantity_correct_value');

    if (selected_product_id == 0){
        new Toast({
            title: 'Внимание',
            text: "Товар не выбран!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    if (value_elem.value == "") {
        new Toast({
            title: 'Внимание',
            text: "Количество не указано!",
            theme: 'dark',
            autohide: true,
            interval: 10000
        });
        return;
    }

    Controller.update_market_product_remains(selected_product_id, value_elem.value).then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        } else {
            new Toast({
                title: 'Внимание',
                text: "Товар успешно обновлён!",
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            get_market_products();
        }
    });
}

function get_market_log(){
    Controller.get_market_log("all").then(data => {
        if (data.is_error) {
            new Toast({
                title: 'Внимание',
                text: data.message,
                theme: 'dark',
                autohide: true,
                interval: 10000
            });
            return;
        }

        let log = data.data.result;

        log_html = ``;

        log.forEach((item) => {
            if(item.type == "correct"){
                log_html = log_html + `<div class="history_operation_correct">
                    <svg xmlns="http://www.w3.org/2000/svg" class="history_operation_icon" 
                    data-name="Layer 1" viewBox="0 0 24 24" width="26" height="26">
                        <path
                            d="m12,7V.46c.913.346,1.753.879,2.465,1.59l3.484,3.486c.712.711,1.245,1.551,1.591,2.464h-6.54c-.552,0-1-.449-1-1Zm1.27,12.48c-.813.813-1.27,1.915-1.27,3.065v1.455h1.455c1.15,0,2.252-.457,3.065-1.27l6.807-6.807c.897-.897.897-2.353,0-3.25-.897-.897-2.353-.897-3.25,0l-6.807,6.807Zm-3.27,3.065c0-1.692.659-3.283,1.855-4.479l6.807-6.807c.389-.389.842-.688,1.331-.901-.004-.12-.009-.239-.017-.359h-6.976c-1.654,0-3-1.346-3-3V.024c-.161-.011-.322-.024-.485-.024h-4.515C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h5v-1.455Z" />
                    </svg>

                    <p class="history_operation_product">${item.product.name}</p>

                    <p class="history_operation_staff_name">${item.date}</p>

                    <p class="history_operation_old_quantity">Было: ${item.product.old_quantity}</p>
                    <p class="history_operation_new_quantity">Стало: ${item.product.new_quantity}</p>
                </div>`;
            }

            if (item.type == "sale") {
                log_html = log_html + `<div class="history_operation_correct">
                    <svg xmlns="http://www.w3.org/2000/svg" class="history_operation_icon"
                     data-name="Layer 1" viewBox="0 0 24 24"
                        width="24" height="24">
                        <path
                            d="M21,15V3a3,3,0,0,0-3-3H14V1a2,2,0,0,1-4,0V0H6A3,3,0,0,0,3,3V15H7v2H3v7h7V23a2,2,0,0,1,4,0v1h7V17H17V15Zm-7,2H10V15h4Z" />
                    </svg>

                    
                    <p class="history_operation_product">${item.sale.product.name}</p>
                    
                    <p class="history_operation_staff_name">${item.date}</p>

                    <p class="history_operation_old_quantity">Пользователь: ${item.sale.user_id}</p>
                    <p class="history_operation_new_quantity">Цена: ${item.sale.summ} ${get_currency_by_id(item.sale.currency_id).symbol}</p>
                </div>`;
            }
        })

        const log_container = document.querySelector(".history_space");

        log_container.innerHTML = log_html;
    });
}

function show_subgroups(supergroup_id){
    subgroups_html = ``;

    global_market_groups.forEach((item) => {
        if (item.supergroup_id == supergroup_id){
        subgroups_html = subgroups_html + `<div class="group_single">
                        <svg xmlns="http://www.w3.org/2000/svg" class="group_single_icon_delete_button" data-name="Layer 1"
                            viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M17,4V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2V4ZM11,17H9V11h2Zm4,0H13V11h2ZM15,4H9V2h6Z" />
                        </svg>
                    
                        <svg xmlns="http://www.w3.org/2000/svg" class="group_single_icon" onclick="show_workspace('groups', this)"
                            data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24">
                            <path
                                d="M11,13H3c-1.657,0-3,1.343-3,3v5c0,1.657,1.343,3,3,3H11V13Zm-7.5,4h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1Zm17.5-4H13v11h8c1.657,0,3-1.343,3-3v-5c0-1.657-1.343-3-3-3Zm-1.5,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1ZM15,0h-6c-1.657,0-3,1.343-3,3V11h12V3c0-1.657-1.343-3-3-3Zm-2,5h-2c-.552,0-1-.448-1-1h0c0-.552,.448-1,1-1h2c.552,0,1,.448,1,1h0c0,.552-.448,1-1,1Z" />
                        </svg>
                    
                        <p class="group_single_name">${item.name}</p>
                    </div>`;
        }
    });

    const subgroup_list = document.querySelector('.subgroup_list');
    subgroup_list.innerHTML = subgroups_html;
}

window.onload = async () => {
    if (!Controller.check_token()) {
        document.location = "index.html";
        return;
    }

    build_left_menu("market");

    await get_currency();
    get_market_supergroups();
    get_market_groups();
    get_market_products();
    get_invoices();
    get_market_combo();
    get_market_log();
}

