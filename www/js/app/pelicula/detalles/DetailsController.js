angular.module('FilmsModule')
.controller('DetailsControler',function($scope, Film, film){
  var initView=function(){
    $scope.film=film;
  }
  $scope.$on('$ionicView.loaded', function(){
    initView();
  });
})
