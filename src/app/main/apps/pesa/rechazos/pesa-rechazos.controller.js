(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos')
        .controller('PesaRechazosController', PesaRechazosController);


    //Parse raw data from table storage 
    function hasGraph(title,graphs)
    {
        for(var graph in graphs){
            var graphObj = graphs[graph];
            //console.log(graphObj);
            if(graphObj["Title"]==title){
                return graph;
            }
        }
        return -1;
    }  
    //Parse raw data from table storage 
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
        porFecha["Charts"] = [];
        for(var key in porFecha) {
            if(key != "Charts"){
                var pf = porFecha[key];
                //Calculate difference in dates to give the chart "x" value. 0=today, -1=yesterday, 1=tomorrow, ...
                var today = new Date();
                var parts = key.split("/")
                var date = new Date( parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]) );
                var timeDiff = date.getTime() - today.getTime();
                var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //Add to certain graph depending on rejection variable(s)
                for(var varKey in pf){
                    if(varKey != "Total"){
                        //console.log(key+" - "+date+" - "+daysDiff);
                        var dayData = pf[varKey];
                        var ind = hasGraph(varKey,porFecha["Charts"])
                        if(ind != -1){
                            var gr = porFecha["Charts"][ind];
                            gr["Cantidad"] += dayData.Cantidad;
                            gr["Value"] += dayData.Valor;                        
                            gr["Data"][0]["values"].push({"x":daysDiff, "y":dayData.Cantidad});
                            porFecha["Charts"][ind] = gr;
                        }
                        else{
                            var gr = {}
                            gr["Title"] = varKey;
                            gr["Cantidad"] = dayData.Cantidad;
                            gr["Value"] = dayData.Valor; 
                            gr["Data"] = [{"key":"Rechazos"}]; 
                            gr["Data"][0]["values"] = [];                      
                            gr["Data"][0]["values"].push({"x":daysDiff, "y":dayData.Cantidad});
                            porFecha["Charts"].push(gr);
                        }
                    }
                }
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
        for(var ind in porFecha["Charts"]) {
            var pfc = porFecha["Charts"][ind];
            pfc["Value"] /= pfc["Cantidad"];
            pfc["Value"] = pfc["Value"].toFixed(2);
            //console.log(pfc);
        }
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
    function PesaRechazosController(JsonData, VariableData, BananaData)
    {
        var vm = this; 
        //Get Data
        vm.jsonData = JsonData;
        var byDays = dataByDays(VariableData)
        //console.log(vm.jsonData)
        //console.log('variables: ', byDays);
        //console.log('bananas: ', BananaData);
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        //Assign data parsed to chart values
        vm.jsonData.widget1.bigChart.chart[0].values    = byDays.BigChart
        vm.jsonData.widget2.moho.chart[0].values        = byDays.Moho.Data
        vm.jsonData.widget2.madurez.chart[0].values     = byDays.Madurez.Data
        vm.jsonData.widget2.golpe.chart[0].values       = byDays.Golpe.Data
        vm.jsonData.widget2.patogeno.chart[0].values    = byDays.Patogeno.Data
        vm.jsonData.widget2.cochinilla.chart[0].values  = byDays.Cochinilla.Data
        vm.jsonData.widget2.tamano.chart[0].values      = byDays.Tamaño.Data
        vm.jsonData.widget2.hongo.chart[0].values       = byDays.Hongo.Data
        vm.jsonData.widget2.mordida.chart[0].values     = byDays.Mordida.Data
        //Assign average of each type. NaN if no data of certain variable
        vm.jsonData.widget2.moho.value                  = byDays.Moho.Avg
        vm.jsonData.widget2.madurez.value               = byDays.Madurez.Avg
        vm.jsonData.widget2.golpe.value                 = byDays.Golpe.Avg
        vm.jsonData.widget2.patogeno.value              = byDays.Patogeno.Avg
        vm.jsonData.widget2.cochinilla.value            = byDays.Cochinilla.Avg
        vm.jsonData.widget2.tamano.value                = byDays.Tamaño.Avg
        vm.jsonData.widget2.hongo.value                 = byDays.Hongo.Avg
        vm.jsonData.widget2.mordida.value               = byDays.Mordida.Avg

        //Widget 1
        vm.widget1 = {
            title             : vm.jsonData.widget1.title,
            bigChart          : {
                options: {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data   : vm.jsonData.widget1.bigChart.chart
            },
            
        };
        ////
        //Widget 2
        vm.widget2 = {
            title             : vm.jsonData.widget2.title,
            charts            : byDays.Charts,
            moho          : {
                title   : vm.jsonData.widget2.moho.title,
                value   : vm.jsonData.widget2.moho.value,
                previous: vm.jsonData.widget2.moho.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.moho.chart
            },
            madurez         : {
                title   : vm.jsonData.widget2.madurez.title,
                value   : vm.jsonData.widget2.madurez.value,
                previous: vm.jsonData.widget2.madurez.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.madurez.chart
            },
            golpe     : {
                title   : vm.jsonData.widget2.golpe.title,
                value   : vm.jsonData.widget2.golpe.value,
                previous: vm.jsonData.widget2.golpe.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.golpe.chart
            },
            patogeno: {
                title   : vm.jsonData.widget2.patogeno.title,
                value   : vm.jsonData.widget2.patogeno.value,
                previous: vm.jsonData.widget2.patogeno.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.patogeno.chart
            },
            cochinilla          : {
                title   : vm.jsonData.widget2.cochinilla.title,
                value   : vm.jsonData.widget2.cochinilla.value,
                previous: vm.jsonData.widget2.cochinilla.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.cochinilla.chart
            },
            tamano         : {
                title   : vm.jsonData.widget2.tamano.title,
                value   : vm.jsonData.widget2.tamano.value,
                previous: vm.jsonData.widget2.tamano.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.tamano.chart
            },
            hongo     : {
                title   : vm.jsonData.widget2.hongo.title,
                value   : vm.jsonData.widget2.hongo.value,
                previous: vm.jsonData.widget2.hongo.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.hongo.chart
            },
            mordida: {
                title   : vm.jsonData.widget2.mordida.title,
                value   : vm.jsonData.widget2.mordida.value,
                previous: vm.jsonData.widget2.mordida.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget2.mordida.chart
            }
        };    
        var graphColors = [['#03A9F4'],['#3F51B5'],['#E91E63'],['#009688']]        
        var n = 0;
        for(var ind in vm.widget2.charts) {
                    
            var graph = vm.widget2.charts[ind];            
            graph.Options = {
                chart: {
                    type                   : 'historicalBarChart',
                    color                  : graphColors[n%4],
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
            }
            vm.widget2.charts[ind] = graph;
            //console.log(vm.widget2.charts[ind]);
            n+=1;
        }
        ////
        //Widget 3
        vm.widget3 = {
            title             : vm.jsonData.widget3.title,
            sessions          : {
                title   : vm.jsonData.widget3.sessions.title,
                value   : vm.jsonData.widget3.sessions.value,
                previous: vm.jsonData.widget3.sessions.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget3.sessions.chart
            },
            pageviews         : {
                title   : vm.jsonData.widget3.pageviews.title,
                value   : vm.jsonData.widget3.pageviews.value,
                previous: vm.jsonData.widget3.pageviews.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget3.pageviews.chart
            },
            pagesSessions     : {
                title   : vm.jsonData.widget3.pagesSessions.title,
                value   : vm.jsonData.widget3.pagesSessions.value,
                previous: vm.jsonData.widget3.pagesSessions.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget3.pagesSessions.chart
            },
            avgSessionDuration: {
                title   : vm.jsonData.widget3.avgSessionDuration.title,
                value   : vm.jsonData.widget3.avgSessionDuration.value,
                previous: vm.jsonData.widget3.avgSessionDuration.previous,
                options : {
                    chart: {
                        type                   : 'historicalBarChart',
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
                data    : vm.jsonData.widget3.avgSessionDuration.chart
            }
        };
        ////

        // Methods

        //////////
    }

})();