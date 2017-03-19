//Import
//var azurestorage = require('azure');

//module.exports = DataController;

function DataController() {
    var accessKey = 'M5NrLOTvqo/7QJ1FauTMQVdqYSyKw2sL83pmEGFVLudQKm5ztrJUOZqTBALcwrc908e6ejzPyWTdtXMrJZUZBQ==';
    var storageAccount = 'sgapesaelectronica';
    var tableSvc = azurestorage.createTableService(storageAccount, accessKey, azurestorage.StorageHost);
    this.storageClient = tableSvc;
    this.bananaTable = 'Banano';
    this.variableTable = 'Variable';
    this.partitionKey = 'TravelNumber';
    this.storageClient.createTableIfNotExists(bananaTable, function tableCreated(error) {
        if (error) {
            console.log("Error accediendo la tabla: " + error);
            throw error; 
        }
    });
    this.storageClient.createTableIfNotExists(variableTable, function tableCreated(error) {
        if (error) {
            console.log("Error accediendo la tabla: " + error);
            throw error;
        }
    });
};

DataController.prototype = {
    findRejections: function (query, callback) {
        self = this;
        queryRVariables(self, query, callback, fillRejectionVariables);
    },
    findTravels: function (query, callback) {
        self = this;
        queryTBananas(self, query, callback, queryTVariables);
    }
}

function queryRVariables(obj, query, callback, aftercall) {
    var variableList = [];
    obj.storageClient.queryEntities(obj.variableTable, query, null, function entitiesQueried(error, result) {
        if (error) {
            callback(error);
        } else {
            obj.variables = result.entries;
            //console.log('Variables: ' + JSON.stringify(obj.variables));
            //fillRejectionVariables
            aftercall(obj, callback)
        }
    });
}

function fillRejectionVariables(obj, aftercall) {
    var rejections = [];
    var variables = obj.variables;
    for (var variable in variables) {
        variable = variables[variable];
        if(variable["VariablesType"]["_"] == 0){ //It's a rejection!
            var values = {};
            var str = variable["StringValues"]["_"];
            var strlist = str.split("|");
            for (var strpair in strlist) {
                strpair = strlist[strpair];
                var pair = strpair.split(":");
                values[pair[0]] = parseInt(pair[1]);
            }
            var fecha = variable["Time"]["_"];
            var rejection = {}
            rejection["Fecha"] = fecha;
            rejection["Causa"] = Object.keys(values)[0];
            rejection["Valor"] = values[Object.keys(values)[0]];
            rejection["NumViaje"] = variable["TravelNumber"]["_"];
            rejections.push(rejection);
        }
    };
    rejections.sort(function (x, y) {
        var a = x["Fecha"];
        var b = y["Fecha"];
        a = a.getTime();
        b = b.getTime();
        return a > b ? -1 : a < b ? 1 : 0;
    });
    var porCausa = {};
    var porFecha = {};
    var porViaje = {};
    for(var rejection in rejections) {
        rejection = rejections[rejection]
        if(porCausa[rejection["Causa"]]){
            porCausa[rejection["Causa"]]["Cantidad"]+=1;
        } else {
            porCausa[rejection["Causa"]] = {};
            porCausa[rejection["Causa"]]["Cantidad"]=1;
        }
        var rejDate = rejection["Fecha"].toLocaleDateString('en-GB')        
        if(porFecha[rejDate]){
            porFecha[rejDate]["Cantidad"]+=1;
        } else {
            porFecha[rejDate] = {};
            porFecha[rejDate]["Cantidad"]=1;
        }
        if(porViaje[rejDate+"|"+rejection["NumViaje"]]){
            porViaje[rejDate+"|"+rejection["NumViaje"]]["Cantidad"]+=1;
        } else {
            porViaje[rejDate+"|"+rejection["NumViaje"]] = {};
            porViaje[rejDate+"|"+rejection["NumViaje"]]["Cantidad"]=1;
        }
    }
    obj.rechazos = rejections;
    obj.rechazosPorViaje = porViaje;
    obj.rechazosPorCausa = porCausa;
    obj.rechazosPorFecha = porFecha;
    // initial callback
    aftercall(null, obj.rechazos, obj.rechazosPorViaje, obj.rechazosPorCausa, obj.rechazosPorFecha)
}

