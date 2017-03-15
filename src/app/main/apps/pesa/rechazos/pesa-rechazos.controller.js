(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos')
        .controller('PesaRechazosController', PesaRechazosController);

    /** @ngInject */
    function PesaRechazosController(PesaData)
    {
        var vm = this;

        // Data
        vm.pesaData = PesaData;
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];

        vm.widget1 = {
            title             : vm.pesaData.widget1.title,
            onlineUsers       : vm.pesaData.widget1.onlineUsers,
            bigChart          : {
                options: {
                    chart: {
                        type                   : 'lineWithFocusChart',
                        color                  : ['#2196F3'],
                        height                 : 400,
                        margin                 : {
                            top   : 32,
                            right : 32,
                            bottom: 64,
                            left  : 48
                        },
                        isArea                 : true,
                        useInteractiveGuideline: true,
                        duration               : 1,
                        clipEdge               : true,
                        clipVoronoi            : false,
                        interpolate            : 'cardinal',
                        showLegend             : false,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            showMaxMin: false,
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%b %d')(date);
                            }
                        },
                        yAxis                  : {
                            showMaxMin: false
                        },
                        x2Axis                 : {
                            showMaxMin: false,
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%b %d')(date);
                            }
                        },
                        y2Axis                 : {
                            showMaxMin: false
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        },
                        legend                 : {
                            margin    : {
                                top   : 8,
                                right : 0,
                                bottom: 32,
                                left  : 0
                            },
                            rightAlign: false
                        }
                    }
                },
                data   : vm.pesaData.widget1.bigChart.chart
            },
            sessions          : {
                title   : vm.pesaData.widget1.sessions.title,
                value   : vm.pesaData.widget1.sessions.value,
                previous: vm.pesaData.widget1.sessions.previous,
                options : {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#03A9F4'],
                        height                 : 40,
                        margin                 : {
                            top   : 4,
                            right : 4,
                            bottom: 4,
                            left  : 4
                        },
                        isArea                 : true,
                        interpolate            : 'cardinal',
                        clipEdge               : true,
                        duration               : 500,
                        showXAxis              : false,
                        showYAxis              : false,
                        showLegend             : false,
                        useInteractiveGuideline: true,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%A, %B %d, %Y')(date);
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data    : vm.pesaData.widget1.sessions.chart
            },
            pageviews         : {
                title   : vm.pesaData.widget1.pageviews.title,
                value   : vm.pesaData.widget1.pageviews.value,
                previous: vm.pesaData.widget1.pageviews.previous,
                options : {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#3F51B5'],
                        height                 : 40,
                        margin                 : {
                            top   : 4,
                            right : 4,
                            bottom: 4,
                            left  : 4
                        },
                        isArea                 : true,
                        interpolate            : 'cardinal',
                        clipEdge               : true,
                        duration               : 500,
                        showXAxis              : false,
                        showYAxis              : false,
                        showLegend             : false,
                        useInteractiveGuideline: true,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%A, %B %d, %Y')(date);
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data    : vm.pesaData.widget1.pageviews.chart
            },
            pagesSessions     : {
                title   : vm.pesaData.widget1.pagesSessions.title,
                value   : vm.pesaData.widget1.pagesSessions.value,
                previous: vm.pesaData.widget1.pagesSessions.previous,
                options : {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#E91E63'],
                        height                 : 40,
                        margin                 : {
                            top   : 4,
                            right : 4,
                            bottom: 4,
                            left  : 4
                        },
                        isArea                 : true,
                        interpolate            : 'cardinal',
                        clipEdge               : true,
                        duration               : 500,
                        showXAxis              : false,
                        showYAxis              : false,
                        showLegend             : false,
                        useInteractiveGuideline: true,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%A, %B %d, %Y')(date);
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data    : vm.pesaData.widget1.pagesSessions.chart
            },
            avgSessionDuration: {
                title   : vm.pesaData.widget1.avgSessionDuration.title,
                value   : vm.pesaData.widget1.avgSessionDuration.value,
                previous: vm.pesaData.widget1.avgSessionDuration.previous,
                options : {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#009688'],
                        height                 : 40,
                        margin                 : {
                            top   : 4,
                            right : 4,
                            bottom: 4,
                            left  : 4
                        },
                        isArea                 : true,
                        interpolate            : 'cardinal',
                        clipEdge               : true,
                        duration               : 500,
                        showXAxis              : false,
                        showYAxis              : false,
                        showLegend             : false,
                        useInteractiveGuideline: true,
                        x                      : function (d)
                        {
                            return d.x;
                        },
                        y                      : function (d)
                        {
                            return d.y;
                        },
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                var date = new Date(new Date().setDate(new Date().getDate() + d));
                                return d3.time.format('%A, %B %d, %Y')(date);
                            }
                        },
                        yAxis                  : {
                            tickFormat: function (d)
                            {
                                var formatTime = d3.time.format('%M:%S');
                                return formatTime(new Date('2012', '0', '1', '0', '0', d));
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                },
                data    : vm.pesaData.widget1.avgSessionDuration.chart
            }
        };

        // Widget 4
        vm.widget4 = vm.pesaData.widget4;


        // Methods

        //////////
    }

})();