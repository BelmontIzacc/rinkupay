const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Establece conexion a base de datos
const { mongoose } = require('./database');

// Configuracion

// Puerto de conexion
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/usuario',require('./routers/usuario.router'));
app.use('/nomina',require('./routers/nomina.router'));

// Inicia el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});