console.log("Hello from notify!")

var participants;
var url;

let participant_observer = new MutationObserver((mutations, observer) => {
    previous_participants = participants;
    participants = parseInt(mutations[0].target.textContent.split(' ')[0]);
    if (listening) {
        if (previous_participants < participants) {
            console.log("SOMEONE HAS JOINED");
            browser.storage.local.get("url").then((obj) => {
                console.log(obj.url);
                var req = new XMLHttpRequest();
                req.open("GET", obj.url);
                req.send();
                console.log("sent req");
            });
        } else if (previous_participants > participants) {
            console.log("SOMEONE HAS LEFT");
        }
    }
});

let page_observer = new MutationObserver((mutations, observer) => {
    let participants_header = document.getElementById("participants-header");
    if (participants_header != null) {
        participant_observer.observe(participants_header.children[0], {childList: true});
    } else {
        participant_observer.disconnect();
    }
    
});

page_observer.observe(document.body, {subtree: true, childList: true});

browser.runtime.onMessage.addListener((message) => {
    if (message.message == "listen") {
        
    } else if (message.message == "url") {
        console.log(message.url);
        url = message.url;
    }
});