"use strict";



/*

 24 de jun
-----------

* GET VUELOS: RECIBE ID PARA ENVIARLO DESPUÉS
* COMPRAR: ENVIAR ID DE VUELO!

* vuelos: inicie sesión para comprar

*/



var app = angular.module("indexApp",['ngRoute']);
var billetes;
var fechaIda;
var fechaVuelta;
var soloIda;

var arrayVuelos = [];
var vuelosIda = [];
var vuelosVuelta = [];

var name;
var success = false;

var vuelos;

var origen;
var destino;
var idaYvuelta;
var vuelo_actual;

var login_token;

var pasajeros_length;

var passenger = [];
var clase;


var reserva;
var profile_book;


/*

La vista principal de la aplicación es la de index.html, sobre esa vista está la barra de navegación con (1) el nombre y el logo, (2) y también con las pestañas típicas, además tenemos (3) la pestaña de login (a través de la cual se accede a la página dónde se inicia sesión). La página de login contiene también un hiperenlace para acceder a la página de signup (donde nos damos de alta). Una vez iniciada la sesión la pestaña de login se convierte en logout (para cerrar la sesión).

En la parte central de la vista de la aplicación se encuentra el contenedor de entrada y salida de la aplicación, y es aquí donde se ven los aspectos más específicos de la funcionalidad, más allá de la gestión de sesiones de usuario (registro, inicio o cierre) aunque hay que iniciar sesión para acceder a las compras de billetes.


Los códigos para la funcionalidad de la aplicación son:

- main.html
    -> Acceso: se carga automáticamente al entrar a la página
    -> Descripción: entrada de datos para buscar vuelos

- vuelos.html
    -> Acceso: botón de "VUELOS DISPONIBLES" tras introducir los creiterios de búsqueda
    -> Descripción: Lista los vuelos disponibles según los criterios de búsqueda (si el usuario ha iniciado sesión existe la posibilidad de comprar los vuelos de esta lista)

- booking.html
    -> Acceso: botón de "COMPRAR" sobre todas las opciones de vuelos disponibles en la lista resultante para los criterios de búsqueda
    -> Descripción: Se muestran las caracteristicas del billete de avión y se pide al usuario que introduzca los datos (nombre, apellidos y DNI) de la persona que va a viajar. Una vez introducidos, la compra del billete se registra en la base de datos.

- profile.html
    -> Acceso
    -> Descripción



*/


// Asignación de vistas y controladores
app.config(function($routeProvider) { 
    $routeProvider. 
    when('/', {
        controller: 'mainCtrl',
        templateUrl: 'main.html'
    }).
    when('/listaVuelos', { 
        controller: 'vuelosCtrl', 
        templateUrl: 'vuelos.html'
    }).
    when('/profile', {
        controller: 'profileCtrl',
        templateUrl: 'profile.html'
    }).
    when('/booking', {
        controller: 'bookingCtrl',
        templateUrl: 'booking.html'
    }).// login.html view controller
    when('/login', {
        controller: 'loginCtrl',
        templateUrl: 'login.html'
    }).
    when('/logout', {
        controller: 'logoutCtrl',
        templateUrl: 'main.html'
    }).// signup.html view controller
    when('/signup', {
        controller: 'signupCtrl',
        templateUrl: 'signup.html'
    }).
    otherwise({
        redirectTo: '/'
    });
})






