(function ()
{
    'use strict';

    angular
        .module('app.pesa.viajes')
        .controller('PesaViajesController', PesaViajesController);

    /** @ngInject */
    function PesaViajesController($state, $stateParams, $scope,JsonData, VariableData, BananaData)
    {
        var vm = this;
        vm.views = {
            main:       'app/main/apps/pesa/viajes/views/main/main.html',
            detalles:   'app/main/apps/pesa/viajes/views/detalles/detalles.html'
        };
        vm.defaultView = 'main';
        vm.currentView = 'main';
        vm.changeView = changeView;

        // Data
        vm.jsonData = JsonData;
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        var byDays = parseData(BananaData);
        //Widget 1
        vm.widget1 = {
            title             : vm.jsonData.widget1.title,
            bigChart          : {
                options: {
                    chart: {
                        showControls           : false,
                        type                   : 'multiBarChart',
                        color                  : ['#2196F3','#03A9F4','#3F51B5','#E91E63','#e91e63'],
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
                        },
                        callback: function(chart) {
                            //console.log(chart);
                            chart.multibar.dispatch.on('elementClick', function(e){
                                //console.log("Dispatch!");
                                //console.log('elementClick in callback', e.data);   
                                //console.log(e.data);
                                changeView("detalles",e.data);                            
                            });
                        }
                    }
                },
                data   : byDays.BigChart
            }
        };

        // Widget 2
        vm.widget2 = {
            title: vm.jsonData.widget2.title,
            charts: byDays.CableCharts
        };
        
        var graphColors = [['#03A9F4'],['#3F51B5'],['#E91E63'],['#009688']]        
        var n = 0;
        for(var ind in vm.widget2.charts) {
            var graph = vm.widget2.charts[ind];            
            graph.Options = {
                chart: {
                    type                   : 'multiBarChart',
                    color                  : graphColors[n%4],
                    height                 : 40,
                    margin                 : {
                        top   : 4,
                        right : 4,
                        bottom: 4,
                        left  : 4
                    },
                    showControls           : false,
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
                            return d;
                        }
                    },
                    interactiveLayer       : {
                        tooltip: {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                }
            }
            vm.widget2.charts[ind] = graph;
            //console.log(vm.widget2.charts[ind]);
            n+=1;
        }
         // Widget 3
        vm.widget3 = {
            title       : vm.jsonData.widget3.title,
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
            footerLeft  : byDays.PorCable.footerLeft,
            footerRight : byDays.PorCable.footerRight,
            ranges      : byDays.PorCable.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget3.currentRange = range;

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
                angular.forEach(byDays.PorCable.mainChart, function (data, index)
                {
                    vm.widget3.mainChart.data[index] = {
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
                vm.widget3.changeRange('A');
            }
        };
        // Widget 4
        vm.widget4 = {
            title       : vm.jsonData.widget4.title,
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
            footerLeft  : byDays.PorCuadrilla.footerLeft,
            footerRight : byDays.PorCuadrilla.footerRight,
            ranges      : byDays.PorCuadrilla.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget4.currentRange = range;

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
                angular.forEach(byDays.PorCuadrilla.mainChart, function (data, index)
                {
                    vm.widget4.mainChart.data[index] = {
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
                vm.widget4.changeRange('A');
            }
        };
        // Widget 5
        vm.widget5 = vm.jsonData.widget5;
        vm.widget5.table.rows = byDays.Rows;
        // Widget 6
        vm.widget6 = vm.jsonData.widget6;
        // Widget 7
        vm.widget7 = vm.jsonData.widget7;        

        // Initialize Widget 3
        vm.widget3.init();
        // Initialize Widget 4
        vm.widget4.init();     
        
        // FUNCTIONS
        /**
         * Change the view
         *
         * @param view
         * @param params
         */
        function changeView(view, params) {
            if( params ) {
                vm.params = params;
                setDetails(params);
            }
            if ( vm.views[view] ) {
                //console.log(view);
                vm.defaultView = view;
                vm.currentView = view;
                //console.log(vm.currentView);
            }

            d3.selectAll('.nvtooltip').remove();
            
            // Update the state without reloading the controller
            //$state.reload();
            //$state.transitionTo('app.pesa_viajes');
            $state.transitionTo($state.current, $stateParams, { 
                reload: true, inherit: false, notify: false 
            });
        }

        /**
         * Change details according to graph click
         *
         * @param params
         */
        function setDetails(params) {
            var daysDiff = params.x;
            var date = new Date(new Date().setDate(new Date().getDate() + daysDiff));
            var yest = new Date(new Date().setDate(new Date().getDate() + (daysDiff-1)));
            var strDate = date.toLocaleDateString('en-GB');
            var strYest = yest.toLocaleDateString('en-GB');
            var thisCableChart = byDays[strDate]["CableChart"];
            //console.log(thisCableChart);
            // Widget 8
            vm.widget8 = {
                title       : vm.jsonData.widget8.title,
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
                footerLeft  : thisCableChart.footerLeft,
                footerRight : thisCableChart.footerRight,
                ranges      : thisCableChart.ranges,
                currentRange: '',
                changeRange : function (range)
                {
                    vm.widget8.currentRange = range;

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
                    angular.forEach(thisCableChart.mainChart, function (data, index)
                    {
                        vm.widget8.mainChart.data[index] = {
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
                    vm.widget8.changeRange('A');
                }
            };  
            var thisCuadChart = byDays[strDate]["CuadChart"]; 
            //console.log(thisCuadChart);      
            // Widget 9
            vm.widget9 = {
                title       : vm.jsonData.widget9.title,
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
                footerLeft  : thisCuadChart.footerLeft,
                footerRight : thisCuadChart.footerRight,
                ranges      : thisCuadChart.ranges,
                currentRange: '',
                changeRange : function (range)
                {
                    vm.widget9.currentRange = range;

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
                    angular.forEach(thisCuadChart.mainChart, function (data, index)
                    {
                        vm.widget9.mainChart.data[index] = {
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
                    vm.widget9.changeRange('A');
                }
            };
            // Initialize Widget 8
            vm.widget8.init();
            // Initialize Widget 9
            vm.widget9.init(); 
            
            console.log(byDays);
            vm.widget6.detail.date = strDate + " & " + strYest;
            vm.widget7.detail.date = strDate + " & " + strYest;
            vm.widget6.data.count.DT = byDays[strDate].Cantidad;
            vm.widget7.data.count.DT = byDays[strDate].Peso;
            vm.widget6.detail.count  = byDays[strDate].Cantidad;
            vm.widget7.detail.count  = byDays[strDate].Peso;
            console.log(strDate);
            if(byDays[strYest]){
                console.log(strYest);
                vm.widget6.ranges["DY"] = "Anterior";
                vm.widget7.ranges["DY"] = "Anterior";
                vm.widget6.data.count.DY = byDays[strYest].Cantidad;
                vm.widget7.data.count.DY = byDays[strYest].Peso;
                vm.widget6.detail.count += byDays[strYest].Cantidad;
                vm.widget7.detail.count += byDays[strYest].Peso;
            }
            else{
                delete vm.widget6.ranges["DY"];
                delete vm.widget7.ranges["DY"];
            }
        }

        /**
         * Check if certain graph is already created
         *
         * @param title
         * @param graphs
         */
        function hasGraph(title,graphs) {
            for(var graph in graphs){
                var graphObj = graphs[graph];
                //console.log(graphObj);
                if(graphObj["Title"]==title){
                    return graph;
                }
            }
            return -1;
        }

        /**
         * Check if date obj @d is valid date
         *
         * @param d
         */
        function isValidDate(d) {
            if ( Object.prototype.toString.call(d) === "[object Date]" ) {
                // it is a date
                if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
  
        /**
         * Parse raw data @banData to show initial information
         *
         * @param banData
         */
        function parseData(banData) {
            // FOR - Work on every banana
            var travels = [];
            for (var banana in banData) {
                banana = banData[banana];
                //console.log(banana); 
                var newTravel = true;
                var fecha =  new Date(banana["Time"]);
                if(isValidDate(fecha)){
                    for (var travel in travels) {
                        travel = travels[travel];
                        if (travel["Fecha"].getDay() == fecha.getDay() && travel["Fecha"].getMonth() == fecha.getMonth() && travel["Fecha"].getFullYear() == fecha.getFullYear() && travel["Viaje"] == banana["TravelNumber"]) {
                            travel["PesoTotal"] += banana["Weight"];
                            travel["CantidadTotal"] += 1;
                            if (travel["Cantidad" + banana["Color"]]) {
                                travel["Cantidad" + banana["Color"]] += 1;
                            } else {
                                travel["Cantidad" + banana["Color"]] = 1;
                            }
                            if (travel["Peso" + banana["Color"]]) {
                                travel["Peso" + banana["Color"]] += banana["Weight"];
                            } else {
                                travel["Peso" + banana["Color"]] = banana["Weight"];
                            }
                            newTravel = false;
                            break;
                        }
                    };
                    if (newTravel) {
                        var travel = {}
                        travel["Fecha"] = fecha;
                        travel["Viaje"] = banana["TravelNumber"];
                        travel["Grupo"] = banana["Group"];
                        travel["Cable"] = banana["Cable"];
                        travel["Carrero"] = banana["Carrero"];
                        travel["Cuadrilla"] = banana["Cuadrilla"];
                        travel["Mercado"] = banana["Market"];
                        travel["Finca"] = banana["Finca"];
                        travel["Embarque"] = banana["Shipment"];
                        travel["Peso" + banana["Color"]] = banana["Weight"];
                        travel["Cantidad" + banana["Color"]] = 1;
                        travel["PesoTotal"] = banana["Weight"];
                        travel["CantidadTotal"] = 1;
                        travels.push(travel);
                    };
                }
            };
            ////// END FOR - Work on every banana

            // SORT
            travels.sort(function (x, y) {
                var a = x["Fecha"];
                var b = y["Fecha"];
                a = a.getTime();
                b = b.getTime();
                return a < b ? -1 : a > b ? 1 : 0;
            });
            ////// END SORT

            // FOR - Work on every travel
            var total = 0;
            var porFecha = {};
            var travelRows = [];
            for(var t in travels){
                var travel = travels[t];
                travelRows.push([
                    {"value":travel["Fecha"].toLocaleDateString('en-GB'),"classes":"","icon":""},
                    {"value":travel["Viaje"],"classes":"","icon":""},
                    {"value":travel["Finca"],"classes":"","icon":""},
                    {"value":travel["Grupo"],"classes":"","icon":""},
                    {"value":travel["Cable"],"classes":"","icon":""},
                    {"value":travel["Mercado"],"classes":"","icon":""},
                    {"value":travel["Embarque"],"classes":"","icon":""},
                    {"value":travel["Cuadrilla"],"classes":"","icon":""},
                    {"value":travel["Carrero"],"classes":"","icon":""},
                    {"value":travel["CantidadTotal"],"classes":"","icon":""},
                    {"value":travel["PesoTotal"],"classes":"","icon":""}
                ]);
                //console.log(travel)
                total += travel["CantidadTotal"];            
                var strDate = travel["Fecha"].toLocaleDateString('en-GB');
                if(porFecha[strDate]){
                    porFecha[strDate]["Cantidad"] += travel["CantidadTotal"];
                    porFecha[strDate]["Peso"] += travel["PesoTotal"];
                    if(porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]){
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Cantidad"]+=travel["CantidadTotal"]
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Peso"]+=travel["PesoTotal"]
                    }
                    else{
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]={}
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Cantidad"]=travel["CantidadTotal"]
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Peso"]=travel["PesoTotal"]
                    }
                    if(porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]){
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Cantidad"]+=travel["CantidadTotal"]
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Peso"]+=travel["PesoTotal"]
                    }
                    else{
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]={}
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Cantidad"]=travel["CantidadTotal"]
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Peso"]=travel["PesoTotal"]
                    }
                }
                else{
                    porFecha[strDate] = {};
                    porFecha[strDate]["Cantidad"] = travel["CantidadTotal"];
                    porFecha[strDate]["Peso"] = travel["PesoTotal"];
                    if(porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]){
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Cantidad"]+=travel["CantidadTotal"]
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Peso"]+=travel["PesoTotal"]
                    }
                    else{
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]={}
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Cantidad"]=travel["CantidadTotal"]
                        porFecha[strDate]["Grupo "+travel["Grupo"]+" - Cable "+travel["Cable"]]["Peso"]=travel["PesoTotal"]
                    }
                    if(porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]){
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Cantidad"]+=travel["CantidadTotal"]
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Peso"]+=travel["PesoTotal"]
                    }
                    else{
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]={}
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Cantidad"]=travel["CantidadTotal"]
                        porFecha[strDate]["Cuadrilla "+travel["Cuadrilla"]]["Peso"]=travel["PesoTotal"]
                    }
                }
            }
            ////// END FOR - Work on every travel

            // FOR - Work on every date
            porFecha["CableCharts"] = [];
            porFecha["CuadCharts"] = [];
            var bigChart = [{"key":"Racimos","values":[]}];
            for(var strDate in porFecha){
                if(strDate != "CableCharts" && strDate != "CuadCharts")  {
                    var pf = porFecha[strDate];
                    //Calculate difference in dates to give the chart "x" value. 0=today, -1=yesterday, 1=tomorrow, ...
                    var today = new Date();
                    var parts = strDate.split("/");
                    var date = new Date( parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]) );
                    var timeDiff = date.getTime() - today.getTime();
                    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    var cuadDayChart = { 
                        "ranges":{"A":"Todos"}, 
                        "mainChart":[]
                    }
                    var cableDayChart = {
                        "ranges":{"A":"Todos"}, 
                        "mainChart":[]
                    }
                    var total = pf.Cantidad;
                    var maximoCable = 0;
                    var maximoCuad = 0;
                    //Add to certain graph depending on rejection variable(s)
                    for(var cable in pf){
                        if(cable != "Cantidad" && cable != "Peso" && cable != "CableChart" && cable != "CuadChart"){
                            if(cable.indexOf("Grupo") > -1){
                                //console.log(key+" - "+date+" - "+daysDiff);
                                var cableData = pf[cable];
                                if(cableData.Cantidad > maximoCable){
                                    maximoCable = cableData.Cantidad;
                                }
                                cableDayChart["mainChart"].push( {"label":cable, "values":{"A":cableData.Cantidad}} );
                                var ind = hasGraph(cable,porFecha["CableCharts"])
                                if(ind != -1){
                                    var gr = porFecha["CableCharts"][ind];
                                    gr["Cantidad"] += cableData.Cantidad;
                                    gr["Value"] += cableData.Peso;
                                    gr["Data"][0]["values"].push({"x":daysDiff, "y":cableData.Cantidad});
                                    porFecha["CableCharts"][ind] = gr;
                                }
                                else{
                                    var gr = {}
                                    gr["Title"] = cable;
                                    gr["Cantidad"] = cableData.Cantidad;
                                    gr["Value"] = cableData.Peso; 
                                    gr["Data"] = [{"key":"Racimos", "values":[]}];                    
                                    gr["Data"][0]["values"].push({"x":daysDiff, "y":cableData.Cantidad});
                                    porFecha["CableCharts"].push(gr);
                                }
                            }
                            else{
                                //console.log(key+" - "+date+" - "+daysDiff);
                                var cuadData = pf[cable];
                                if(cuadData.Cantidad > maximoCuad){
                                    maximoCuad = cuadData.Cantidad;
                                }
                                cuadDayChart["mainChart"].push( {"label":cable, "values":{"A":cuadData.Cantidad}} );
                                var ind = hasGraph(cable,porFecha["CuadCharts"])
                                if(ind != -1){
                                    var gr = porFecha["CuadCharts"][ind];
                                    gr["Cantidad"] += cuadData.Cantidad;
                                    gr["Value"] += cuadData.Peso;
                                    gr["Data"][0]["values"].push({"x":daysDiff, "y":cuadData.Cantidad});
                                    porFecha["CuadCharts"][ind] = gr;
                                }
                                else{
                                    var gr = {}
                                    gr["Title"] = cable;
                                    gr["Cantidad"] = cuadData.Cantidad;
                                    gr["Value"] = cuadData.Peso;
                                    gr["Data"] = [{"key":"Racimos", "values":[]}];
                                    gr["Data"][0]["values"].push({"x":daysDiff, "y":cuadData.Cantidad});
                                    porFecha["CuadCharts"].push(gr);
                                }
                            }
                        }
                    }
                    cableDayChart["footerLeft"] = {"title":"Total","count":{"A":total}};
                    cableDayChart["footerRight"] = {"title":"Máximo","count":{"A":maximoCable}};  
                    cuadDayChart["footerLeft"] = {"title":"Total","count":{"A":total}};
                    cuadDayChart["footerRight"] = {"title":"Máximo","count":{"A":maximoCuad}};  
                    pf["CableChart"] = cableDayChart;
                    pf["CuadChart"] = cuadDayChart;
                    porFecha[strDate] = pf;
                    bigChart[0]["values"].push({"x":daysDiff, "y":pf["Cantidad"]});
                }
            }
            ///// END FOR - Work on every date

            // FOR - Work on every cable chart
            var porCable = {
                "ranges":{"A":"Todos"}, 
                "mainChart":[]
            }
            var maximo1 = 0;
            for(var c in porFecha["CableCharts"]){
                var chart = porFecha["CableCharts"][c];
                chart["Value"] /= chart["Cantidad"];
                porCable["mainChart"].push( {"label":chart["Title"], "values":{"A":chart["Cantidad"]}} );
                if(chart["Cantidad"]>maximo1){
                    maximo1 = chart["Cantidad"];
                }
            }
            porCable["footerLeft"] = {"title":"Total","count":{"A":total}};
            porCable["footerRight"] = {"title":"Máximo","count":{"A":maximo1}};            
            ////// ENDFOR - Work on every cable chart

            // FOR - Work on every cuadrilla chart
            var porCuad = { 
                "ranges":{"A":"Todos"}, 
                "mainChart":[]
            }
            var maximo2 = 0;
            for(var c in porFecha["CuadCharts"]){
                var chart = porFecha["CuadCharts"][c];
                chart["Value"] /= chart["Cantidad"];
                porCuad["mainChart"].push( {"label":chart["Title"], "values":{"A":chart["Cantidad"]}} );
                if(chart["Cantidad"]>maximo2){
                    maximo2 = chart["Cantidad"];
                }
            }
            porCuad["footerLeft"] = {"title":"Total","count":{"A":total}};
            porCuad["footerRight"] = {"title":"Máximo","count":{"A":maximo2}};
            ////// END FOR - Work on every cuadrilla chart

            porFecha["Viajes"] = travels;
            porFecha["BigChart"] = bigChart;
            porFecha["PorCable"] = porCable;
            porFecha["PorCuadrilla"] = porCuad;
            porFecha["Rows"] = travelRows;
            return porFecha;
        }
        ////// END FUNCTIONS
    }

})();