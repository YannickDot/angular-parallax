'use strict';

angular.module('angular-parallax', [
]).directive('parallax', ['$window', function($window) {
  return {
    restrict: 'A',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
      parallaxHorizontalOffset: '@',
    },
    link: function($scope, elem, $attrs) {
     var latestKnownScrollY = 0;
     var raf;
     var windowHeight = $window.innerHeight;
     var body = window.document.body;

     function setPosition () {
       latestKnownScrollY = $window.scrollY;
     }

     function disableHover () {
       body.classList.add('disable-hover');
     }

     function enableHover () {
       body.classList.remove('disable-hover');
     }


     function update () {
       raf = $window.requestAnimationFrame(update);
       // horizontal positioning
       elem.css('left', $scope.parallaxHorizontalOffset + "px");

       var calcValY = latestKnownScrollY * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
       if (calcValY <= windowHeight) {
         var topVal = (calcValY < $scope.parallaxVerticalOffset ? $scope.parallaxVerticalOffset : calcValY);
         elem.css('transform','translateY(' +topVal+ 'px)');
       }
     }
     raf = $window.requestAnimationFrame(update);

     setPosition();

     angular.element($window).bind("scroll", setPosition);
     angular.element($window).bind("scrollstart", disableHover);
     angular.element($window).bind("scrollstop", enableHover);
     angular.element($window).bind("touchmove", setPosition);
   }  // link function
  };
}]).directive('parallaxBackground', ['$window', function($window) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      parallaxRatio: '@',
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
        var calcValY = (elem.prop('offsetTop') - $window.pageYOffset) * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
        // horizontal positioning
        elem.css('background-position', "50% " + calcValY + "px");
      };

      // set our initial position - fixes webkit background render bug
      angular.element($window).bind('load', function(e) {
        setPosition();
        $scope.$apply();
      });

      angular.element($window).bind("scroll", setPosition);
      angular.element($window).bind("touchmove", setPosition);
    }  // link function
  };
}]);
