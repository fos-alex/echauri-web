(function() {
    'use strict';

    angular
        .module('app.home')
        .controller('Home', Home);

    Home.$inject = ['$rootScope', '$state'];

    function Home($rootScope, $state) {
        var vm = this;
        vm.catas = [
            {
                title: "Cata Bodega del Desierto",
                subtitle: "Cata Bodega del Desierto",
                pics: ['desierto/1.jpg','desierto/2.jpg','desierto/3.jpg','desierto/4.jpg','desierto/5.jpg','desierto/6.jpg','desierto/7.jpg','desierto/8.jpg'],
                alt: 'Cata bodega del desierto en Echauri',
                cover: "assets/img/catas/desierto/1-portada.jpg"
           }
        ];
        vm.catas.forEach((cata) => {
            let gallery = {
                methods: {},
                images: []
            };
            gallery.openGallery = () => {
                gallery.methods.open();
            };
            cata.pics.forEach((pic) => {
                gallery.images.push({
                    alt: gallery.alt,
                    url: '/assets/img/catas/' + pic
                });
            });
            cata.gallery = gallery;
        });
    }

})();
