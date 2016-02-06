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
            var transcript = result[0].transcript.toLowerCase();
            console.log(transcript);
            var commandObject = JSON.parse(localStorage.getItem(transcript));
            if (commandObject !== undefined && commandObject !== null) {
              console.log(commandObject);
              var command = commandObject.command;
              var args = commandObject.args;
              console.log(command + " " + args);
              execute(command, args);
            }
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
          }
        }  
      };

      recognizer.onerror = function(event) {
        console.log("error: " + event.error);
      };
      recognizer.start();
    }
  }

  var execute = function(command, args) {
    builtInCommands[command](args);
  };

  var builtInCommands = {};
  builtInCommands.open = function(url) {
    if (typeof url === 'object') {
      var split = url[0].split('.');
    }
    else {
      var split = [url];
    }
    window.open("http://www." + split[split.length - 2] + "." + split[split.length - 1], '_blank');
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
});