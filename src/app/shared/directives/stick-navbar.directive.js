(function() {
    'use strict';

    angular
        .module('app.home')
        .directive('stickNavbar', stickNavbar);

    stickNavbar.$inject = [];

    function stickNavbar() {
        return {
            restrict: 'A',
            link: function(scope, $element, attr) {

                // jQuery for page scrolling feature - requires jQuery Easing plugin
                $('a.page-scroll').bind('click', function(e) {
                    var $anchor = $(this);
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1500, 'easeInOutExpo');
                    e.preventDefault();
                });

                // Highlight the top nav as scrolling occurs
                $('body').scrollspy({
                    target: '.navbar-fixed-top'
                });
            }
        }
    }

})();