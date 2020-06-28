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


var url_busqueda;

var cesta = [];
var cesta2 = [];

var logged = false;


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
    when('/profile2', {
        controller: 'profile2Ctrl',
        templateUrl: 'profile2.html'
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



/*
*
* RESULTADO DE LA BÚSQUEDA
****************************
*/

app.controller("vuelosCtrl", function($scope,$routeParams,$http, $location){
    
    console.log(vuelos.salidas);
    console.log(billetes);
    console.log("vuelos.html: idaYvuelta: "+idaYvuelta);
    
    $scope.logged = logged;
    $scope.origen = origen;
    $scope.destino = destino;
    $scope.billetes = billetes;
    var vuelos_salidas_aux = vuelos.salidas;
    var vuelos_salidas = vuelos_salidas_aux;
    var vuelos2 = [];
    for (var i = 0; i < vuelos_salidas_aux.length; i++){
        vuelos_salidas[i].fecha = formatDate2(vuelos_salidas_aux[i].salida);
        vuelos_salidas[i].hora_salida = formatDate(vuelos_salidas_aux[i].salida) + " " + formatDate2(vuelos_salidas_aux[i].salida);
        vuelos_salidas[i].hora_llegada = formatDate(vuelos_salidas_aux[i].llegada)+ " " + formatDate2(vuelos_salidas_aux[i].salida);
        vuelos_salidas[i].billetes_business = billetes * vuelos_salidas_aux[i].precio_business;        
        vuelos_salidas[i].billetes_optima = billetes * vuelos_salidas_aux[i].precio_optima;
        vuelos_salidas[i].billetes_economy = billetes * vuelos_salidas_aux[i].precio_economy;        
    }
    
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
            vuelos_llegadas[i].hora_salida = formatDate(vuelos_llegadas_aux[i].salida)+ " "+formatDate2(vuelos_llegadas_aux[i].llegada);
            vuelos_llegadas[i].hora_llegada = formatDate(vuelos_llegadas_aux[i].llegada)+ " "+formatDate2(vuelos_llegadas_aux[i].llegada);
            vuelos_llegadas[i].billetes_business = billetes * vuelos_llegadas_aux[i].precio_business;
            vuelos_llegadas[i].billetes_optima = billetes * vuelos_llegadas_aux[i].precio_optima;
            vuelos_llegadas[i].billetes_economy = billetes * vuelos_llegadas_aux[i].precio_economy;
            
            
        }

        for (var i = vuelos_salidas.length; i < vuelos_salidas.length + vuelos_llegadas.length; i++) {
            vuelos2[i] = {};
            vuelos2[i] = vuelos_llegadas[i-vuelos_salidas.length];
        }

    }
    
    $scope.data = vuelos2;

    $scope.comprarBusiness = function(item) {
        vuelo_actual = item;
        clase = "business";
        $location.path("/booking").replace();
    }
    
    $scope.comprarOptima = function(item) {
        vuelo_actual = item;
        clase = "optima";
        $location.path("/booking").replace();
    }
    
    $scope.comprarEconomy = function(item) {
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
            hour = (d.getHours()),
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



/*
*
* PERFIL
**********
*/

app.controller("profileCtrl", function($scope, $location){
    $scope.user = name;

    var profile_book_aux = [];
    
    
    tes2();
    
    
    async function tes2() {
        
        var url = "http://51.15.247.76:3001/compras";

        var responseO = await makeRequest2("GET", url);
        console.log(responseO);
        f2(responseO);
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
    

    
    function f2(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
                profile_book = response.result;
            
        } else {
            alert("ERROR");

        }
    }

    
    
    
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
            hour = (d.getHours()),
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
    
    $scope.doBooking = function() {
        tes();
    }
    

    
    async function tes() {
        var url = "http://51.15.247.76:3001/comprar";
        var responseO = await makeRequest("POST", url);
        console.log(responseO);
        f(responseO);
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
            
            var data = {"categoria": clase,
                        "vueloId": vuelo_actual.vueloId,
                        "pasajero" : passenger
                       };
            
            console.log(data);
            
            xhr.send(JSON.stringify(data));
        });
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
            
            $scope.$apply(function(){
                alert("Reserva realizada con éxito");
                $location.path("/");
                vuelos = response.result;
            })
        } else {
            alert("ERROR");
            $scope.$apply(function(){
                $location.path('/').replace();
            })
        }
    }

*/
    
});





