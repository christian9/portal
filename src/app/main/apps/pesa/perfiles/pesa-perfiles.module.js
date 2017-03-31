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
            bodyClass: 'pesa-perfiles'
        });

        // Api
        msApiProvider.register('pesa.mjson', ['app/data/pesa/perfiles/data.json']);
        msApiProvider.register('pesa.variables', ['http://localhost:901/api/variable',null,{'get': { method:'get', isArray: true }}]);
        msApiProvider.register('pesa.bananas', ['http://localhost:901/api/banano',null,{'get': { method:'get', isArray: true }}]);
    }

})();