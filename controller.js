"use strict";

var app = angular.module("indexApp",['ngRoute']);
var billetes;
var fechaSalida;
var fechaLlegada;

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

    }

    $scope.updateBilletes = function() {
        billetes = $scope.inputBilletes;
        console.log(billetes);
    }

    $scope.updateFechaSalida = function() {
        fechaSalida = $scope.inputSalida + $scope.inputSalida.getTimezoneOffset();
        //fechaSalida = new Date(fechaSalida.slice(4,15));
        console.log(fechaSalida);
    }

    $scope.updateFechaLlegada = function() {
        fechaLlegada = $scope.inputLlegada + $scope.inputLlegada.getTimezoneOffset();
        console.log(fechaLlegada);
    }

    $scope.initialize();
});

app.controller("vuelosCtrl", function($scope,$routeParams,$http){

    $scope.initialValues = function() {
        $scope.selectedOrder = 'origen';
        $scope.vuelosVisible = false;
        $scope.numBilletes = billetes;
        $scope.fechaSalida = fechaSalida;
        $scope.fechaLlegada = fechaLlegada;
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

    $scope.initialValues();

});

// TODO: Arreglar el filtro de fechas

app.filter('filterLlegada',function() {
    return function(itemsFromData, itemFechaLlegada) {
        var parsedDate = parseDate(itemFechaLlegada);
        var result = [];
        for(var i = 0 ; i < itemsFromData.length ; i++) {
            result.push(itemsFromData[i]);
        }
        return result;
    };
});

//function parseDate(input) {
    //var parts = input.split('-');
    //return new Date(parts[2],parts[1]-1,parts[0]);
//}