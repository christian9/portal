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
                JsonData: function (msApi)
                {
                    return msApi.resolve('pesa.mjson@get');
                },
                BananaData: function (msApi)
                {
                    return msApi.resolve('pesa.bananas@get');
                },
                VariableData: function (msApi)
                {
                    return msApi.resolve('pesa.variables@get');
                }
            },
            bodyClass: 'pesa-muestreos'
        });

        // Api
        msApiProvider.register('pesa.mjson', ['app/data/pesa/muestreos/data.json']);
        msApiProvider.register('pesa.variables', ['http://localhost:900/api/variable',null,{'get': { method:'get', isArray: true }}]);
        msApiProvider.register('pesa.bananas', ['http://localhost:900/api/banano',null,{'get': { method:'get', isArray: true }}]);
    }

})();