/*
*
* CARRITO
*************
*/

app.controller("profile2Ctrl", function($scope, $location){
    console.log(name);

    $scope.user = name;
    
    $scope.cesta2 = cesta2;
/*
    
    var length_aux = 0;
    
    
    var cesta_aux1 = [];
    
    for(var i = 0; i < cesta.length; i++) {
        cesta_aux1[i] = {};
        cesta_aux1[i] = cesta[i];
    }
    
    //$scope.cesta = cesta_aux1;
    
    
    var cesta_aux2 = [];

    
    for(var i = 0; i < cesta_aux1.length; i++){
        cesta_aux2[i] = {};
        cesta_aux2[i].vuelo = cesta_aux1[i].vuelo;
        cesta_aux2[i].salida = cesta_aux1[i].origen;
        cesta_aux2[i].llegada = cesta_aux1[i].destino;
        
        
        cesta_aux2[i].hora_salida = formatDate(cesta_aux2[i].salida) + " " +formatDate2(cesta_aux2[i].salida);
        
        
        cesta_aux2[i].hora_llegada = formatDate(cesta_aux2[i].llegada) + " " +formatDate2(cesta_aux2[i].llegada);
        
        cesta_aux2[i].nombre = cesta_aux1[i].nombre;
        
        var c = "";
        var precio;
        if (cesta_aux1[i].npas_business !== 0){
            c = "business";
            precio = cesta_aux1[i].precio_business;
        } else if (cesta_aux1[i].npas_optima !== 0){
            c = "optima";
            precio = cesta_aux1[i].precio_optima;
        } else if (cesta_aux1[i].npas_economy !== 0){
            c = "economy";
            precio = cesta_aux1[i].precio_economy;
        }
        cesta_aux2[i].clase = c;
        
        cesta_aux2[i].precio = precio;        
        
    }
     
    console.log(cesta_aux2);
    $scope.cesta2 = cesta_aux2;
    

    
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
            hour = (d.getHours()),
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

    */
    
        
    
    $scope.doReturn = function() {
        
        tes2();
        
    }
    
    
    $scope.doBooking = function() {
        
        console.log(cesta);
        for (var i = 0; i < cesta.length; i++) {
            console.log(cesta[i]);
            tes(cesta[i]);
        }
        

        tes2();
        
    }
    

    
    async function tes(cesta_n) {
        var url = "http://51.15.247.76:3001/comprar";
        var responseO = await makeRequest("POST", url, cesta_n);
        console.log(responseO);
        f(responseO);
    }
    
    
    function makeRequest(method, url, cesta_n) {
        
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
                        
            xhr.send(JSON.stringify(cesta_n));
        });
    }
    
    function f(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
            
            $scope.$apply(function(){
                alert("Reserva realizada con éxito");
                //$location.path("/");
                vuelos = response.result;
            })
        } else {
            alert("ERROR");
            $scope.$apply(function(){
                $location.path('/').replace();
            })
        }
    }

    
    
    
       
    async function tes2() {
        var responseO = await makeRequest2("GET", url_busqueda);
        console.log(responseO);
        f2(responseO);
    }
    
    function makeRequest2(method, url) {
        
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
            
            xhr.send();
        });
    }
    

    
    function f2(responseO) {
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
    
/*    
    $scope.updateTipoBillete = function(tipo) {
        soloIda = tipo;
        idaYvuelta = soloIda;
    }
    

    $scope.updateFechaIda = function() {
        fechaIda = formatDate($scope.inputIda);
    }
        
    $scope.updateFechaVuelta = function() {
        fechaVuelta = formatDate($scope.inputVuelta);
    }
    
*/    
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
*
* RESERVAS
***************
*/


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
    
    var name;
    var surname;
    
    $scope.updateName = function(n) {
        name = n;
    }
    
    $scope.updateSurname = function(s) {
        surname = s;
    }
    
    
    $scope.doAdd = function(inputName, inputSurname) {
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

    }

    
    
    $scope.doChart = function(inputName, inputSurname) {
        
        var p = [];
        var passenger = [];
        
        
        for(var i = 0; i < $scope.pasajeros.length; i++) {
            
            p[i] = {};
            p[i].nombre = $scope.pasajeros[i].nombre;
            p[i].apellidos = $scope.pasajeros[i].apellidos;
        }
        
        
        
        p.push({
            "nombre": name,
            "apellidos": surname
        });
        
        
        for(var i = 0; i < p.length; i++) {
            if (i === 0) continue;
            passenger[i-1] = {};
            passenger[i-1].nombre = p[i].nombre;
            passenger[i-1].apellidos = p[i].apellidos;       
        }
        
        var data = {"categoria": clase,
            "vueloId": vuelo_actual.vueloId,
            "pasajero" : passenger,
        };
        
        
        var cesta_length = cesta.length;
        cesta[cesta_length] = data;
        
        
        
        for(var i = 0; i < p.length; i++) {
            if (i === 0) continue;
            passenger[i-1].vueloId = vuelo_actual.vueloId;
            passenger[i-1].categoria = clase;
            passenger[i-1].origen = vuelo_actual.origen;
            passenger[i-1].destino = vuelo_actual.destino;
            passenger[i-1].precio = vuelo_actual.precio;
            passenger[i-1].hora_llegada = vuelo_actual.hora_llegada;
            passenger[i-1].hora_salida = vuelo_actual.hora_salida;
            passenger[i-1].aerolinea = vuelo_actual.nombre_aerolinea;
            
            
        }

        var data = {"categoria": clase,
            "vueloId": vuelo_actual.vueloId,
            "pasajero" : passenger,
        };
        
        
        
        var cesta_length = cesta2.length;
        var count = 0;
        for(var i = cesta_length; i < cesta_length + passenger.length; i++) {
            cesta2[i] = passenger[count];
            count++;
        }        
        
        console.log(cesta2);
        
    }
    
    
    
    
    
    $scope.goChart = function() {
        $location.path("/profile2").replace();
    }
    
    
    
    $scope.doReturn = function() {
        tes();
    }

 
});




