(function() {
    'use strict';

    angular
        .module('app.home')
        .directive('animatedHeader', animatedHeader);

    animatedHeader.$inject = [];

    function animatedHeader() {
        return {
            restrict: 'A',
            link: function(scope, $element, attr) {

                var docElem = document.documentElement,
                    header = document.querySelector( '.navbar-default' ),
                    didScroll = false,
                    changeHeaderOn = 300;

                function init() {
                    window.addEventListener( 'scroll', function( event ) {
                        if( !didScroll ) {
                            didScroll = true;
                            setTimeout( scrollPage, 250 );
                        }
                    }, false );
                }

                function scrollPage() {
                    var sy = scrollY();
                    if ( sy >= changeHeaderOn ) {
                        classie.add( header, 'navbar-shrink' );
                    }
                    else {
                        classie.remove( header, 'navbar-shrink' );
                    }
                    didScroll = false;
                }

                function scrollY() {
                    return window.pageYOffset || docElem.scrollTop;
                }

                init();
            }
        }
    }

})();