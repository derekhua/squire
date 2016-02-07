angular.module( 'Squire', [ 'ngMaterial' ] )

.controller("AppCtrl", function($scope, $timeout, $mdSidenav, $log, $anchorScroll, $location, $mdDialog, $mdMedia) {
  // e.g. var a = new Command("test", ["blah", "blah"]);
  function VoiceCommand(name, commands) {
    this.name = name;
    this.commands = commands;
  }
  $scope.isOpen = false;
  $scope.demo = {
    isOpen: false,
    count: 0,
    selectedDirection: 'left'
  };

  // var youtube = [];
  // var main = {};
  // main.command = "open";
  // main.args = ["youtube.com"];
  // youtube.push(main);
  // var main2 = {};
  // main2.command = "open";
  // main2.args = ["reddit.com"];
  // youtube.push(main2);
  // localStorage.setItem("youtube", JSON.stringify(youtube));

  $scope.voiceCommands = [];
  for(var i = 0, len=localStorage.length; i<len; ++i) {
    var key = localStorage.key(i);
    var value = localStorage[key];
    console.log(key + " => " + value);
    $scope.voiceCommands.push({"name": key, "commands": value});
  };

  $scope.deleteCommand = function (index) {
    var key = $scope.voiceCommands[index].name;
    $scope.voiceCommands.splice(index, 1);
    localStorage.removeItem(key);
  };


  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  $scope.len = 0;
  $scope.customCommand = {
    "custom_command" : "",
    "actions": [
    ]
  };

   $scope.showAdvanced = function(ev) {
    $scope.voiceCommands = [];
    for(var i = 0, len=localStorage.length; i<len; ++i) {
      var key = localStorage.key(i);
      var value = localStorage[key];
      console.log(key + " => " + value);
      $scope.voiceCommands.push({"name": key, "commands": value});
    };
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'command-dialog.tmpl.html',
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen,
    })
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.addAction = function(type) {
    $scope.customCommand.actions.push({"action": type, "args": ""});
  };

  $scope.submitCommand = function() {
    for (i = 0; i != $scope.customCommand.actions.length; ++i) {
      $scope.customCommand.actions[i].args = document.getElementById('action_' + i).value;
    }
    var strJSON = JSON.stringify($scope.customCommand.actions);
    var strCMD = document.getElementById('voice_command').value;
    $scope.customCommand.custom_command = strJSON;
    localStorage.setItem(strCMD, strJSON);
    $scope.resetCommand();  
    $scope.hide();
    window.location.reload();
  };

  $scope.resetCommand = function() {
    $scope.customCommand = {
      "custom_command" : "",
      "actions": [
      ]
    }
  }
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