function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
    if (getCookie(name)) {
        document.cookie = name + "=" + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function generate_string(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

class WorkspaceController {
    constructor(){
        this.address = "http://workspace/api/";
    }

    async auth(username, password) {
        let data = {
            "username": username,
            "password": password
        }

        let url = `${this.address}auth`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return res.text().then(text => {
                    let data = JSON.parse(text);

                    if (data.result.web_access == false){
                        return { "is_error": true, "message": "Нет доступа к веб-интерфейсу!" };
                    }

                    document.cookie = "workspace_token=" + data.result.token;
                    document.cookie = "workspace_user_id=" + data.result.user_id;

                    return { "is_error": false };
                });
            }
        });

        return result;
    }

    logout(){
        deleteCookie("workspace_token");
        deleteCookie("workspace_user_id");

        return { "is_error": false };
    }

    async get_users() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}users`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async find_users(query) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}users/find/${query}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_user_data(user_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}users/${user_id}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_user_balance(user_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}users/balance/${user_id}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_user_time(user_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}users/time/${user_id}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_user(username, password, name, surname, email, phone, city, country, adress) {
        let data = {
            "username": username,
            "password": password,
            "name": name,
            "surname": surname,
            "email": email,
            "phone": phone,
            "city": city,
            "country": country,
            "adress": adress
        }

        let url = `${this.address}users/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_usergroups() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}usergroups`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_staff() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}staff`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_staffgroups() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}staffgroups`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_flags(){
        if(!this.check_token()){
            return { "is_error": true, "message": "Unauthoraized" };
        }else{
            let url = `${this.address}service/access`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_staff(username, password, staffgroup_id, name, second_name) {
        let data = {
            "username": username,
            "password": password,
            "staffgroup_id": staffgroup_id,
            "name": name,
            "second_name": second_name
        }

        let url = `${this.address}staff/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async update_staff_staffgroup(staff_id, staffgroup_id) {
        let url = `${this.address}staff/staffgroup/${staff_id}/${staffgroup_id}`;

        console.log(url);

        let result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async create_staffgroup(name, rights) {
        let data = {
            "name": name,
            "rights": rights
        }

        let url = `${this.address}staffgroups/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async update_staffgroup(id, rights) {
        let data = {
            "rights": rights
        }

        let url = `${this.address}staffgroups/update/${id}`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_hosts(){
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}hosts`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_host_data(host_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}hosts/${host_id}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_host(name, identifier) {
        let data = {
            "name": name,
            "identifier": identifier
        }

        let url = `${this.address}hosts/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_reservations() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}reservations`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_nearest_reservations() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}reservations/nearest`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_reservation(user_id, host_id, date_from, date_to) {
        let data = {
            "user_id": user_id,
            "host_id": host_id,
            "date_from": date_from,
            "date_to": date_to
        }

        let url = `${this.address}reservations/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }
    
    async get_market_groups() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/groups`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_market_group(name, supergroup_id) {
        let data = {
            "name": name,
            "supergroup_id": supergroup_id
        }

        let url = `${this.address}market/groups/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_market_supergroups() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/supergroups`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_market_supergroup(name) {
        let data = {
            "name": name
        }

        let url = `${this.address}market/supergroups/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_market_products() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/products`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_market_product(product_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/products/${product_id}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_market_product(name, group_id, coast_sheme) {
        let data = {
            "name": name,
            "group_id": group_id,
            "coast_sheme": coast_sheme
        }

        let url = `${this.address}market/products/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async update_market_product_remains(product_id, value) {
        let data = {
            "product_id": product_id,
            "value": value
        }

        let url = `${this.address}market/products/remains`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async sell_market_product(user_id, product_id, currency_id) {
        let data = {
            "user_id": user_id,
            "product_id": product_id,
            "currency_id": currency_id
        }

        let url = `${this.address}market/products/sell`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_market_ivoices(type) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/invoice/list/${type}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_market_ivoice(type, price, products_list) {
        let data = {
            "type": type,
            "price": price,
            "products_list": products_list
        }

        let url = `${this.address}market/invoice/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async market_invoice_accept(invoice_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/invoice/accept/${invoice_id}`;

            return await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return { "is_error": false};
                }
            });
        }
    }

    async market_invoice_delete(invoice_id) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/invoice/delete/${invoice_id}`;

            return await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return { "is_error": false };
                }
            });
        }
    }

    async get_market_combo() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/combo`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async create_market_combo(name, coast_sheme, positions) {
        let data = {
            "name": name,
            "coast_sheme": coast_sheme,
            "positions": positions
        }

        let url = `${this.address}market/combo/create`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }

    async get_market_log(type) {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}market/log/${type}`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_currency() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}currency`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async get_config() {
        if (!this.check_token()) {
            return { "is_error": true, "message": "Unauthoraized" };
        } else {
            let url = `${this.address}config`;

            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth": getCookie("workspace_token")
                }
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => {
                        try {
                            let error_data = JSON.parse(text);
                            return { "is_error": true, "message": error_data.message }
                        } catch {
                            return { "is_error": true, "message": "Неизвестная ошибка!" };
                        }
                    });
                } else {
                    return res.text().then(text => {
                        let json = JSON.parse(text);

                        return { "is_error": false, "data": json };
                    });
                }
            });
        }
    }

    async update_config_param(param, value) {
        let data = {
            "key": param,
            "value": value
        }

        let url = `${this.address}config/update`;

        let result = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "auth": getCookie("workspace_token")
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        return { "is_error": true, "message": error_data.message }
                    } catch {
                        return { "is_error": true, "message": "Неизвестная ошибка!" };
                    }
                });
            }
            else {
                return { "is_error": false };
            }
        });

        return result;
    }
    
    check_token() {
        if (!getCookie("workspace_token")) {
            return false;
        } else {
            return true;
        }
    }
}

const Controller = new WorkspaceController();