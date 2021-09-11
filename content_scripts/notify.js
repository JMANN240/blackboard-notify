console.log("Hello from notify!")

var participants, url, listening;

browser.storage.local.get("checked").then((obj) => {
    listening = obj.checked;
});

browser.storage.local.get("url").then((obj) => {
    url = obj.url;
});

let participant_observer = new MutationObserver((mutations, observer) => {
    previous_participants = participants;
    participants = parseInt(mutations[0].target.textContent.split(' ')[0]);
        if (listening && previous_participants < participants) {
            browser.storage.local.get("url").then((obj) => {
                var req = new XMLHttpRequest();
                req.open("GET", obj.url);
                req.send();
            });
        }
});

let page_observer = new MutationObserver((mutations, observer) => {
    let participants_header = document.getElementById("participants-header");
    if (participants_header != null) {
        participants = parseInt(participants_header.children[0].innerHTML.split(' ')[0]);
        participant_observer.observe(participants_header.children[0], {childList: true});
    } else {
        participant_observer.disconnect();
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.message == "check") {
        listening = message.checked;
    } else if (message.message == "url") {
        url = message.url;
    }
});

page_observer.observe(document.body, {subtree: true, childList: true});