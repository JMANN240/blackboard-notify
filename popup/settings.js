var checkbox = document.getElementById("toggle-checkbox");
var url_input = document.getElementById("url-input");

checkbox.addEventListener("click", (e) => {
    browser.storage.local.set({checked: checkbox.checked});
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            message: "check",
            checked: checkbox.checked
        });
    });
});

browser.storage.local.get("checked").then((obj) => {
    checkbox.checked = obj.checked;
});

browser.storage.local.get("url").then((obj) => {
    url_input.value = obj.url;
});

url_input.addEventListener("change", (e) => {
    browser.storage.local.set({url: url_input.value});
});