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

       /* msNavigationServiceProvider.saveItem('apps.pesa.muestreos', {
            title: 'Muestreos',
            //state: 'app.dashboards_project'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.perfiles', {
            title: 'Perfiles',
            //state: 'app.dashboards_server'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.rechazos', {
            title: 'Rechazos',
            //state: 'app.dashboards_server'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.viajes', {
            title: 'Viajes',
            //state: 'app.dashboards_server'
        });*/
    }

})();