function queryTBananas(obj, query, callback, aftercall) {
    obj.storageClient.queryEntities(obj.bananaTable, query, null, function entitiesQueried(error, result) {
        if (error) {
            callback(error);
        } else {
            obj.bananas = result.entries;
            //console.log('Bananas: ' + JSON.stringify(obj.bananaList));
			//queryVariables
            aftercall(obj, query, callback, fillTravelsBananas);
        }
    });
}
function queryTVariables(obj, query, callback, aftercall) {
    obj.storageClient.queryEntities(obj.variableTable, query, null, function entitiesQueried(error, result) {
        if (error) {
            callback(error);
        } else {
            obj.variables = result.entries;
            //console.log('Variables: ' + JSON.stringify(obj.variableList));
			//fillTravelsBananas
            aftercall(obj, callback, fillTravelsVariables)
        }
    });
}
function fillTravelsBananas(obj, callback, aftercall) {
    var travels = [];
    var bananas = obj.bananas;
    for (var banana in bananas) {
        banana = bananas[banana];
        newTravel = true;
        var fecha = banana["Time"]["_"];
        for (var travel in travels) {
            travel = travels[travel];
            if (travel["Fecha"].getDay() == fecha.getDay() && travel["Fecha"].getMonth() == fecha.getMonth() && travel["Viaje"] == banana["TravelNumber"]["_"]) {
                travel["Total"] += banana["Weight"]["_"];
                travel["NumTotal"] += 1;
                if (travel["Cantidad" + banana["Color"]["_"]]) {
                    travel["Cantidad" + banana["Color"]["_"]] += 1;
                } else {
                    travel["Cantidad" + banana["Color"]["_"]] = 1;
                }
                if (travel["Peso" + banana["Color"]["_"]]) {
                    travel["Peso" + banana["Color"]["_"]] += banana["Weight"]["_"];
                } else {
                    travel["Peso" + banana["Color"]["_"]] = banana["Weight"]["_"];
                }
                newTravel = false;
                break;
            }
        };
        if (newTravel) {
            var travel = {}
            travel["Fecha"] = fecha;
            travel["Viaje"] = banana["TravelNumber"]["_"];
            travel["Grupo"] = banana["Group"]["_"];
            travel["Cable"] = banana["Cable"]["_"];
            travel["Carrero"] = banana["Carrero"]["_"];
            travel["Cuadrilla"] = banana["Cuadrilla"]["_"];
            travel["Mercado"] = banana["Market"]["_"];
            travel["Finca"] = banana["Finca"]["_"];
            travel["Embarque"] = banana["Shipment"]["_"];
            travel["Peso" + banana["Color"]["_"]] = banana["Weight"]["_"];
            travel["Cantidad" + banana["Color"]["_"]] = 1;
            travel["Total"] = banana["Weight"]["_"];
            travel["NumTotal"] = 1;
            travels.push(travel);
        };
    };
    obj.viajes = travels;
	//fillTravelsVariables
    aftercall(obj, callback);
}
function fillTravelsVariables(obj, aftercall) {
    var variables = obj.variables;
    for (var variable in variables) {
        variable = variables[variable];
        var travels = obj.viajes;
        var values = {};
        var str = variable["StringValues"]["_"];
        var strlist = str.split("|");
        var var1name = "";
        var var2name = "";
        var i = 0;
        for (var strpair in strlist) {
            strpair = strlist[strpair];
            var pair = strpair.split(":");
            values[pair[0]] = parseInt(pair[1]);
            if (i == 0) {
                var1name = pair[0];
            } else if (i == 1) {
                var2name = pair[0];
            }
            i += 1;
        }
        var fecha = variable["Time"]["_"];
        for (var travel in travels) {
            travel = travels[travel];
            if (travel["Fecha"].getDay() == fecha.getDay() && travel["Fecha"].getMonth() == fecha.getMonth() && travel["Viaje"] == variable["TravelNumber"]["_"] && variable["VariablesType"]["_"] == 0) { //Rejection
                if (travel["Rechazos"]) {
                    travel["Rechazos"] += 1;
                } else {
                    travel["Rechazos"] = 1;
                }
            } else if (travel["Fecha"].getDay() == fecha.getDay() && travel["Fecha"].getMonth() == fecha.getMonth() && travel["Viaje"] == variable["TravelNumber"]["_"] && variable["VariablesType"]["_"] == 2) { //Sampling
                if (travel["Var1Name"] && travel["Var2Name"]) {
                    travel["Var1Value"] += values[var1name];
                    travel["Var2Value"] += values[var2name];
                    travel["Var1Amount"] += 1;
                    travel["Var2Amount"] += 1;
                } else {
                    travel["Var1Name"] = var1name;
                    travel["Var2Name"] = var2name;
                    travel["Var1Value"] = values[var1name];
                    travel["Var2Value"] = values[var2name];
                    travel["Var1Amount"] = 1;
                    travel["Var2Amount"] = 1;
                }
            }
        };
        for (var travel in travels) {
            travel = travels[travel];
            if(travel["Var1Value"] && travel["Var1Amount"] && travel["Var1Value"] != NaN) {
                travel["Var1Value"] /= travel["Var1Amount"];
            } else {
                travel["Var1Value"] = NaN;
                travel["Var1Amount"] = 0;
            }
            if(travel["Var2Value"] && travel["Var2Amount"] && travel["Var2Value"] != NaN) {
                travel["Var2Value"] /= travel["Var2Amount"];
            } else {
                travel["Var2Value"] = NaN;
                travel["Var2Amount"] = 0;
            }
            if (!travel["Rechazos"]) {
                travel["Rechazos"] = 0;
            }
        }
        obj.viajes = travels;
    };
    obj.viajes.sort(function (x, y) {
        var a = x["Fecha"];
        var b = y["Fecha"];
        a = a.getTime();
        b = b.getTime();
        return a > b ? -1 : a < b ? 1 : 0;
    });
    var viajes = obj.viajes;
    var porCable = {};
    var porEmbarque = {};
    for(var viaje in viajes){
        viaje = viajes[viaje];
        if(porCable[viaje["Grupo"]+","+viaje["Cable"]]){
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Viajes"] += 1;
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Peso"] += viaje["Total"];
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Cantidad"] += viaje["NumTotal"];
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Rechazos"] += viaje["Rechazos"];
            if(viaje["Var1Amount"]>0){
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var1Value"] += viaje["Var1Value"];
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var1Amount"] += 1;
            }
            if(viaje["Var2Amount"]>0){
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var2Value"] += viaje["Var2Value"];
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var2Amount"] += 1;
            }
        } else {
            porCable[viaje["Grupo"]+","+viaje["Cable"]] = {};
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Fecha"] = viaje["Fecha"];
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Viajes"] = 1;
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Peso"] = viaje["Total"];
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Cantidad"] = viaje["NumTotal"];
            porCable[viaje["Grupo"]+","+viaje["Cable"]]["Rechazos"] = viaje["Rechazos"];
            if(viaje["Var1Amount"]>0){
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var1Value"] = viaje["Var1Value"];
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var1Amount"] = 1;
            }
            if(viaje["Var2Amount"]>0){
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var2Value"] = viaje["Var2Value"];
                porCable[viaje["Grupo"]+","+viaje["Cable"]]["Var2Amount"] = 1;
            }
        } 
        if(porEmbarque[viaje["Embarque"]]){
            porEmbarque[viaje["Embarque"]]["Viajes"] += 1;
            porEmbarque[viaje["Embarque"]]["Peso"] += viaje["Total"];
            porEmbarque[viaje["Embarque"]]["Cantidad"] += viaje["NumTotal"];
            porEmbarque[viaje["Embarque"]]["Rechazos"] += viaje["Rechazos"];
            if(viaje["Var1Amount"]>0){
                porEmbarque[viaje["Embarque"]]["Var1Value"] += viaje["Var1Value"];
                porEmbarque[viaje["Embarque"]]["Var1Amount"] += 1;
            }
            if(viaje["Var2Amount"]>0){
                porEmbarque[viaje["Embarque"]]["Var2Value"] += viaje["Var2Value"];
                porEmbarque[viaje["Embarque"]]["Var2Amount"] += 1;
            }
        } else {
            porEmbarque[viaje["Embarque"]] = {};
            porEmbarque[viaje["Embarque"]]["Fecha"] = viaje["Fecha"];
            porEmbarque[viaje["Embarque"]]["Viajes"] = 1;
            porEmbarque[viaje["Embarque"]]["Peso"] = viaje["Total"];
            porEmbarque[viaje["Embarque"]]["Cantidad"] = viaje["NumTotal"];
            porEmbarque[viaje["Embarque"]]["Rechazos"] = viaje["Rechazos"];
            if(viaje["Var1Amount"]>0){
                porEmbarque[viaje["Embarque"]]["Var1Value"] = viaje["Var1Value"];
                porEmbarque[viaje["Embarque"]]["Var1Amount"] = 1;
            }
            if(viaje["Var2Amount"]>0){
                porEmbarque[viaje["Embarque"]]["Var2Value"] = viaje["Var2Value"];
                porEmbarque[viaje["Embarque"]]["Var2Amount"] = 1;
            }
        }
    }
    for(var line in porEmbarque) {
        line = porEmbarque[line];
        line["Var1Value"] /= line["Var1Amount"];
        line["Var2Value"] /= line["Var2Amount"];
    }
    for(var line in porCable) {
        line = porCable[line];
        line["Var1Value"] /= line["Var1Amount"];
        line["Var2Value"] /= line["Var2Amount"];
    }
    obj.viajesPorCable = porCable;
    obj.viajesPorEmbarque = porEmbarque;
	//initial callback
    aftercall(null, obj.viajes, obj.viajesPorEmbarque, obj.viajesPorCable);
}