angular.module( 'Squire', [ 'ngMaterial' ] )

.controller("AppCtrl", function($scope, $timeout, $mdSidenav, $log, $anchorScroll, $location) {
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
  }

  $scope.deleteCommand = function (index) {
    $scope.voiceCommands.splice(index, 1);
  }

  $scope.range = function(min, max, step) {
   step = step || 1;
   var input = [];
   for (var i = min; i <= max; i += step) {
       input.push(i);
   }
   return input;
  };

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  $scope.len = 0;
  $scope.customCommand = {
    "custom-command" : "",
    "actions": [
      {
        "action" : "",
        "args" : []
      }
    ]
  }
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  $scope.newCommand = function() {
    new Promise(function(resolve, reject) {
        $scope.voiceCommands.push({"name": '', "commands": ''});
        resolve();
      }).then(function() {
          $location.hash('bottom');
          $anchorScroll();             
      });
  }
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