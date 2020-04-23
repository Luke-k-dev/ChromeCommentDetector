chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  console.log("can send message");
  if ((msg.from === "commentList.html") && (msg.requesting === "Comments")) {
    // Collect the necessary data. 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    console.log("will send message");
    
  }
});


var getComments = function(callback){
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  		chrome.tabs.executeScript(tabs[0].id, {file: "commentDetector.js"}, function(scriptResponse) {
        	callback(scriptResponse);
    	});
	});
}