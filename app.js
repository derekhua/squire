angular.module( 'Squire', [ 'ngMaterial' ] )

.controller("AppCtrl", function($scope, $timeout, $mdSidenav, $log, $anchorScroll, $location, $mdDialog, $mdMedia, $mdToast) {
  $scope.isOpen = false;
  $scope.demo = {
    isOpen: false,
    count: 0,
    selectedDirection: 'left'
  };

  $scope.toggleLeft = buildDelayedToggler('left');

  if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia({audio: true}, function(stream) {
      video.src = window.URL.createObjectURL(stream);
    }, function(){console.log("Microphone get access error")});
  }

  // List of all user defined commands
  $scope.voiceCommands = [];
  for(var i = 0, len=localStorage.length; i<len; ++i) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    console.log(key + " => " + value);
    $scope.voiceCommands.push({"name": key, "commands": JSON.parse(value)});
  };

  $scope.deleteCommand = function(index) {
    var key = $scope.voiceCommands[index].name;
    $scope.voiceCommands.splice(index, 1);
    localStorage.removeItem(key);
    $mdToast.show(
      $mdToast.simple()
        .textContent('Deleted!')
        .position("top right")
        .hideDelay(2000)
    );
  };

  $scope.editCommand = function(index) {
    $scope.customVoiceCommand = $scope.voiceCommands[index];
    $scope.showAdvanced();
  };

  // Modal
  $scope.showAdvanced = function(ev) {
    $scope.voiceCommands = [];
    for(var i = 0, len=localStorage.length; i<len; ++i) {
      var key = localStorage.key(i);
      var value = localStorage[key];
      console.log(key + " => " + value);
      $scope.voiceCommands.push({"name": key, "commands": JSON.parse(value)});
    };
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'command-dialog.tmpl.html',
      targetEvent: ev,
      controller: DialogController,
      scope: $scope,
      clickOutsideToClose:true,
      fullscreen: useFullScreen,
      locals: {
        voiceCommands: $scope.voiceCommands,
        customVoiceCommand: $scope.customVoiceCommand
      },
    }).then(function(result) {
      console.log(result);
      $scope.$apply(function(result) {
        $scope.voiceCommands = result;
      });
      window.location.reload();
    }).catch(function() {
      window.location.reload();
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  // Modal controller
  function DialogController($scope, $mdDialog, voiceCommands, customVoiceCommand) {
    $scope.builtInFunctions = ['open', 'close', 'new', 'mute', 'unmute', 'say', 'search', 'read', 'copy', 'cut', 'paste', 'amazon', 'reddit'];
    $scope.voiceCommands = voiceCommands;
    if (customVoiceCommand) {
      console.log('good');
      $scope.customVoiceCommand = customVoiceCommand; 
      console.log($scope.customVoiceCommand);
    } else {
      console.log('bad');
      $scope.customVoiceCommand = { 
        "custom_command" : "",
        "commands": [
        ]
      };  
    }

    $scope.deleteAction = function(index) {
      $scope.customVoiceCommand.commands.splice(index, 1);
    };
    
    $scope.addAction = function(type) {
      console.log($scope.customVoiceCommand);
      $scope.customVoiceCommand.commands.push({"command": type, "args": []});
    };

    $scope.submitCommand = function() {
      for (i = 0; i != $scope.customVoiceCommand.commands.length; ++i) {
        if (typeof $scope.customVoiceCommand.commands[i].args !== 'object') {
          $scope.customVoiceCommand.commands[i].args = $scope.customVoiceCommand.commands[i].args.split();  
        }
        //$scope.customVoiceCommand.commands[i].args.push(document.getElementById('action_' + i).value);
      }
      var strJSON = JSON.stringify($scope.customVoiceCommand.commands);
      var strCMD = document.getElementById('voice_command').value;
      console.log(strCMD + " " + strJSON);

      localStorage.setItem(strCMD, strJSON);
      $scope.voiceCommands.push({"name": strCMD, "commands": JSON.parse(strJSON)});
      
      console.log('voiceCommands');
      console.log($scope.voiceCommands);
      $mdDialog.hide($scope.voiceCommands);
    };
  }

  // Calls for every new command
  $scope.newCommand = function(cmd, json) {
    new Promise(function(resolve, reject) {
        $scope.voiceCommands.push({"name": cmd, "commands": json});
        resolve();
      }).then(function() {
          $location.hash('bottom');
          $anchorScroll();             
      });
  };

   function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }
  }





});