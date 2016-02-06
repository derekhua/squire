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
  urlString = url.join('');
  window.open("http://" + urlString, '_blank');
  console.log("opening " + "http://" + urlString);
};

builtInCommands.say = function(words) {
  msg.text = words.join(" ");
  window.speechSynthesis.speak(msg);
};

builtInCommands.search = function(query) {
  window.open("https://www.google.com/search?q=" + query.join(" "), '_blank');
};

builtInCommands.amazon = function(query) {
  window.open("http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + query.join(" "), '_blank');
};

builtInCommands.reddit = function(query) {
  window.open("https://www.reddit.com/search?q=" + query.join(" "), '_blank');
};
builtInCommands.print = function() {
  console.log('in print');
  alert("I am an alert box!");
  window.print();
};

builtInCommands.close = function(args) {
  if (args[0] === 'tab') {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
      chrome.tabs.remove(tabArray[0].id);
    });
  } else if (args[0] === 'all'){
    console.log('closing tabs');
    chrome.tabs.query({}, function (tabArray) {
      console.log('tabArray');
      console.log(tabArray);
      for (var i = 0; i < tabArray.length; ++i) {
        chrome.tabs.remove(tabArray[i].id);  
      }
    });
  } else if (args[0]) {
    var urlString = args.join('');
    console.log('closing: ' + urlString);
    var urlPattern = '*://*.' + urlString + '/*';
    chrome.tabs.query({ url: urlPattern }, function (tabArray) {
      console.log('tabArray');
      console.log(tabArray);
      for (var i = 0; i < tabArray.length; ++i) {
        chrome.tabs.remove(tabArray[i].id);  
      }
    });
  }
};
builtInCommands.clothes = builtInCommands.close; // lol

builtInCommands.new = function() {
  window.open();
};

builtInCommands.read = function() {
  chrome.tabs.executeScript(null, {
    code:"window.speechSynthesis.speak(new SpeechSynthesisUtterance(window.getSelection().toString()));"
  });
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