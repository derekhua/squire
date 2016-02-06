var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = 'Daniel'; // Note: some voices don't support altering params
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10
msg.pitch = 1; //0 to 2
msg.text = 'Hello World';
msg.lang = 'en-US';

function execute(command, args) {
  builtInCommands[command](args);
};

var builtInCommands = {};

builtInCommands.open = function(url) {
  window.open("http://www." + url[0], '_blank');
};

builtInCommands.say = function(words) {
  msg.text = words.join(" ");
  window.speechSynthesis.speak(msg);
};

builtInCommands.search = function(query) {
  window.open("https://www.google.com/search?q=" + query.join(" "), '_blank');
};

builtInCommands.print = function() {
  console.log('in print');
  alert("I am an alert box!");
  window.print();
};

builtInCommands.close = function(args) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
    chrome.tabs.remove(tabArray[0].id);
  });
};

builtInCommands.new = function() {
  window.open();
};

builtInCommands.read = function() {
  msg.text = window.getSelection().toString();
  console.log(msg.text);
  window.speechSynthesis.speak(msg);
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
                console.log('USER COMMAND');
                // May have more than one command
                console.log(commandObjects); 
                for (var i = 0; i < commandObjects.length; ++i) {
                  execute(commandObjects[i].command, commandObjects[i].args);  
                }                
              }
              // Built-in command
              else if (builtInCommands[transcript.split(" ")[0]] !== undefined) {
                console.log('BUILTIN COMMAND');
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