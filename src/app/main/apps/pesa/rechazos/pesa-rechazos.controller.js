(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos')
        .controller('PesaRechazosController', PesaRechazosController);

    /** @ngInject */
    function PesaRechazosController($scope, $interval, $mdSidenav, PesaData)
    {
        var vm = this;

        // Data
        vm.pesaData = PesaData;
        vm.projects = vm.pesaData.projects;

        // Widget 1
        vm.widget1 = vm.pesaData.widget1;

        // Widget 2
        vm.widget2 = vm.pesaData.widget2;

        // Widget 3
        vm.widget3 = vm.pesaData.widget3;

        // Widget 4
        vm.widget4 = vm.pesaData.widget4;

        // Widget 5
        vm.widget5 = {
            title       : vm.pesaData.widget5.title,
            mainChart   : {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type        : 'multiBarChart',
                        color       : ['#03a9f4', '#b3e5fc'],
                        height      : 420,
                        margin      : {
                            top   : 8,
                            right : 16,
                            bottom: 32,
                            left  : 32
                        },
                        clipEdge    : true,
                        groupSpacing: 0.3,
                        reduceXTicks: false,
                        stacked     : true,
                        duration    : 250,
                        x           : function (d)
                        {
                            return d.x;
                        },
                        y           : function (d)
                        {
                            return d.y;
                        },
                        yAxis       : {
                            tickFormat: function (d)
                            {
                                return d;
                            }
                        },
                        legend      : {
                            margin: {
                                top   : 8,
                                bottom: 32
                            }
                        },
                        controls    : {
                            margin: {
                                top   : 8,
                                bottom: 32
                            }
                        },
                        tooltip     : {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                },
                data   : []
            },
            supporting  : {
                widgets: {
                    created  : {
                        data : vm.pesaData.widget5.supporting.created,
                        chart: {
                            data: []
                        }
                    },
                    closed   : {
                        data : vm.pesaData.widget5.supporting.closed,
                        chart: {
                            data: []
                        }
                    },
                    reOpened : {
                        data : vm.pesaData.widget5.supporting.reOpened,
                        chart: {
                            data: []
                        }
                    },
                    wontFix  : {
                        data : vm.pesaData.widget5.supporting.wontFix,
                        chart: {
                            data: []
                        }
                    },
                    needsTest: {
                        data : vm.pesaData.widget5.supporting.needsTest,
                        chart: {
                            data: []
                        }
                    },
                    fixed    : {
                        data : vm.pesaData.widget5.supporting.fixed,
                        chart: {
                            data: []
                        }
                    }
                },
                chart  : {
                    config : {
                        refreshDataOnly: true,
                        deepWatchData  : true
                    },
                    options: {
                        chart: {
                            type                   : 'lineChart',
                            color                  : ['#03A9F4'],
                            height                 : 50,
                            margin                 : {
                                top   : 8,
                                right : 0,
                                bottom: 0,
                                left  : 0
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
                            yDomain                : [0, 9],
                            xAxis                  : {
                                tickFormat: function (d)
                                {
                                    return vm.widget5.days[d];
                                }
                            },
                            interactiveLayer       : {
                                tooltip: {
                                    gravity: 'e',
                                    classes: 'gravity-e'
                                }
                            }
                        }
                    },
                    data   : []
                }
            },
            days        : ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'],
            ranges      : vm.pesaData.widget5.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget5.currentRange = range;

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
                angular.forEach(vm.pesaData.widget5.mainChart, function (chartData, index)
                {
                    vm.widget5.mainChart.data[index] = {
                        key   : chartData.key,
                        values: chartData.values[range]
                    };
                });

                /**
                 * Do the same thing for the supporting widgets but they
                 * only have 1 dataset so we can do [0] without needing to
                 * iterate through in their data arrays
                 */
                angular.forEach(vm.pesaData.widget5.supporting, function (widget, name)
                {
                    vm.widget5.supporting.widgets[name].chart.data[0] = {
                        key   : widget.chart.key,
                        values: widget.chart.values[range]
                    };
                });
            },
            init        : function ()
            {
                // Run this function once to initialize widget

                /**
                 * Update the range for the first time
                 */
                vm.widget5.changeRange('TW');
            }
        };

        // Widget 6
        vm.widget6 = {
            title       : vm.pesaData.widget6.title,
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
            footerLeft  : vm.pesaData.widget6.footerLeft,
            footerRight : vm.pesaData.widget6.footerRight,
            ranges      : vm.pesaData.widget6.ranges,
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
                angular.forEach(vm.pesaData.widget6.mainChart, function (data, index)
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

        // Widget 7
        vm.widget7 = {
            title       : vm.pesaData.widget7.title,
            ranges      : vm.pesaData.widget7.ranges,
            schedule    : vm.pesaData.widget7.schedule,
            currentRange: 'T'
        };

        // Widget 8
        vm.widget8 = {
            title    : vm.pesaData.widget8.title,
            mainChart: {
                options: {
                    chart: {
                        type     : 'pieChart',
                        color    : ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107'],
                        height   : 400,
                        margin   : {
                            top   : 0,
                            right : 0,
                            bottom: 0,
                            left  : 0
                        },
                        labelType: 'percent',
                        x        : function (d)
                        {
                            return d.label;
                        },
                        y        : function (d)
                        {
                            return d.value;
                        },
                        tooltip  : {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                },
                data   : vm.pesaData.widget8.mainChart
            }
        };

        // Widget 9
        vm.widget9 = {
            title       : vm.pesaData.widget9.title,
            weeklySpent : {
                title    : vm.pesaData.widget9.weeklySpent.title,
                count    : vm.pesaData.widget9.weeklySpent.count,
                chartData: []
            },
            totalSpent  : {
                title    : vm.pesaData.widget9.totalSpent.title,
                count    : vm.pesaData.widget9.totalSpent.count,
                chartData: []
            },
            remaining   : {
                title    : vm.pesaData.widget9.remaining.title,
                count    : vm.pesaData.widget9.remaining.count,
                chartData: []
            },
            totalBudget : vm.pesaData.widget9.totalBudget,
            chart       : {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type                   : 'lineChart',
                        color                  : ['#00BCD4'],
                        height                 : 50,
                        margin                 : {
                            top   : 8,
                            right : 0,
                            bottom: 0,
                            left  : 0
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
                        yDomain                : [0, 9],
                        xAxis                  : {
                            tickFormat: function (d)
                            {
                                return vm.widget9.days[d];
                            }
                        },
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 'e',
                                classes: 'gravity-e'
                            }
                        }
                    }
                }
            },
            days        : ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'],
            ranges      : vm.pesaData.widget9.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget9.currentRange = range;

                /**
                 * Update mini charts. They only have 1 dataset
                 * so we can do [0] without needing to iterate
                 * through in their data arrays
                 */
                vm.widget9.weeklySpent.chartData[0] = {
                    key   : vm.pesaData.widget9.weeklySpent.chart.label,
                    values: vm.pesaData.widget9.weeklySpent.chart.values[range]
                };

                vm.widget9.totalSpent.chartData[0] = {
                    key   : vm.pesaData.widget9.totalSpent.chart.label,
                    values: vm.pesaData.widget9.totalSpent.chart.values[range]
                };

                vm.widget9.remaining.chartData[0] = {
                    key   : vm.pesaData.widget9.remaining.chart.label,
                    values: vm.pesaData.widget9.remaining.chart.values[range]
                };
            },
            init        : function ()
            {
                // Run this function once to initialize widget

                /**
                 * Update the range for the first time
                 */
                vm.widget9.changeRange('TW');
            }
        };

        // Widget 10
        vm.widget10 = vm.pesaData.widget10;

        // Widget 11
        vm.widget11 = {
            title    : vm.pesaData.widget11.title,
            table    : vm.pesaData.widget11.table,
            dtOptions: {
                dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple',
                autoWidth : false,
                responsive: true,
                order     : [1, 'asc'],
                columnDefs: [
                    {
                        width    : '40',
                        orderable: false,
                        targets  : [0]
                    },
                    {
                        width  : '20%',
                        targets: [1, 2, 3, 4, 5]
                    }
                ]
            }
        };

        // Now widget
        vm.nowWidget = {
            now   : {
                second: '',
                minute: '',
                hour  : '',
                day   : '',
                month : '',
                year  : ''
            },
            ticker: function ()
            {
                var now = moment();
                vm.nowWidget.now = {
                    second : now.format('ss'),
                    minute : now.format('mm'),
                    hour   : now.format('HH'),
                    day    : now.format('D'),
                    weekDay: now.format('dddd'),
                    month  : now.format('MMMM'),
                    year   : now.format('YYYY')
                };
            }
        };

        // Weather widget
        vm.weatherWidget = vm.pesaData.weatherWidget;

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.selectProject = selectProject;

        //////////
        vm.selectedProject = vm.projects[0];

        // Initialize Widget 5
        vm.widget5.init();

        // Initialize Widget 6
        vm.widget6.init();

        // Initialize Widget 9
        vm.widget9.init();

        // Now widget ticker
        vm.nowWidget.ticker();

        var nowWidgetTicker = $interval(vm.nowWidget.ticker, 1000);

        $scope.$on('$destroy', function ()
        {
            $interval.cancel(nowWidgetTicker);
        });

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Select project
         */
        function selectProject(project)
        {
            vm.selectedProject = project;
        }
    }

})();