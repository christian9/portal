(function ()
{
    'use strict';

    angular
        .module('app.pesa.rechazos')
        .controller('PesaRechazosController', PesaRechazosController);

    //Parse raw data from table storage 
    function getTravel(date,numTravel, numRacimo,banData)
    {
        //console.log(banData);
        var primero = undefined;
        for(var banana in banData){
            banana = banData[banana];
            var bananaDate = new Date(banana["Time"]);
            if(numRacimo == 0){
                numRacimo = 1;
            }
            //console.log("Viaje: "+numTravel+", Racimo: "+numRacimo);
            if(banana["TravelNumber"]==numTravel && bananaDate.getDate()==date.getDate() && bananaDate.getMonth()==date.getMonth() && bananaDate.getFullYear()==date.getFullYear()){
                //console.log(banana);
                var travel = {};
                travel["Fecha"] = new Date(banana["Time"]);
                travel["Viaje"] = banana["TravelNumber"];
                travel["Grupo"] = banana["Group"];
                travel["Cable"] = banana["Cable"];
                travel["Carrero"] = banana["Carrero"];
                travel["Cuadrilla"] = banana["Cuadrilla"];
                travel["Mercado"] = banana["Market"];
                travel["Finca"] = banana["Finca"];
                travel["Embarque"] = banana["Shipment"];
                travel["Color"] = banana["Color"];
                if( banana["BananaNumber"]==numRacimo){
                    return travel;
                }
                else{
                    if(primero === undefined){
                        primero = travel;
                    }
                }
            }            
        }
        if(primero !== undefined){
            return primero;
        }
        else{
            var banana = banData[0];
            var travel = {};
            travel["Fecha"] = new Date(banana["Time"]);
            travel["Viaje"] = banana["TravelNumber"];
            travel["Grupo"] = banana["Group"];
            travel["Cable"] = banana["Cable"];
            travel["Carrero"] = banana["Carrero"];
            travel["Cuadrilla"] = banana["Cuadrilla"];
            travel["Mercado"] = banana["Market"];
            travel["Finca"] = banana["Finca"];
            travel["Embarque"] = banana["Shipment"];
            travel["Color"] = banana["Color"];
            return travel
        }

    }

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
    function dataByDays(varData, banData)
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
                rejection["Racimo"] = variable["BananaNumber"];
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
        var rejectionRows = [];
        for(var rejection in rejections) {
            rejection = rejections[rejection];
            var travel = getTravel(rejection["Fecha"], rejection["NumViaje"],rejection["Racimo"], banData)
            rejectionRows.push([
                {"value":rejection["Fecha"].toLocaleDateString('en-GB'),"classes":"","icon":""},
                {"value":rejection["NumViaje"],"classes":"","icon":""},
                {"value":rejection["Racimo"],"classes":"","icon":""},
                {"value":travel["Grupo"],"classes":"","icon":""},
                {"value":travel["Cable"],"classes":"","icon":""},
                {"value":travel["Color"],"classes":"","icon":""},
                {"value":travel["Cuadrilla"],"classes":"","icon":""},
                {"value":rejection["Causa"],"classes":"","icon":""},
                {"value":rejection["Valor"],"classes":"","icon":""}
            ]);
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
                //Add every rejection date to bigChart
                bigChart.push({"x":daysDiff, "y":pf.Total});
            }
        }
        for(var ind in porFecha["Charts"]) {
            var pfc = porFecha["Charts"][ind];
            pfc["Value"] /= pfc["Cantidad"];
            pfc["Value"] = pfc["Value"].toFixed(2);
            //console.log(pfc);
        }
        //Assign graphs and averages to same structure in case all the information is needed
        porFecha["BigChart"] = bigChart;
        porFecha["Rows"] = rejectionRows;
        //Return complete data
        return porFecha;
    }

    /** @ngInject */
    function PesaRechazosController(JsonData, VariableData, BananaData)
    {
        var vm = this; 
        //Get Data
        vm.jsonData = JsonData;
        var byDays = dataByDays(VariableData, BananaData)
        //console.log(vm.jsonData)
        //console.log('variables: ', byDays);
        //console.log('bananas: ', BananaData);
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        //Assign data parsed to chart values
        vm.jsonData.widget1.bigChart.chart[0].values    = byDays.BigChart
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
            charts            : byDays.Charts
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

        //Widget 5
        vm.widget5 = vm.jsonData.widget5
        vm.widget5.table.rows = byDays.Rows
        ////
        // Methods

        //////////
    }

})();