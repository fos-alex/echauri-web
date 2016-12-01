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
                subtitle: "Cata Bodega del Desierto en Echauri",
                pics: ['desierto/1.jpg','desierto/2.jpg','desierto/3.jpg','desierto/4.jpg','desierto/5.jpg','desierto/6.jpg','desierto/7.jpg','desierto/8.jpg'],
                alt: 'Cata bodega del desierto en Echauri',
                cover: "assets/img/catas/desierto/1-portada.jpg"
           },
            {
                title: "Cata Bodega Calígula",
                subtitle: "Cata Bodega Calígula en Echauri",
                pics: ['caligula/1.jpg','caligula/2.jpg','caligula/3.jpg'],
                alt: 'Cata bodega de calígula en Echauri',
                cover: "assets/img/catas/caligula/1.jpg"
            },
            {
                title: "Cata Bodega Jofré",
                subtitle: "Cata Bodega Jofré en Echauri",
                pics: ['jofre/1.jpg','jofre/2.jpg','jofre/3.jpg','jofre/4.jpg','jofre/5.jpg'],
                alt: 'Cata bodega de jofré en Echauri',
                cover: "assets/img/catas/jofre/1.jpg"
            },
            {
                title: "Cata Viñas de Olivia",
                subtitle: "Cata Viñas de Olivia en Echauri",
                pics: ['olivia/1.jpg','olivia/2.jpg','olivia/3.jpg','olivia/4.jpg','olivia/5.jpg'],
                alt: 'Cata bodega Viñas de Olivia en Echauri',
                cover: "assets/img/catas/olivia/4.jpg"
            },
            {
                title: "Cata Bodega Cicchitti",
                subtitle: "Cata Bodega Cicchitti en Echauri",
                pics: ['cicchitti/1.jpg','cicchitti/2.jpg','cicchitti/3.jpg','cicchitti/4.jpg','cicchitti/5.jpg'],
                alt: 'Cata bodega cicchitti en Echauri',
                cover: "assets/img/catas/cicchitti/5.jpg"
            },
            {
                title: "Cata Bodega Fincas del Limay",
                subtitle: "Cata Bodega Fincas del Limay en Echauri",
                pics: ['fincas-limay/1.jpg','fincas-limay/2.jpg','fincas-limay/3.jpg','fincas-limay/4.jpg',
                    'fincas-limay/5.jpg','fincas-limay/6.jpg','fincas-limay/7.jpg','fincas-limay/8.jpg','fincas-limay/9.jpg'],
                alt: 'Cata bodega fincas-limay en Echauri',
                cover: "assets/img/catas/fincas-limay/1.jpg"
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


        vm.logoBodegas = [
            {name: 'salentein.jpg'},
            {name: 'kaiken.jpg'},
            {name: 'clos-de-los-siete.jpg'},
            {name: 'catena-zapata.jpg'},
            {name: 'ernesto-catena.jpg'},
            {name: 'fin-del-mundo.jpg'},
            {name: 'desierto.jpg'},
            {name: 'norton.jpg'},
            {name: 'rosel.jpg'},
            {name: 'rutini.jpg'}
        ];
    }

})();
