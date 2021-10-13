console.log("Hello from notify!")

var participants, url, listening;

browser.storage.local.get("checked").then((obj) => {
    listening = obj.checked;
});

browser.storage.local.get("url").then((obj) => {
    url = obj.url;
});

var participants_tab_xpath = "//*[@id='panel-control-participants']";

var participants_tab_node = document.evaluate(participants_tab_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

let participant_observer = new MutationObserver((mutations, observer) => {
    var old_value = parseInt(mutations[0].oldValue.split(' ')[1]);
    var new_value = parseInt(mutations[0].target.getAttribute("aria-label").split(' ')[1]);
    if (listening && new_value > old_value) {
        browser.storage.local.get("url").then((obj) => {
            var req = new XMLHttpRequest();
            req.open("GET", obj.url);
            req.send();
        });
    }
});

participant_observer.observe(participants_tab_node, {attributeFilter: ["aria-label"], attributeOldValue: true});

browser.runtime.onMessage.addListener((message) => {
    if (message.message == "check") {
        listening = message.checked;
    } else if (message.message == "url") {
        url = message.url;
    }
});