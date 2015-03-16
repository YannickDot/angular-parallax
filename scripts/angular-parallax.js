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
     var rafActive = false;
     var raf;
     var windowHeight = $window.innerHeight;
     var body = window.document.body;

     function setPosition () {
       latestKnownScrollY = $window.scrollY;
       requestRAF();
     }

     function disableHover () {
       body.classList.add('disable-hover');
     }

     function enableHover () {
       body.classList.remove('disable-hover');
     }

     function requestRAF () {
        if(!rafActive) {
          raf = $window.requestAnimationFrame(update);
        }
        rafActive = true;
     }


     function update () {
       rafActive = false;
       var currentScroll = latestKnownScrollY;
       // horizontal positioning
       elem.css('left', $scope.parallaxHorizontalOffset + "px");

       var calcValY = currentScroll * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
       if (calcValY <= windowHeight) {
         var topVal = (calcValY < $scope.parallaxVerticalOffset ? $scope.parallaxVerticalOffset : calcValY);
         elem.css('transform','translateY(' +topVal+ 'px)');
       }
     }

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
