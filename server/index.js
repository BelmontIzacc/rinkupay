const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Establece conexion a base de datos
const { mongoose } = require('./database');

// Configuracion

// Puerto de conexion
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.urlencoded({ extended: true }));

//path principal
const rinku = "/rinkupayapi"

// Rutas
app.use(rinku + '/usuario', require('./routers/usuario.router'));
app.use(rinku + '/nomina', require('./routers/nomina.router'));

// Inicia el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});