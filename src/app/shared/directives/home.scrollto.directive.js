(function() {
    'use strict';

    angular
        .module('app.home')
        .directive('scrollToItem',scrollToItem);

    scrollToItem.$inject = [];

    function scrollToItem() {
        return {
            restrict: 'A',
            scope: {
                scrollTo: "@"
            },
            link: function(scope, $element, attr) {
                $element.on('click', function() {                                                    
                    $('html,body').animate({
                        scrollTop: $(scope.scrollTo).offset() ? $(scope.scrollTo).offset().top : 0
                    }, "slow");
                });
            }
        }
    }

})();