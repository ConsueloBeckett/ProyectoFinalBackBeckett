# terceraPreEntrega

# Descripción
Este proyecto está construido utilizando Node.js y Express, con Handlebars como motor de plantillas.
Incluye autenticación de usuario, gestión de sesiones y MongoDB para el almacenamiento de datos. 
Se utiliza Passport.js para el manejo de la autenticación del usuario.


# Estructura del Proyecto
* /config: Contiene archivos de configuración.
* session.config.js: Configura express-session.
* mongo.config.js: Configura la conexión a MongoDB.
* passport.config.js: Configura Passport.js para la autenticación.
* /router: Contiene archivos de rutas.
* views.routes.js: Maneja vistas generales.
* products.routes.js: Maneja rutas relacionadas con productos.
* carts.routes.js: Gestiona rutas del carrito de compras.
* user.routes.js: Gestiona rutas relacionadas con usuarios.
* /utils.js: Proporciona funciones de utilidad, incluyendo la variable __dirname.


# Dependencias
* express: Framework web rápido, sin opiniones y minimalista para Node.js.
* express-handlebars: Motor de vistas Handlebars para Express.
* path: Proporciona utilidades para trabajar con rutas de archivos y directorios.
* express-session: Middleware simple de sesión para Express.
* dotenv: Carga variables de entorno desde un archivo .env.
* passport: Autenticación simple y discreta para Node.js.
* mongoose: Herramienta de modelado de objetos MongoDB diseñada para funcionar en un entorno asíncrono.