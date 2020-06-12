"use strict";

var app = angular.module("indexApp",['ngRoute']);
var billetes;
var fechaIda;
var fechaVuelta;
var soloIda;

var arrayVuelos = [];
var vuelosIda = [];
var vuelosVuelta = [];

// Asignación de direcciones y controladores
app.config(function($routeProvider) { 
    $routeProvider. 
    when('/', {
        controller: 'mainCtrl',
        templateUrl: 'main.html' 
    }).
    when('/listaVuelos/:orig/:dest', { 
        controller: 'vuelosCtrl', 
        templateUrl: 'vuelos.html'
    }). 
    otherwise({
        redirectTo: '/'
    });
})

// Controlador de la página principal
app.controller("mainCtrl", function($scope){
    // Guarda en variables globales los valores de las variables del scope
    // para pasarlas a la página de vuelos.

    $scope.initialize = function() {

    }

    //$scope.updateTipoBillete = function(tipo) {
    //soloIda = tipo;
    //}

    $scope.updateBilletes = function() {
        billetes = $scope.inputBilletes;
    }

    $scope.updateFechaIda = function() {
        fechaIda = $scope.inputIda + $scope.inputIda.getTimezoneOffset();
    }

    $scope.updateFechaVuelta = function() {
        fechaVuelta = $scope.inputVuelta + $scope.inputVuelta.getTimezoneOffset();
    }

    $scope.initialize();
});

app.controller("vuelosCtrl", function($scope,$routeParams,$http){

    $scope.initialize = function() {
        // Metemos las variables globales en el scope
        $scope.selectedOrder = 'origen';

        if(!billetes) {
            $scope.numBilletes = 1;
        } else {
            $scope.numBilletes = billetes;
        }

        $scope.fechaIda = new Date(fechaIda.slice(4,15));
        $scope.fechaVuelta = new Date(fechaVuelta.slice(4,15));

        $scope.soloIda = soloIda;

        $scope.stringIda = "";
        $scope.stringVuelta = "";

        // Array de precios de cada opción
        $scope.precios = [];
        $scope.itemCounter = 0;
        
        $scope.showBilleteComprado = false;
    }

    // Origen del vuelo
    $scope.vuelosOrigen = $routeParams.orig;
    // Destino del vuelo
    $scope.vuelosDestino = $routeParams.dest;


    $scope.data = {};
    $scope.error = "JSON cargado con éxito";

    // Importación de los datos del JSON
    $http.get("vuelos.json").then(

        function(response){
            $scope.data = response.data.vuelos;
            $scope.calcIdasVueltas();
        },
        function(response){
            $scope.error = "No se pudo cargar el JSON. Asegúrate de que se encuentra en el directorio correspondiente.";
        }
    );

    $scope.initialize();

    // Tomamos la lista de vuelos y los dividimos en una lista de vuelos que vayan desde en origen hasta el destino escogidos; y otra que tenga los vuelos que hagan la ruta inversa.
    $scope.calcIdasVueltas = function() {
        arrayVuelos = $scope.data;

        // Variable auxiliar para no crear "huecos" en los arrays.
        var a = 0;

        for(var i = 0 ; i < arrayVuelos.length ; i++) {
            if(arrayVuelos[i].origen == $scope.vuelosOrigen && arrayVuelos[i].destino == $scope.vuelosDestino) {
                vuelosIda[a] = arrayVuelos[i];
                a++;
            }
        }

        a = 0;
        for(i = 0 ; i < arrayVuelos.length ; i++) {
            if(arrayVuelos[i].origen == $scope.vuelosDestino && arrayVuelos[i].destino == $scope.vuelosOrigen) {
                vuelosVuelta[a] = arrayVuelos[i];
                a++;
            }
        }
    }

    // Buscador de vuelos

    $scope.dateManager = function(item) {
        var out = false;
        

        // Tomamos el día de salida seleccionado, ajustando para el cambio horario
        var formatIdaSeleccionada = new Date(fechaIda.slice(4,15));
        formatIdaSeleccionada.setDate(formatIdaSeleccionada.getDate() + 1);
        formatIdaSeleccionada = formatIdaSeleccionada.toISOString();
        formatIdaSeleccionada = formatIdaSeleccionada.slice(0,10);

        // Igual pero para el vuelo de salida
        var formatIdaVuelo = item.salida.slice(0,10);

        if($scope.soloIda) {
            // Si es un billete de solo ida
            if(formatIdaSeleccionada == formatIdaVuelo) {
                $scope.precioBus = item.bussiness * $scope.numBilletes;
                $scope.precioOpt = item.optima * $scope.numBilletes;
                $scope.precioEco = item.economy * $scope.numBilletes;
                $scope.horaIda = item.salida.slice(11,16);

                $scope.precios[$scope.itemCounter] = [$scope.precioBus , $scope.precioOpt , $scope.precioEco];

                console.log($scope.precios);
                $scope.itemCounter += 1;

                out = true;
            } else {
                out = false;
            }
        } else {
            // Si es de ida y vuelta

            // Tomamos el día de vuelta seleccionado
            var formatVueltaSeleccionada = new Date(fechaVuelta.slice(4,15));
            formatVueltaSeleccionada.setDate(formatVueltaSeleccionada.getDate() + 1);
            formatVueltaSeleccionada = formatVueltaSeleccionada.toISOString();
            formatVueltaSeleccionada = formatVueltaSeleccionada.slice(0,10);

            // ¿La salida coincide?
            if(formatIdaSeleccionada == formatIdaVuelo) {
                $scope.idIda = item.vuelo;
                $scope.horaIda = item.salida.slice(11,16);

                // Juntamos el número de vuelo con su hora de salida
                //console.log($scope.idIda.concat(" / ").concat($scope.horaIda));

                $scope.stringIda = $scope.idIda.concat(" / ").concat($scope.horaIda);

                // Ahora iteramos los posibles vuelos de regreso y nos quedamos con aquellos que salgan el día de regreso seleccionado
                for (var i = 0 ; i < vuelosVuelta.length ; i++) {
                    var formatVueltaVuelo = vuelosVuelta[i].salida.slice(0,10);

                    // ¿La vuelta coincide?
                    if(formatVueltaSeleccionada == formatVueltaVuelo) {
                        $scope.idVuelta = vuelosVuelta[i].vuelo;
                        $scope.horaVuelta = vuelosVuelta[i].salida.slice(11,16);

                        //console.log($scope.idVuelta.concat(" / ").concat($scope.horaVuelta));

                        $scope.stringVuelta = $scope.idVuelta.concat(" / ").concat($scope.horaVuelta);

                        out = true;
                        $scope.precioBus = (item.bussiness + vuelosVuelta[i].bussiness) * $scope.numBilletes;
                        $scope.precioOpt = (item.optima + vuelosVuelta[i].optima) * $scope.numBilletes;
                        $scope.precioEco = (item.economy + vuelosVuelta[i].economy) * $scope.numBilletes;
                    }
                }
            } else {
                out = false;
            }

        }
        //console.log($scope.precios);
        return out;
    }

    $scope.comprar = function(precio,opcion) {
        $scope.itemCounter = 0;
        console.log(opcion);
        console.log($scope.precios[precio][opcion]);
        $scope.showBilleteComprado = true;
    }

});