app.controller("vuelosCtrl", function($scope,$routeParams,$http, $location){
    
    console.log(vuelos.salidas);
    console.log("vuelos.html: idaYvuelta: "+idaYvuelta);
    
    $scope.origen = origen;
    $scope.destino = destino;
    
    var vuelos_salidas_aux = vuelos.salidas;
    var vuelos_salidas = vuelos_salidas_aux;
    var vuelos2 = [];
    for (var i = 0; i < vuelos_salidas_aux.length; i++){
        vuelos_salidas[i].fecha = formatDate2(vuelos_salidas_aux[i].salida);
        vuelos_salidas[i].hora_salida = formatDate(vuelos_salidas_aux[i].salida);
        vuelos_salidas[i].hora_llegada = formatDate(vuelos_salidas_aux[i].llegada);
    }
    
    console.log(vuelos_salidas);
    
    for (var i = 0; i < vuelos_salidas.length; i++) {
        vuelos2[i] = {};
        vuelos2[i] = vuelos_salidas[i];
    }
    
    if(idaYvuelta === "true") {
        var vuelos_llegadas = vuelos.llegadas;
        var vuelos_llegadas_aux = vuelos_llegadas;
        console.log(vuelos_llegadas);
        for (var i = 0; i < vuelos_salidas_aux.length; i++){
            vuelos_llegadas[i].fecha = formatDate2(vuelos_llegadas_aux[i].llegada);
            vuelos_llegadas[i].hora_salida = formatDate(vuelos_llegadas_aux[i].salida);
            vuelos_llegadas[i].hora_llegada = formatDate(vuelos_llegadas_aux[i].llegada);
            
        }
        
        console.log(vuelos_llegadas);
        
        
        for (var i = vuelos_salidas.length; i < vuelos_salidas.length + vuelos_llegadas.length; i++) {
            vuelos2[i] = {};
            vuelos2[i] = vuelos_llegadas[i-vuelos_salidas.length];
        }

        
    }
    
    
    
    

    
    $scope.data = vuelos2;

    $scope.comprarBusiness = function(item) {
      //  console.log(precio);
        //alert((item.business * $scope.numBilletes)+" € !");
        vuelo_actual = item;
        clase = "business";
        $location.path("/booking").replace();
        
    }
    
    

    $scope.comprarOptima = function(item) {
      //  console.log(precio);
        //alert((item.business * $scope.numBilletes)+" € !");
        vuelo_actual = item;
        clase = "optima";
        $location.path("/booking").replace();
        
    }
    
    
    $scope.comprarEconomy = function(item) {
      //  console.log(precio);
        //alert((item.business * $scope.numBilletes)+" € !");
        vuelo_actual = item;
        clase = "economy";
        $location.path("/booking").replace();
        
    }
    
        
    
    
    function formatDate2(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    
    function formatDate(date) {
        
        var d_aux = new Date(date).getTimezoneOffset(),
            offset_hrs = parseInt(Math.abs(d_aux/60)),
            offset_mins = Math.abs(d_aux%60);

                    
        
        
        var d = new Date(date),
            hour = (d.getHours()),// + d.getTimezoneOffset()),
            min = d.getMinutes();
        
        if(d_aux > 0) {
            
            hour += offset_hrs;
            min += offset_mins;
            
        }
        
        
        if (hour.toString().length < 2) 
            hour = '0' + hour;
        
        if (min === 0) 
            min = '00';
        
        if (min.toString().length === 1 && min !== 0)
            min = min + '0';

        if (min.toString().length < 2) 
            min = '0' + min;

        return [hour, min].join(':');
    }
    
    
    
    
    /*
    
    
    $scope.comprarBussines_2 = function(a) {
        
      //  console.log(precio);
        alert($scope.precioBus_2[a]+" € !");
    }
    
    $scope.comprarOptima_2 = function(a) {
        
      //  console.log(precio);
        alert($scope.precioOpt_2[a]+" € !");
    }
    
    $scope.comprarEconomy_2 = function(a) {
        
      //  console.log(precio);
        alert($scope.precioEco_2[a]+" € !");
    }
    */

});




            


app.controller("profileCtrl", function($scope, $location){
    $scope.user = name;

    var profile_book_aux = [];
    
    for(var i = 0; i < profile_book.length; i++){
        profile_book_aux[i] = {};
        profile_book_aux[i].vuelo = profile_book[i].vuelo;
        profile_book_aux[i].salida = profile_book[i].origen;
        profile_book_aux[i].llegada = profile_book[i].destino;
        
        
        profile_book_aux[i].hora_salida = formatDate(profile_book[i].salida) + " " +formatDate2(profile_book[i].salida);
        
        
        profile_book_aux[i].hora_llegada = formatDate(profile_book[i].llegada) + " " +formatDate2(profile_book[i].llegada);
        
        profile_book_aux[i].nombre = profile_book[i].nombre;
        
        var c = "";
        var precio;
        if (profile_book[i].npas_business !== 0){
            c = "business";
            precio = profile_book[i].precio_business;
        } else if (profile_book[i].npas_optima !== 0){
            c = "optima";
            precio = profile_book[i].precio_optima;
        } else if (profile_book[i].npas_economy !== 0){
            c = "economy";
            precio = profile_book[i].precio_economy;
        }
        profile_book_aux[i].clase = c;
        
        profile_book_aux[i].precio = precio;        
        
        
    }
    
    
    
    
    $scope.profileBook = profile_book_aux;
    
    

    console.log($scope.profileBook);

    
    
    
    
    
    
    function formatDate2(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    
    function formatDate(date) {
        
        var d_aux = new Date(date).getTimezoneOffset(),
            offset_hrs = parseInt(Math.abs(d_aux/60)),
            offset_mins = Math.abs(d_aux%60);

                    
        
        
        var d = new Date(date),
            hour = (d.getHours()),// + d.getTimezoneOffset()),
            min = d.getMinutes();
        
        if(d_aux > 0) {
            
            hour += offset_hrs;
            min += offset_mins;
            
        }
        
        
        if (hour.toString().length < 2) 
            hour = '0' + hour;
        
        if (min === 0) 
            min = '00';
        
        if (min.toString().length === 1 && min !== 0)
            min = min + '0';

        if (min.toString().length < 2) 
            min = '0' + min;

        return [hour, min].join(':');
    }
    
    
});




app.controller("bookingCtrl", function($scope, $location){
    pasajeros_length = 1;
    $scope.Origen = vuelo_actual.origen;
    $scope.Destino = vuelo_actual.destino;
    $scope.Fecha = vuelo_actual.fecha;
    
    $scope.Nombre = "John";
    $scope.Apellidos = "Doe";
    $scope.DNI = "12345678-9";
    $scope.Clase = "Bussines";
    $scope.Viaje = "Solo ida";
    
    $scope.pasajeros = [{"r":"p","g":"j"}];
    console.log($scope.pasajeros);
    

    
    
    $scope.doAdd = function(inputName, inputSurname) {
        console.log(inputName);
        $scope.pasajeros.push({
            "nombre": inputName,
            "apellidos": inputSurname
        });
        
        pasajeros_length++;
        
        
        var inputs = document.getElementsByClassName("hide-click-btn");
        var inputs_lenght = inputs.length;
        for (var i = 0; i < inputs_lenght; i++) {

                inputs[i].style = "display:none";
            
        }
        
        console.log($scope.pasajeros);
     
        
        
        
        //console.log(passenger[0]);
        for(var i = 0; i < $scope.pasajeros.length; i++) {
            if (i === 0) continue;
            passenger[i-1] = {};
            passenger[i-1].nombre = $scope.pasajeros[i].nombre;
            passenger[i-1].apellidos = $scope.pasajeros[i].apellidos;
        }
        
        console.log(passenger);
    }
    
    
    $scope.doBooking = function() {

        tes();
    }
    
    
    function makeRequest(method, url) {
        
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            console.log(login_token);
            xhr.setRequestHeader("Auth-Token", login_token);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                    console.log(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            
            /*
            console.log("ida y vuelta: "+soloIda);
            console.log("pasajeros: "+parseInt($scope.inputBilletes, 10));
            console.log("origen: "+$scope.inputOrigen);
            console.log("destino: "+$scope.inputDestino);
            console.log("salida: "+fechaIda);
            console.log("llegda: "+fechaVuelta);
            
            */
            
            var data = {"categoria": clase,
                        "vueloId": vuelo_actual.vueloId,
                        "pasajero" : passenger
                       };
            
            console.log(data);
            
            xhr.send(JSON.stringify(data));
        });
    }
    
    async function tes() {
        
        var url = "http://51.15.247.76:3001/comprar";
        

        var responseO = await makeRequest("POST", url);
        console.log(responseO);
        f(responseO);
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
            
            $scope.$apply(function(){
                alert("Reserva realizada con éxito");
                $location.path("/");
                console.log();
                vuelos = response.result;
                

            })
        } else {
            alert("ERROR");
            $scope.$apply(function(){
                $location.path('/').replace();
            })
        }
    }


    
});



               
// Controlador de la página principal
app.controller("mainCtrl", function($scope, $location){
    // Guarda en variables globales los valores de las variables del scope
    // para pasarlas a la página de vuelos.


    $scope.in = 0;
    $scope.precioBus_2 = [];
    $scope.precioOpt_2 = [];
    $scope.precioEco_2 = [];
    $scope.initialize = function() {    }



    

    if (success === true) {
        document.getElementById("login").innerHTML = "LOGOUT";
        document.getElementById("name-profile").innerHTML = name;
        document.getElementById("name").style = "display:inherit";
        document.getElementById("login-logout").setAttribute("href","#!/logout");
        
    } else {
        document.getElementById("login").innerHTML = "LOGIN";
    }
    

    
    
    var bb;
    var xhr;
    
    var responseO;
    var soloIda;
    var fechaIda;
    var fechaVuelta;
    

    
    
    
    

    $scope.doSearch = function() {
        tes();
    }
    
    
    function makeRequest(method, url) {
        
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                    console.log(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            console.log("ida y vuelta: "+soloIda);
            console.log("pasajeros: "+parseInt($scope.inputBilletes, 10));
            console.log("origen: "+$scope.inputOrigen);
            console.log("destino: "+$scope.inputDestino);
            console.log("salida: "+fechaIda);
            console.log("llegda: "+fechaVuelta);
            
            xhr.send();
        });
    }
    
    async function tes() {
        
        var url = "http://51.15.247.76:3001/vuelos";

        var idaYvuelta = "?idaYvuelta="+soloIda.toString();
        var pasajeros_aux = $scope.inputBilletes;
        var pasajeros = "&pasajeros="+pasajeros_aux.toString();
        var origen = "&origen="+$scope.inputOrigen;
        var destino = "&destino="+$scope.inputDestino;
        var salida = "&salida="+fechaVuelta;
        var llegada = "&llegada="+fechaIda;
        
        url += idaYvuelta+pasajeros+origen+destino+salida+llegada;
        
        console.log(url);
/*  
        if (!soloIda) {
            url = "http://51.15.247.76:3001/vuelos?idaYvuelta=false&pasajeros=8&origen=BARCELONA&destino=MADRID&salida=2020-09-21";
        } else {
            url = "http://51.15.247.76:3001/vuelos?idaYvuelta=true&pasajeros=8&origen=BARCELONA&destino=MADRID&salida=2020-09-21&llegada=2020-09-24";
        }
*/        

        var responseO = await makeRequest("GET", url);
        console.log(responseO);
        f(responseO);
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
            
            $scope.$apply(function(){
                $location.path("/listaVuelos");
                vuelos = response.result;
                
                origen = $scope.inputOrigen;
                destino = $scope.inputDestino;
            })
        } else {
            alert("ERROR");
            $scope.$apply(function(){
                $location.path('/main').replace();
            })
        }
    }
    
    
    $scope.updateTipoBillete = function(tipo) {
        console.log(tipo);
        soloIda = tipo;
        idaYvuelta = soloIda;
    }
    

    $scope.updateFechaIda = function() {
        //var fechaIda_aux = $scope.inputIda + $scope.inputIda.getTimezoneOffset();
        //var fechaIda_aux = $scope.inputIda.toString();//fechaIda_aux.slice(0,9);
        fechaIda = formatDate($scope.inputIda);
        
        //fechaIda = $scope.inputIda + $scope.inputIda.getTimezoneOffset();
    }
        
    $scope.updateFechaVuelta = function() {
        //var fechaVuelta_aux = $scope.inputVuelta.toString();// + $scope.inputVuelta.getTimezoneOffset();
        //fechaVuelta = fechaVuelta_aux.slice(0,9);
        fechaVuelta = formatDate($scope.inputVuelta);//echaVuelta_aux.slice(0,9);//fechaVuelta_aux.slice(0,9);
        //fechaVuelta = $scope.inputVuelta + $scope.inputVuelta.getTimezoneOffset();
    }
    
    $scope.initialize();
    
    
    
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

});