/*
*
* BÚSQUEDA
*************
*/

               
// Controlador de la página principal
app.controller("mainCtrl", function($scope, $location){
    // Guarda en variables globales los valores de las variables del scope
    // para pasarlas a la página de vuelos.


    $scope.in = 0;

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
    
    async function tes() {
        
        url_busqueda = "http://51.15.247.76:3001/vuelos";

        var idaYvuelta = "?idaYvuelta="+soloIda.toString();
        var pasajeros_aux = $scope.inputBilletes;
        billetes = $scope.inputBilletes;
        var pasajeros = "&pasajeros="+pasajeros_aux.toString();
        var origen = "&origen="+$scope.inputOrigen;
        var destino = "&destino="+$scope.inputDestino;
        var salida = "&salida="+fechaVuelta;
        var llegada = "&llegada="+fechaIda;
        
        url_busqueda += idaYvuelta+pasajeros+origen+destino+salida+llegada;
        
        console.log(url_busqueda);

        var responseO = await makeRequest("GET", url_busqueda);
        console.log(responseO);
        f(responseO);
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
            
            xhr.send();
        });
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
        soloIda = tipo;
        idaYvuelta = soloIda;
    }
    

    $scope.updateFechaIda = function() {
        fechaIda = formatDate($scope.inputIda);
    }
        
    $scope.updateFechaVuelta = function() {
        fechaVuelta = formatDate($scope.inputVuelta);
    }
    
    
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
    logged = false;
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
    
    
    async function tes2() {
        
        var url = "http://51.15.247.76:3001/compras";

        var responseO = await makeRequest2("GET", url);
        console.log(responseO);
        f2(responseO);
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
    

    
    function f2(responseO) {
        var response = JSON.parse(responseO);
        console.log(response.result);
        var bb = response.success;

        if (bb) {
            profile_book = response.result;
            logged = true;
            
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
