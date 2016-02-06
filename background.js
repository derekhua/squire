chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if (command === "Activate Microphone") {
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } 
    else {
      var recognizer = new webkitSpeechRecognition();
      recognizer.lang = "en";
      recognizer.onresult = function(event) {
        if (event.results.length > 0) {
          console.log(event.results[event.results.length-1]);
          var result = event.results[event.results.length-1];
          if(result.isFinal) {
            console.log(result[0].transcript);
          }
        }  
      };
      recognizer.onerror = function(event) {
        console.log("error: " + event.error);
      };
      recognizer.start();
    }
  }
});