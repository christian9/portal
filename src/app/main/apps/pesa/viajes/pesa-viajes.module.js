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
                    return msApi.resolve('dashboard.analytics@get');
                }
            },
            bodyClass: 'pesa-viajes'
        });

        // Api
        msApiProvider.register('pesa.viajes', ['app/data/dashboard/analytics/data.json']);
    }

})();