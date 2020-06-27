# LIS_buscador_vuelos


## Instalación del servidor en un VPS o en local

### Base de datos
__Es necesario tener Docker instalado__

- Lanzamos un contenedor de MySQL como base de datos de la aplicación:

  `docker run --name mysql_LIS -e MYSQL_ROOT_PASSWORD=<contraseña> -d mysql:8.0.1`

- Lanzamos un contenedor de PHPMyAdmin, para administrar la base de datos gráficamente. Este contenedor está linkeado con el de la base de datos:

  `docker run --name phpmyadmin_LIS -d --link mysql_LIS :db -p 8081:80 phpmyadmin/phpmyadmin`

- Acceso a PHPMyAdmin, en un navegador:

  `http://<ip del servidor>:8081`

  Datos de login:

  User: 
`root
`

  Password: 
`<contraseña>
`


### Servidor Node.js
__Es necesario tener Node.js instalado__

- Clonado del repositorio

  `git clone https://github.com/iicc1/LIS_buscador_vuelos`

- Variables de entorno

  El servidor usa variables de entorno para las configuraciones principales. Se debe crear un archivo .env que contenga estas variables. El archivo env.example, contiene las variables existentes y valores por defecto.


- Ejecutamos el servidor

  `node server/server.js`

  También se puede dejar en segundo plano mediante PM2

  `pm2 start server/server.js --name "servidor_LIS"`

  Para ello debe estar PM2 instalado globalmente en Node
