(function ()
{
    'use strict';

    angular
        .module('app.pesa.viajes')
        .controller('PesaViajesController', PesaViajesController);

    /** @ngInject */
    function PesaViajesController(DashboardData, uiGmapGoogleMapApi)
    {
        var vm = this;

        // Data
        vm.dashboardData = DashboardData;
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];

        vm.widget1 = {
            title             : vm.dashboardData.widget1.title,
            onlineUsers       : vm.dashboardData.widget1.onlineUsers,
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
                data   : vm.dashboardData.widget1.bigChart.chart
            },
            sessions          : {
                title   : vm.dashboardData.widget1.sessions.title,
                value   : vm.dashboardData.widget1.sessions.value,
                previous: vm.dashboardData.widget1.sessions.previous,
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
                data    : vm.dashboardData.widget1.sessions.chart
            },
            pageviews         : {
                title   : vm.dashboardData.widget1.pageviews.title,
                value   : vm.dashboardData.widget1.pageviews.value,
                previous: vm.dashboardData.widget1.pageviews.previous,
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
                data    : vm.dashboardData.widget1.pageviews.chart
            },
            pagesSessions     : {
                title   : vm.dashboardData.widget1.pagesSessions.title,
                value   : vm.dashboardData.widget1.pagesSessions.value,
                previous: vm.dashboardData.widget1.pagesSessions.previous,
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
                data    : vm.dashboardData.widget1.pagesSessions.chart
            },
            avgSessionDuration: {
                title   : vm.dashboardData.widget1.avgSessionDuration.title,
                value   : vm.dashboardData.widget1.avgSessionDuration.value,
                previous: vm.dashboardData.widget1.avgSessionDuration.previous,
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
                data    : vm.dashboardData.widget1.avgSessionDuration.chart
            }
        };

        // Widget 2
        vm.widget2 = {
            title: vm.dashboardData.widget2.title
        };

        // Widget 3
        vm.widget3 = {
            title       : vm.dashboardData.widget3.title,
            pages       : vm.dashboardData.widget3.pages,
            ranges      : vm.dashboardData.widget3.ranges,
            currentRange: vm.dashboardData.widget3.currentRange,
            changeRange : function (range)
            {
                vm.widget3.currentRange(range);
            }
        };

        // Widget 4
        vm.widget4 = vm.dashboardData.widget4;

         // Widget 6
        vm.widget6 = {
            title       : vm.dashboardData.widget6.title,
            mainChart   : {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type        : 'pieChart',
                        color       : ['#f44336', '#9c27b0', '#03a9f4', '#e91e63'],
                        height      : 400,
                        margin      : {
                            top   : 0,
                            right : 0,
                            bottom: 0,
                            left  : 0
                        },
                        donut       : true,
                        clipEdge    : true,
                        cornerRadius: 0,
                        labelType   : 'percent',
                        padAngle    : 0.02,
                        x           : function (d)
                        {
                            return d.label;
                        },
                        y           : function (d)
                        {
                            return d.value;
                        },
                        tooltip     : {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                },
                data   : []
            },
            footerLeft  : vm.dashboardData.widget6.footerLeft,
            footerRight : vm.dashboardData.widget6.footerRight,
            ranges      : vm.dashboardData.widget6.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget6.currentRange = range;

                /**
                 * Update main chart data by iterating through the
                 * chart dataset and separately adding every single
                 * dataset by hand.
                 *
                 * You MUST NOT swap the entire data object by doing
                 * something similar to this:
                 * vm.widget.mainChart.data = chartData
                 *
                 * It would be easier but it won't work with the
                 * live updating / animated charts due to how d3
                 * works.
                 *
                 * If you don't need animated / live updating charts,
                 * you can simplify these greatly.
                 */
                angular.forEach(vm.dashboardData.widget6.mainChart, function (data, index)
                {
                    vm.widget6.mainChart.data[index] = {
                        label: data.label,
                        value: data.values[range]
                    };
                });
            },
            init        : function ()
            {
                // Run this function once to initialize widget

                /**
                 * Update the range for the first time
                 */
                vm.widget6.changeRange('TW');
            }
        };


        // Methods

        //////////

        // Widget 2
        uiGmapGoogleMapApi.then(function ()
        {
            vm.widget2.map = vm.dashboardData.widget2.map;
        });

        // Initialize Widget 6
        vm.widget6.init();
    }

})();