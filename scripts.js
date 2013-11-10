var ballInHole = angular.module('ballInHole', []);

ballInHole.run(function($rootScope, $window) {
	$rootScope.windowWidth = $window.outerWidth;
	$rootScope.windowHeight = $window.outerHeight;
	
	angular.element($window).bind('resize',function() {
		$rootScope.windowWidth = $window.outerWidth;
		$rootScope.windowHeight = $window.outerHeight;
		
		$rootScope.$apply('windowWidth');
		$rootScope.$apply('windowHeight');
	});
});

ballInHole.controller('GameController', function($scope, $rootScope, $timeout) {
	$scope.ballX = -300;
	$scope.ballY = -300;
	$scope.holeX = -300;
	$scope.holeY = -300;
	$scope.time = "00:00";
	$scope.scale = 1;
	
	var mouseX = $scope.ballX;
	var mouseY = $scope.ballY;
	var timeStart = 0;
	var timePaused = 0;
	var time;
	var paused = true;
	
	$scope.movement = function(event) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;
	}
	
	$scope.onTimeout = function() {
		if (!paused) {
			moveBall();
			updateTime();
			checkFinished();
		}	
		
		mytimeout = $timeout($scope.onTimeout, 5);
    }
	
	function moveBall() {
		var xMovement = 0;
		var yMovement = 0;
		
		if (mouseX > ($rootScope.windowWidth / 3) * 2 && $scope.ballX < ($rootScope.windowWidth / $scope.scale) - 50) {
			xMovement = 1;
		} else if (mouseX < ($rootScope.windowWidth / 3) && $scope.ballX > 50) {
			xMovement = -1;
		}
		
		if (mouseY > ($rootScope.windowHeight / 3) * 2 && $scope.ballY < ($rootScope.windowHeight / $scope.scale) - 100) {
			yMovement = 1;
		} else if (mouseY < ($rootScope.windowHeight / 3) && $scope.ballY > 50) {
			yMovement = -1;
		}
		
		$scope.ballX += xMovement;
		$scope.ballY += yMovement;
	}
	
	function checkFinished() {
		var margin = 10;
		if (
			$scope.ballX + margin > $scope.holeX
			&& $scope.ballX - margin < $scope.holeX
			&& $scope.ballY + margin > $scope.holeY
			&& $scope.ballY - margin < $scope.holeY
		) {
			$scope.ballX = $scope.holeX;
			$scope.ballY = $scope.holeY;
			alert("Congratulations! Your score is " + $scope.time);
			paused = true;
			time = 0;
			timeStart = 0;
			$scope.time = "00:00";
		}
	}
	
	function updateTime() {
		time = Math.floor((new Date().getTime() - timeStart) / 1000);
		
		var minutes = Math.floor(time / 60);
		var seconds = time % 60;
		
		$scope.time = "";
		
		if (minutes < 10) {
			$scope.time += "0";
		}
		
		$scope.time += minutes + ":";
		
		if (seconds < 10) {
			$scope.time += "0";
		}
		
		$scope.time += seconds;
	}
	
	$rootScope.$watch('windowWidth', function(newWidth, oldWidth){
		$scope.scale = newWidth / 1000;
	});
	
	$scope.play = function() {
		if (timeStart == 0) {
			time = 0;
			timeStart = new Date().getTime();
			initialiaseGame();
		} else if (paused) {
			timeStart += (new Date().getTime() - timePaused);
		}

		paused = false;
	}
	
	$scope.pause = function() {
		paused = true;
		timePaused = new Date().getTime();
	}
	
	$scope.stop = function() {
		paused = true;
		$scope.ballX = -300;
		$scope.ballY = -300;
		$scope.holeX = -300;
		$scope.holeY = -300;
		time = 0;
		timeStart = 0;
		$scope.time = "00:00";
	}
	
	initialiaseGame = function() {
		$scope.ballX = Math.floor(Math.random() * (($rootScope.windowWidth / $scope.scale) - 200)) + 100;
		$scope.ballY = Math.floor(Math.random() * (($rootScope.windowHeight / $scope.scale) - 200)) + 100;
		$scope.holeX = Math.floor(Math.random() * (($rootScope.windowWidth / $scope.scale) - 200)) + 100;
		$scope.holeY = Math.floor(Math.random() * (($rootScope.windowHeight / $scope.scale) - 200)) + 100;
	}

	var mytimeout = $timeout($scope.onTimeout, 5);
});