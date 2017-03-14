(function ()
{
    'use strict';

    angular
        .module('app.pesa',[])

        .config(config);

        /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('apps', {
            title : 'Sistemas',
            group : true,
            weight: 2
        });

        msNavigationServiceProvider.saveItem('apps.pesa', {
            title : 'Sistema de Pesa',
            icon  : 'icon-tile-four',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.pesa.muestreos', {
            title: 'Muestreos',
            //state: 'app.dashboards_project'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.perfiles', {
            title: 'Perfiles',
            //state: 'app.dashboards_server'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.rechazos', {
            title: 'Rechazos',
            state: 'app.pesa_rechazos'
        });

        msNavigationServiceProvider.saveItem('apps.pesa.viajes', {
            title: 'Viajes',
            //state: 'app.dashboards_server'
        });
    }

})();