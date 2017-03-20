(function ()
{
    'use strict';

    angular
        .module('app.pesa.viajes',
            [
                // 3rd Party Dependencies
                'nvd3'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.pesa_viajes', {
            url      : '/pesa-viajes',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/pesa/viajes/pesa-viajes.html',
                    controller : 'PesaViajesController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('pesa.viajes@get');
                }
            },
            bodyClass: 'pesa-viajes'
        });

        // Api
        msApiProvider.register('pesa.viajes', ['app/data/pesa/viajes/data.json']);
        msApiProvider.register('pesa.variables', ['http://gestionagricolaapi.azurewebsites.net/api/variable',null,{'get': { method:'get', isArray: true }}]);
        msApiProvider.register('pesa.bananas', ['http://gestionagricolaapi.azurewebsites.net/api/banano',null,{'get': { method:'get', isArray: true }}]);
    }

})();