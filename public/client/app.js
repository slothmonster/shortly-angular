angular.module('shortly', ['ngRoute'])
.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/client/links.html'
      })
      .when('/links', {
        templateUrl: '/client/links.html'
      })
      .when('/login', {
        templateUrl: '/client/login.html'
      })
      .when('/signup', {
        templateUrl: '/client/signup.html'
      })
      .when('/shorten', {
        templateUrl: '/client/shorten.html'
      });
      // .otherwise({
      //   redirectTo: '/'
      // });
  })

.service('linkService', function($http){
  this.getLinks = function(){
    return $http({
      method:"GET",
      url:"/links"
    }).then(function(data){
      console.log("data", data);
      return data.data;
    }, function(err){
      console.log("couldn't get links");
    });
  };
})

.controller('linkController', function($scope, linkService){
  linkService.getLinks().then(function(links){
    $scope.links = links;
  });
  // $scope.refresh = function(){
  //   linkService.getLinks().then(function(links){
  //     $scope.links = links;
  //   });
  // };
  // $scope.refresh();
  console.log("links" ,$scope.links);
});


