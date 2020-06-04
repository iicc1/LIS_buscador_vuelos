"use strict";

var app = angular.module("indexApp",['ngRoute']);
var billetes;
var fechaIda;
var fechaVuelta;
var soloIda;

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

app.controller("mainCtrl", function($scope){
    $scope.initialize = function() {
        soloIda = false;
    }

    $scope.updateTipoBillete() = function() {
        soloIda = true;
    }
    
    $scope.updateBilletes = function() {
        billetes = $scope.inputBilletes;
        console.log(billetes);
    }

    $scope.updateFechaIda = function() {
        fechaIda = $scope.inputIda + $scope.inputIda.getTimezoneOffset();
    }

    $scope.updateFechaVuelta = function() {
        fechaLlegada = $scope.inputVuelta + $scope.inputVuelta.getTimezoneOffset();
    }

    $scope.initialize();
});

app.controller("vuelosCtrl", function($scope,$routeParams,$http){

    $scope.initialValues = function() {
        $scope.selectedOrder = 'origen';
        $scope.vuelosVisible = false;
        $scope.numBilletes = billetes;
        $scope.fechaIda = fechaIda;
        $scope.fechaVuelta = fechaVuelta;
    }

    $scope.vuelosOrigen = $routeParams.orig;
    $scope.vuelosDestino = $routeParams.dest;

    $scope.data = {};
    $scope.error = "JSON cargado con éxito";

    $http.get("vuelos.json").then(

        function(response){
            $scope.data = response.data.vuelos;
        },
        function(response){
            $scope.error = "No se pudo cargar el JSON. Asegúrate de que se encuentra en el directorio correspondiente.";
        }
    );
    
    // TEST
    // 2020-08-10T20:10:00.000Z LANZAROTE MADRID
    
    $scope.dateManager = function(ida,vuelta) {
        var formatIdaSeleccionada = new Date(fechaIda.slice(4,15))
        // Por la zona horaria tenemos un desfase de 1 día
        formatIdaSeleccionada.setDate(formatIdaSeleccionada.getDate() + 1);
        formatIdaSeleccionada = formatIdaSeleccionada.toISOString();
        formatIdaSeleccionada = formatIdaSeleccionada.slice(0,10);
        
        var formatIdaVuelo = ida.slice(0,10);
        
        if(formatIdaSeleccionada == formatIdaVuelo) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.findVuelta = function() {
        return new Date();
    }

    $scope.initialValues();

});
