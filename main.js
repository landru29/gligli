document.addEventListener('DOMContentLoaded', function() {

    function GrabGligli() {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "report_back"}, function(response) {
                const blob = new Blob([JSON.stringify(response, null, 4)], {type: "application/json"});
                chrome.downloads.download({
                    url: URL.createObjectURL(blob)
                });
            });  
        });
    }
    


    var selector = document.getElementById("session");
    if (selector) {
        selector.addEventListener('click', function() {
            GrabGligli();
        });
    }

});