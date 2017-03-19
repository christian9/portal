(function ()
{
    'use strict';

    angular
        .module('app.inventario',[])

        .config(config);

        /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('apps', {
            title : 'Sistemas',
            group : true,
            weight: 4
        });

        msNavigationServiceProvider.saveItem('apps.inventario', {
            title : 'Sistema de Inventario',
            icon  : 'icon-tile-four',
            weight: 1
        });
    }

})();