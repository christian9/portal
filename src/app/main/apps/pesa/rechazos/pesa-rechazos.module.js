(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos',
            [
                // 3rd Party Dependencies
                'nvd3',
                'datatables'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.pesa_rechazos', {
            url      : '/pesa-rechazos',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/pesa/rechazos/pesa-rechazos.html',
                    controller : 'PesaRechazosController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('pesa.rechazos@get');
                }
            },
            bodyClass: 'pesa-rechazos'
        });

        // Api
        msApiProvider.register('pesa.rechazos', ['app/data/pesa/rechazos/data.json']);
    }

})();