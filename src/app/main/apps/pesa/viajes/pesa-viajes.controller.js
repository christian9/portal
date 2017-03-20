(function ()
{
    'use strict';

    angular
        .module('app.pesa.viajes')
        .controller('PesaViajesController', PesaViajesController);


    function dataByDays(varData)
    {    
        var rejections = [];
        //console.log(varData);
        //1-Iterate through raw data to get logical rejections
        for (var variable in varData) {
            variable = varData[variable];
            if(variable["VariablesType"] == 0){ //It's a rejection!
                var values = {};
                //Parse String values into real rejection variable (moho, madurez, golpe, hongo, ...)
                var str = variable["StringValues"];
                var strlist = str.split("|");
                for (var strpair in strlist) {
                    strpair = strlist[strpair];
                    var pair = strpair.split(":");
                    values[pair[0]] = parseInt(pair[1]);
                }
                var fecha = new Date(variable["Time"]);
                //Create rejection object, assign data and add it to result
                var rejection = {}
                rejection["Fecha"] = fecha;
                rejection["Causa"] = Object.keys(values)[0];
                rejection["Valor"] = values[Object.keys(values)[0]];
                rejection["NumViaje"] = variable["TravelNumber"];
                rejections.push(rejection);
            }
        };

        //2-Order them using dates to get proper order on charts arrays. Otherwise, navigation through graph data won't work
        rejections.sort(function (x, y) {
            var a = x["Fecha"];
            var b = y["Fecha"];
            a = a.getTime();
            b = b.getTime();
            return a < b ? -1 : a > b ? 1 : 0;
        });

        //3-Get rejections in date-indexed dict to easily extract graph data
        var porFecha = {};
        for(var rejection in rejections) {
            rejection = rejections[rejection];
            var rejDate = rejection["Fecha"].toLocaleDateString('en-GB');
            if(porFecha[rejDate]){
                porFecha[rejDate]["Total"]+=1;
                if(porFecha[rejDate][rejection["Causa"]]){
                    porFecha[rejDate][rejection["Causa"]]["Cantidad"]+=1
                    porFecha[rejDate][rejection["Causa"]]["Valor"]+=rejection["Valor"]
                }
                else{
                    porFecha[rejDate][rejection["Causa"]]={}
                    porFecha[rejDate][rejection["Causa"]]["Cantidad"]=1
                    porFecha[rejDate][rejection["Causa"]]["Valor"]=rejection["Valor"]
                }
            } else {
                porFecha[rejDate] = {};
                porFecha[rejDate]["Total"]=1;
                if(porFecha[rejDate][rejection["Causa"]]){
                    porFecha[rejDate][rejection["Causa"]]["Cantidad"]+=1
                    porFecha[rejDate][rejection["Causa"]]["Valor"]+=rejection["Valor"]
                }
                else{
                    porFecha[rejDate][rejection["Causa"]]={}
                    porFecha[rejDate][rejection["Causa"]]["Cantidad"]=1
                    porFecha[rejDate][rejection["Causa"]]["Valor"]=rejection["Valor"]
                }
            }
        }
        
        //4-Create charts data arrays iterating through ordered & formatted data
        var bigChart = [];
        var moho = [];          var mohoTot = 0;        var mohoVal = 0;      
        var madurez = [];       var madurezTot = 0;     var madurezVal = 0;   
        var golpe = [];         var golpeTot = 0;       var golpeVal = 0;
        var patogeno = [];      var patogenoTot = 0;    var patogenoVal = 0;
        var cochinilla = [];    var cochinillaTot = 0;  var cochinillaVal = 0;
        var tamano = [];        var tamanoTot = 0;      var tamanoVal = 0;
        var mordida = [];       var mordidaTot = 0;     var mordidaVal = 0;
        var hongo = [];         var hongoTot = 0;       var hongoVal = 0;
        for(var key in porFecha) {
            var pf = porFecha[key];
            //Calculate difference in dates to give the chart "x" value. 0=today, -1=yesterday, 1=tomorrow, ...
            var today = new Date();
            var parts = key.split("/")
            var date = new Date( parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]) );
            var timeDiff = date.getTime() - today.getTime();
            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //Add to certain graph depending on rejection variable(s)
            if(pf.Moho){
                mohoTot += pf.Moho.Cantidad
                mohoVal += pf.Moho.Valor
                moho.push({"x":daysDiff, "y":pf.Moho.Cantidad});
            }
            if(pf.Madurez){
                madurezTot += pf.Madurez.Cantidad
                madurezVal += pf.Madurez.Valor
                madurez.push({"x":daysDiff, "y":pf.Madurez.Cantidad});
            }
            if(pf.Golpe){
                golpeTot += pf.Golpe.Cantidad
                golpeVal += pf.Golpe.Valor
                golpe.push({"x":daysDiff, "y":pf.Golpe.Cantidad});
            }
            if(pf.Patogeno){
                patogenoTot += pf.Patogeno.Cantidad
                patogenoVal += pf.Patogeno.Valor
                patogeno.push({"x":daysDiff, "y":pf.Patogeno.Cantidad});
            }
            if(pf.Mordida){
                mordidaTot += pf.Mordida.Cantidad
                mordidaVal += pf.Mordida.Valor
                mordida.push({"x":daysDiff, "y":pf.Mordida.Cantidad});
            }
            if(pf.Hongo){
                hongoTot += pf.Hongo.Cantidad
                hongoVal += pf.Hongo.Valor
                hongo.push({"x":daysDiff, "y":pf.Hongo.Cantidad});
            }
            if(pf.Tamaño){
                tamanoTot += pf.Tamaño.Cantidad
                tamanoVal += pf.Tamaño.Valor
                tamano.push({"x":daysDiff, "y":pf.Tamaño.Cantidad});
            }
            if(pf.Cochinilla){
                cochinillaTot += pf.Cochinilla.Cantidad
                cochinillaVal += pf.Cochinilla.Valor
                cochinilla.push({"x":daysDiff, "y":pf.Cochinilla.Cantidad});
            }
            //Add every rejection date to bigChart
            bigChart.push({"x":daysDiff, "y":pf.Total});
        }
        //Get average of each rejection type
        mohoVal         /=  mohoTot;      
        madurezVal      /=  madurezTot;   
        golpeVal        /=  golpeTot;
        patogenoVal     /=  patogenoTot;
        cochinillaVal   /=  cochinillaTot;
        tamanoVal       /=  tamanoTot;
        mordidaVal      /=  mordidaTot;
        hongoVal        /=  hongoTot;
        //Assign graphs and averages to same structure in case all the information is needed
        porFecha["BigChart"] = bigChart;
        porFecha["Mordida"] = {"Avg":mordidaVal, "Data":mordida};
        porFecha["Hongo"] = {"Avg":hongoVal, "Data":hongo};
        porFecha["Tamaño"] = {"Avg":tamanoVal, "Data":tamano};
        porFecha["Cochinilla"] = {"Avg":cochinillaVal, "Data":cochinilla};
        porFecha["Patogeno"] = {"Avg":patogenoVal, "Data":patogeno};
        porFecha["Golpe"] = {"Avg":golpeVal, "Data":golpe};
        porFecha["Madurez"] = {"Avg":madurezVal, "Data":madurez};
        porFecha["Moho"] = {"Avg":mohoVal, "Data":moho};
        //Return complete data
        return porFecha;
    }

    /** @ngInject */
    function PesaViajesController(DashboardData, VariableData, BananaData)
    {
        var vm = this;

        // Data
        vm.dashboardData = DashboardData;
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        var byDays = dataByDays(VariableData)

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