chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            let request = obj => {
                return new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open(obj.method || "GET", obj.url);
                    if (obj.headers) {
                        Object.keys(obj.headers).forEach(key => {
                            xhr.setRequestHeader(key, obj.headers[key]);
                        });
                    }
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(xhr.statusText);
                        }
                    };
                    xhr.onerror = () => reject(xhr.statusText);
                    xhr.send(obj.body);
                });
            };
            
            let render = (accountId, accountName) => {
                let el = document.createElement('div');
                el.innerText = 'Account: '+accountId+ ' Name: ' + accountName;
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.padding = '3px';
                el.style.backgroundColor = 'rgb(0,193,222)';
                el.style.color = '#EEEEEE';
                el.style.position = 'fixed';
                el.style.zIndex = 9999;
                el.style.bottom = 0; // sticky to the bottom left;
                el.style.borderRadius = '0 5px 5px 0';
                document.body.appendChild(el);
            };
            
            request({"url":"/v4/users/current"}).then(data => {
                let response = JSON.parse(data);
                let email = response.email;
                let regex = /(?<=\+)[A-z]*(?=@)/gm;
                let accountName = email.match(regex)[0];
                request({"url":"/v4/account"}).then(data => {
                    let response = JSON.parse(data);
                    let accountId = response.id;
                    render(accountId, accountName);
                })
            });
        
        }
    }, 10);
    
});