/*
/////////////////////////////////////////////////////////////////////////

*/

app.controller("logoutCtrl", function($scope, $location){
    
    success = false;
    login_token = null;
    document.getElementById("login").innerHTML = "LOGIN";
    document.getElementById("name").style = "display:none";
    document.getElementById("login-logout").setAttribute("href","#!/login");
    $scope.$apply(function(){
        $location.path("/").replace();
    })
    
    
});
               


// login controller
app.controller("loginCtrl", function($scope, $location){
    
    var bb;
    var xhr;
    
    var responseO;
    

    $scope.doLogin = function() {
        tes();

    }
    
    
    function makeRequest(method, url) {
        
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            console.log($scope.login_email);
            console.log($scope.login_password);
            xhr.send(JSON.stringify({"email": $scope.login_email, "password": $scope.login_password }));
        });
    }
    
    async function tes() {
        var responseO = await makeRequest("POST", "http://51.15.247.76:3001/login");
        f(responseO);
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);

        var bb = response.success;

        console.log(response);
        if (bb) {
            
            $scope.$apply(function(){
                $location.path("/");
                name = $scope.login_email;
                success = true;
                login_token = response.result.token;
                
                tes2();
                
            })
        } else {
            alert("Usuario no registrado");
            $scope.$apply(function(){
                $location.path('/login').replace();
            })
        }
    }
    
    

    

        function makeRequest2(method, url) {
        
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            console.log(login_token);
            xhr.setRequestHeader("Auth-Token", login_token);

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                    console.log(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            xhr.send();
        });
    }
    
    async function tes2() {
        
        var url = "http://51.15.247.76:3001/compras";

        var responseO = await makeRequest2("GET", url);
        console.log(responseO);
        f2(responseO);
    }
    
    function f2(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {

                profile_book = response.result;
                //$scope.profile_book = profile_book;
                //console.log($scope.profile_book);
                //$location.path("/profile").replace();


            
        } else {
            alert("ERROR");
            $scope.$apply(function(){
                $location.path('/').replace();
            })
        }
    }

    
    
    
});




// Controlador de signup
app.controller("signupCtrl", function($scope, $location){
    
    $scope.doSignup = function() {

        var password = $scope.signup_password;
        var confirm_password = $scope.signup_confirm_password;
        
        var bb;
        var xhr;
    
        var responseO;

        
        if (password !== confirm_password) {
            alert("Las contraseñas no coinciden");
        } else {

            tes();
        }
    
    
    
    function makeRequest(method, url) {
        
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            console.log($scope.login_email);
            console.log($scope.login_password);
            xhr.send(JSON.stringify({"email": $scope.signup_email, "password": $scope.signup_password }));
        });
    }
    
    async function tes() {
        var responseO = await makeRequest("POST", "http://51.15.247.76:3001/registro");
        f(responseO);
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);

        var bb = response.success;

        if (bb) {
            
            $scope.$apply(function(){
                $location.path("/");
                
                alert("Usuario registrado con éxito!");
          
            })
        } else {
            alert("Usuario no registrado");
            $scope.$apply(function(){
                $location.path('/signup').replace();
            })
        }
    }
}
    
});
