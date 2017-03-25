(function ()
{
    'use strict';

    angular
        .module('app.pesa.muestreos')
        .controller('PesaMuestreosController', PesaMuestreosController);

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
            if(graphObj["title"]==title){
                return graph;
            }
        }
        return -1;
    }   
    //Parse raw data from table storage 
    function dataByDays(varData,banData)
    {
        var samplings = [];
        var cols = {};
        //1-Iterate through raw data to get logical samplings
        for (var variable in varData) {
            variable = varData[variable];
            if(variable["VariablesType"] == 2){ //It's a sampling!
                var values = {};
                //Parse String values into real sampling variables (calibre, largo, manos, ...)
                var str = variable["StringValues"];
                var strlist = str.split("|");
                for (var strpair in strlist) {
                    strpair = strlist[strpair];
                    var pair = strpair.split(":");
                    values[pair[0]] = parseInt(pair[1]);
                    if(cols[pair[0]]){
                        cols[pair[0]]=pair[0]
                    }
                    else{
                        cols[pair[0]]=pair[0]
                    }
                }
                var fecha = new Date(variable["Time"]);
                //Create rejection object, assign data and add it to result
                var sampling = {}
                sampling["Fecha"] = fecha;
                sampling["Racimo"] = variable["BananaNumber"];
                sampling["NumViaje"] = variable["TravelNumber"];
                delete values[""];
                sampling["Variables"] = values;
                samplings.push(sampling);
            }
        }
        var samplingCols = [{"title":"Fecha"},{"title":"Viaje"},{"title":"Racimo"}];
        for(var key in cols){
            samplingCols.push({"title":key});
        }

        //2-Order them using dates to get proper order on charts arrays. Otherwise, navigation through graph data won't work
        samplings.sort(function (x, y) {
            var a = x["Fecha"];
            var b = y["Fecha"];
            a = a.getTime();
            b = b.getTime();
            return a < b ? -1 : a > b ? 1 : 0;
        });

        //3-Get samplings in date-indexed dict to easily extract graph data
        var porFecha = {};
        var porCable = {};
        var samplingRows = [];
        for(var sampling in samplings) {
            sampling = samplings[sampling];
            var samDate = sampling["Fecha"].toLocaleDateString('en-GB');
            var travel = getTravel(sampling["Fecha"],sampling["NumViaje"],sampling["Racimo"],banData);
            var row =[
                {"value":sampling["Fecha"].toLocaleDateString('en-GB'),"classes":"","icon":""},
                {"value":sampling["NumViaje"],"classes":"","icon":""},
                {"value":sampling["Racimo"],"classes":"","icon":""}
            ]
            for(var col in cols){
                row.push({"value":sampling["Variables"][col], "classes":"","icon":""})
            }
            samplingRows.push(row);
            var cable = ("G"+travel.Grupo+"-C"+travel.Cable);
            if(porFecha[samDate]){
                var variables = porFecha[samDate]["Variables"]
                for(var key in variables){
                    if(sampling["Variables"][key]){
                        variables[key] += sampling["Variables"][key];
                    }
                }
                porFecha[samDate]["Variables"] = variables;
                porFecha[samDate]["Cantidad"] += 1;
                if(porFecha[samDate][cable]){
                    var cableVariables = porFecha[samDate][cable]["Variables"]
                    for(var key in cableVariables){
                        if(sampling["Variables"][key]){
                            cableVariables[key] += sampling["Variables"][key];
                        }
                    }
                    porFecha[samDate][cable]["Variables"] = cableVariables;
                    porFecha[samDate][cable]["Cantidad"] += 1;
                }
                else {
                    porFecha[samDate][cable] = {};
                    porFecha[samDate][cable]["Variables"] = sampling["Variables"];
                    porFecha[samDate][cable]["Cantidad"] = 1;
                }
            } else {
                porFecha[samDate] = {};
                porFecha[samDate]["Variables"] = sampling["Variables"];
                porFecha[samDate]["Cantidad"] = 1;
                if(porFecha[samDate][cable]){
                    var cableVariables = porFecha[samDate][cable]["Variables"]
                    for(var key in cableVariables){
                        if(sampling["Variables"][key]){
                            cableVariables[key] += sampling["Variables"][key];
                        }
                    }
                    porFecha[samDate][cable]["Variables"] = cableVariables;
                    porFecha[samDate][cable]["Cantidad"] += 1;
                }
                else {
                    porFecha[samDate][cable] = {};
                    porFecha[samDate][cable]["Variables"] = sampling["Variables"];
                    porFecha[samDate][cable]["Cantidad"] = 1;
                }
            }
        }
        //Get average of each day's value
        for(var line in porFecha) {
            line = porFecha[line];        
            var variables = line["Variables"];
            for(var key in variables){
                variables[key] /= line["Cantidad"];
            }
            line["Variables"] = variables;
            for(var linep in line){
                if(linep != "Variables" && linep != "Cantidad"){
                    linep = line[linep]; 
                    var variablesp = linep["Variables"];               
                    for(var keyp in variablesp){
                        variablesp[keyp] /= linep["Cantidad"];
                    }
                    linep["Variables"] = variablesp;
                }
            }
        }
        var values = {};
        var graphVals = {};
        //4-Get graph data 
        for(var line in porFecha) {
            var lineo = porFecha[line];
            //Calculate difference in dates to give the chart "x" value. 0=today, -1=yesterday, 1=tomorrow, ...
            var today = new Date();
            var parts = line.split("/")
            var date = new Date( parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]) );
            var timeDiff = date.getTime() - today.getTime();
            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            //Iterate through variables to get bigchart data
            var variables = lineo["Variables"];
            for(var key in variables){
                if(values[key]){
                    values[key].push({"x":daysDiff,"y":variables[key]});
                }
                else{
                    values[key] = [];
                    values[key].push({"x":daysDiff,"y":variables[key]});
                }
            }
            //Iterate through variables to get tabs data
            for(var keyo in lineo){
                if(keyo != "Variables" && keyo != "Cantidad"){
                    var lineo2 = lineo[keyo]; 
                    var variables2 = lineo2["Variables"];    
                    if(graphVals[keyo]){                                  
                        for(var key2 in variables2){
                            var ind = hasGraph(key2,graphVals[keyo]);
                            if(ind != -1){
                                graph = graphVals[keyo][ind];
                                //console.log("YAESTABA ");
                                //console.log(graph);
                                graph["value"] += variables2[key2];
                                graph["cantidad"] += 1;
                                graph["chart"][0]["values"].push({"x":daysDiff,"y":variables2[key2]});
                                graphVals[keyo][ind] = graph;
                            }
                            else{
                                graph = {};
                                graph["title"] = key2;
                                graph["value"] = variables2[key2];
                                graph["cantidad"] = 1;
                                graph["chart"] = [{}];
                                graph["chart"][0]["key"] = "Promedio"
                                graph["chart"][0]["values"] = []
                                graph["chart"][0]["values"].push({"x":daysDiff,"y":variables2[key2]});
                                //console.log("NOESTABA ");
                                //console.log(graph);
                                graphVals[keyo].push(graph);
                            }
                        }
                    }
                    else{
                        graphVals[keyo] = [];                                 
                        for(var key2 in variables2){
                            var ind = hasGraph(key2,graphVals[keyo]);
                            if(ind != -1){
                                var graph = graphVals[keyo][ind];
                                graph["value"] += variables2[key2];
                                graph["cantidad"] += 1;
                                graph["chart"][0]["values"].push({"x":daysDiff,"y":variables2[key2]});
                                graphVals[keyo][ind] = graph;
                            }
                            else{
                                var graph = {};
                                graph["title"] = key2;
                                graph["value"] = variables2[key2];
                                graph["cantidad"] = 1;
                                graph["chart"] = [{}];
                                graph["chart"][0]["key"] = "Promedio";
                                graph["chart"][0]["values"] = [];
                                graph["chart"][0]["values"].push({"x":daysDiff,"y":variables2[key2]});
                                graphVals[keyo].push(graph);
                            }
                        }
                    } 
                }
            }

        }
        var bigChart = [];
        var tabs = [];
        //5-Create graph structures
        for(var val in values){
            bigChart.push({"key":val,"values":values[val]});
        }
        for(var graphVal in graphVals){
            var obj = graphVals[graphVal];
            for(var i in obj){
                var element = obj[i];
                element["value"] /= element["cantidad"];
                element["value"] = element["value"].toFixed(2);
                obj[i] = element;
            }
            tabs.push({"label":graphVal, "graphs":obj});
        }
        porFecha["BigChart"] = bigChart;
        porFecha["Tabs"] = tabs;
        porFecha["Rows"] = samplingRows;
        porFecha["Cols"] = samplingCols;
        //console.log(porFecha);
        return porFecha;
    }

    /** @ngInject */
    function PesaMuestreosController(JsonData, VariableData, BananaData)
    {
        var vm = this;

        // Data
        vm.jsonData = JsonData;
        var byDays = dataByDays(VariableData,BananaData);
        //vm.jsonData.widget2.tabs = byDays.Tabs;
        //console.log(byDays.Tabs);
        // Widget 1
        vm.widget1 = {
            title: vm.jsonData.widget1.title,
            chart: {
                options: {
                    chart: {
                        type                   : 'multiBarChart',
                        color                  : ['#03A9F4','#3F51B5','#E91E63','#009688'],
                        height                 : 320,
                        margin                 : {
                            top   : 32,
                            right : 32,
                            bottom: 32,
                            left  : 48
                        },
                        useInteractiveGuideline: true,
                        clipVoronoi            : false,
                        interpolate            : 'cardinal',
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
                                return d3.time.format('%b %d')(date);
                            },
                            showMaxMin: false
                        },
                        yAxis                  : {
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
                data   : byDays.BigChart
            }
        };

        //console.log(vm.jsonData.widget2);
        vm.widget2 = {
            title             : vm.jsonData.widget2.title,
            tabs              : byDays.Tabs,
        }
        //console.log(vm.widget2);

        var graphColors = [['#03A9F4'],['#3F51B5'],['#E91E63'],['#009688']]

        for(var tab in vm.widget2.tabs) {
            tab = vm.widget2.tabs[tab];
            //console.log(tab);
            var n = 0;
            for(var graph in tab.graphs) {
                          
                graph = tab.graphs[graph];
                graph.options = {
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
                        interactiveLayer       : {
                            tooltip: {
                                gravity: 's',
                                classes: 'gravity-s'
                            }
                        }
                    }
                };
                graph.data = graph.chart
                n+=1;
            }
        }
        
        //Widget 5
        vm.widget5 = vm.jsonData.widget5;
        vm.widget5.table.rows =byDays.Rows;
        vm.widget5.table.columns =byDays.Cols;
        
    }
})();