(function ()
{
    'use strict';

    angular
        .module('app.pesa.muestreos')
        .controller('PesaMuestreosController', PesaMuestreosController);

    //Parse raw data from table storage 
    function getCable(date,numTravel,banData)
    {
        //console.log(banData);
        for(var banana in banData){
            banana = banData[banana];
            var bananaDate = new Date(banana["Time"]);
            if(banana["TravelNumber"]==numTravel && bananaDate.getDate()==date.getDate() && bananaDate.getMonth()==date.getMonth() && bananaDate.getFullYear()==date.getFullYear()){
                //console.log(banana);
                var cable = {
                    "grupo":banana["Group"],
                    "cable":banana["Cable"]
                };
                return cable;
            }
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
                }
                var fecha = new Date(variable["Time"]);
                //Create rejection object, assign data and add it to result
                var sampling = {}
                sampling["Fecha"] = fecha;
                sampling["NumViaje"] = variable["TravelNumber"];
                delete values[""];
                sampling["Variables"] = values;
                samplings.push(sampling);
            }
        };

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
        for(var sampling in samplings) {
            sampling = samplings[sampling];
            var samDate = sampling["Fecha"].toLocaleDateString('en-GB');
            var cable = getCable(sampling["Fecha"],sampling["NumViaje"],banData);
            cable = ("G"+cable.grupo+"-C"+cable.cable);
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
        //console.log(porFecha);
        return porFecha;
    }

    /** @ngInject */
    function PesaMuestreosController(JsonData, VariableData, BananaData)
    {
        var vm = this;

        // Data
        vm.jsonData = JsonData;
        var varData = dataByDays(VariableData,BananaData);
        //vm.jsonData.widget2.tabs = varData.Tabs;
        //console.log(varData.Tabs);
        // Widget 1
        vm.widget1 = {
            title: vm.jsonData.widget1.title,
            chart: {
                options: {
                    chart: {
                        type                   : 'multiBarChart',
                        color                  : ['#03A9F4','#3F51B5','#E91E63','#009688', '#ffff00', '#00ffff','#ff00ff'],
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
                data   : varData.BigChart
            }
        };

        //console.log(vm.jsonData.widget2);
        vm.widget2 = {
            title             : vm.jsonData.widget2.title,
            tabs              : varData.Tabs,
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
        
    }
})();