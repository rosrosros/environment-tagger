var app = angular.module('optionsApp', []);
app.controller('optionsCtrl', ['$scope','$timeout', function($scope,$timeout) {

  

    var loadOptions = function(callback){
		chrome.storage.sync.get(
			{rules: [
					{
					  pattern: "google",
					  css: defaultCss,
					  html: defaultHtml
					}

			]}
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
    			pattern:"new",
    			html: defaultHtml,
    			css: defaultCss

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



var defaultHtml = '<div class="ribbon" id="mark"><span id="ribbonText">DEV</span></div>';

var defaultCss = `.ribbon {
  position: absolute;
  right: -5px; top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 200px; height: 200px;
  text-align: right;
  z-index:100000;
  pointer-events: none;
}
.ribbon span {
    font-size: 20px;
    font-weight: bold;
    color: #FFF;
    text-transform: uppercase;
    text-align: center;
    line-height: 36px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    width: 250px;
    display: block;
    background: #79A70A;
    background: linear-gradient(#9BC90D 0%, #79A70A 100%);
    box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
    position: absolute;
    top: 59px;
    right: -49px;
}
.ribbon span::before {
  content: "";
  position: absolute; left: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid #79A70A;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #79A70A;
}
.ribbon span::after {
  content: "";
  position: absolute; right: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #79A70A;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #79A70A;
}

`;