(function ()
{
    'use strict';

    angular
        .module('app.pesa.perfiles',
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
        $stateProvider.state('app.pesa_perfiles', {
            url      : '/pesa-perfiles',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/pesa/perfiles/pesa-perfiles.html',
                    controller : 'PesaPerfilesController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return msApi.resolve('pesa.perfiles@get');
                }
            },
            bodyClass: 'pesa-perfiles'
        });

        // Api
        msApiProvider.register('pesa.perfiles', ['app/data/pesa/perfiles/data.json']);
    }

})();