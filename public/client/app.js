angular.module('shortly', ['ngRoute'])
.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/client/links.html',
        controller: 'linkController'
      })
      .when('/links', {
        templateUrl: '/client/links.html',
        controller: 'linkController'
      })
      .when('/create', {
        templateUrl: '/client/create.html',
        controller: 'linkController'
      });
      // .otherwise({
      //   redirectTo: '/'
      // });
  })

.service('getLinkService', function($http){
  this.getLinks = function(){
    return $http({
      method:"GET",
      url:"/links"
    }).then(function(data){
      console.log("data", data);
      return data.data;
    });
  };
})
.service('postLinkService', function($http){
  this.postLink = function(link){
    console.log(link + " link");
    return $http({
      method:"POST",
      url:"/links",
      data:{url:link}
    }).then(function(data){
      return data.data;
    }, function(err){
      console.log(err);
    });
  };
})
.controller('linkController', function($scope, getLinkService, postLinkService){
  $scope.spinning = 'false';
  $scope.showLink = 'false';
  $scope.fetchLinks = function(){
    getLinkService.getLinks().then(function(links){
      $scope.links = links;
    }, function(err){
      console.log("couldn't get links");
    });
  };
  $scope.fetchLinks();

  $scope.postLinks = function(){
    $scope.spinning = 'true';
    var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
      if(!!$scope.newURL.match(rValidUrl)){
        postLinkService.postLink($scope.newURL)
        .then(function(link){
          $scope.spinning = 'false';
          $scope.link = link;
          $scope.showLink = 'true';
        });
      }
  };
});


