console.log("Hello from notify!")

let participants, url, listening;

browser.storage.local.get("checked").then((obj) => {
    listening = obj.checked;
});

browser.storage.local.get("url").then((obj) => {
    url = obj.url;
});

let participants_tab_xpath = "//*[@id='panel-control-participants']";

let participants_tab_node;

let findParticipantsTabNode = () => {
    participants_tab_node = document.evaluate(participants_tab_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (participants_tab_node == null) {
        setTimeout(findParticipantsTabNode, 100);
    } else {
        participant_observer.observe(participants_tab_node, {attributeFilter: ["aria-label"], attributeOldValue: true});
    }
}

setTimeout(findParticipantsTabNode, 1000);

let participant_observer = new MutationObserver((mutations, observer) => {
    let old_value = parseInt(mutations[0].oldValue.split(' ')[1]);
    let new_value = parseInt(mutations[0].target.getAttribute("aria-label").split(' ')[1]);
    if (listening && new_value > old_value) {
        browser.storage.local.get("url").then((obj) => {
            let req = new XMLHttpRequest();
            req.open("GET", obj.url);
            req.send();
        });
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.message == "check") {
        listening = message.checked;
    } else if (message.message == "url") {
        url = message.url;
    }
});