(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos',
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
        $stateProvider.state('app.pesa_rechazos', {
            url      : '/pesa-rechazos',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/pesa/rechazos/pesa-rechazos.html',
                    controller : 'PesaRechazosController as vm'
                }
            },
            resolve  : {
                JsonData: function (msApi)
                {
                    return msApi.resolve('pesa.rjson@get');
                },
                VariableData: function (msApi)
                {
                    return msApi.resolve('pesa.variables@get');
                },
                BananaData: function (msApi)
                {
                    return msApi.resolve('pesa.bananas@get');
                }
            },
            bodyClass: 'pesa-rechazos'
        });

        // Api
        msApiProvider.register('pesa.rjson', ['app/data/pesa/rechazos/data.json']);
        msApiProvider.register('pesa.variables', ['http://gestionagricolaapi.azurewebsites.net/api/variable',null,{'get': { method:'get', isArray: true }}]);
        msApiProvider.register('pesa.bananas', ['http://gestionagricolaapi.azurewebsites.net/api/banano',null,{'get': { method:'get', isArray: true }}]);
    }

})();