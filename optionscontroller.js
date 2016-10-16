var app = angular.module('optionsApp', []);
app.controller('optionsCtrl', ['$scope','$timeout', function($scope,$timeout) {

  

    var loadOptions = function(callback){
		chrome.storage.sync.get(
			{rules: []}
		, function(items) {
		    	callback(items);
		  });
		};

	var saveOptions = function(data){
		chrome.storage.sync.set(data, function() {
		    console.log('data saved', data);
		    
		});

	};

    loadOptions(function(data){

    	$scope.data = data;
    	$scope.$apply();
    })
   
    $scope.save = function(){
    	
    	saveOptions($scope.data);

    };

    $scope.addEmptyRow = function(){
    	$scope.data.rules.unshift(
    		{
            pattern: "new",
            text: 'label',
            position: 'topleft',
            color: 'green'
          }
    	);
    	saveOptions($scope.data);

    }

    $scope.removeRule = function(item) { 
	  var index = $scope.data.rules.indexOf(item);
	  $scope.data.rules.splice(index, 1); 
	  saveOptions($scope.data);    
	}

    

}]);