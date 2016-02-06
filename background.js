function execute(command, args) {
  builtInCommands[command](args);
};

var builtInCommands = {};
builtInCommands.open = function(url) {
  window.open("http://www." + url[0], '_blank');
};
builtInCommands.say = function(words) {
  var sentence = "";
  for (i = 0; i < words.length; i++) {
    sentence += words[i] + " ";
  }
  var u = new SpeechSynthesisUtterance(sentence);
  window.speechSynthesis.speak(u);
};
builtInCommands.search = function(query) {
  var sentence = "";
  if (typeof query === 'object') {
    for (i = 0; i < query.length; i++) {
      sentence += query[i] + " ";
    }
  }
  else {
    sentence = query;
  }
  window.open("https://www.google.com/search?q=" + sentence, '_blank');
};

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
            var transcript;
            new Promise(function(resolve, reject) {
              transcript = result[0].transcript.toLowerCase();
              console.log(transcript);
              var commandObject = JSON.parse(localStorage.getItem(transcript));
              resolve(commandObject);
            }).then(function(commandObjects) {
              // User command
              if (commandObjects !== undefined && commandObjects !== null) {
                // May have more than one command
                console.log(commandObjects); 
                for (var i = 0; i < commandObjects.length; ++i) {
                  execute(commandObjects[i].command, commandObjects[i].args);  
                }                
              }
              // Built-in command
              else if (builtInCommands[transcript.split(" ")[0]] !== undefined) {
                var split;
                var command;
                var args;
                new Promise(function(resolve, reject) {
                  split = transcript.split(" ");
                  command = split[0];
                  args = split.splice(1,split.length);
                  resolve();
                }).then(function() {
                    execute(command, args);              
                });
              }
              else {
                console.error("command not found");
              }
            }); 
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