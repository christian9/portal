(function ()
{
    'use strict';

    angular
        .module('app.pesa.muestreos',
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
        $stateProvider.state('app.pesa_muestreos', {
            url      : '/pesa-muestreos',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/pesa/muestreos/pesa-muestreos.html',
                    controller : 'PesaMuestreosController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('pesa.muestreos@get');
                }
            },
            bodyClass: 'pesa-muestreos'
        });

        // Api
        msApiProvider.register('pesa.muestreos', ['app/data/pesa/muestreos/data.json']);
    }

})();