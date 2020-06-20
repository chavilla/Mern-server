const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');

//Conectarse a mongo
const conexion=require('./config/db');
conexion();

//Crear servidor
const app=express();

//Habilitar los cors
app.use(cors());

//Habilitar el body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//Importar rutas
app.use('/api/usuarios/', require('./routes/usuariosRouter'));
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/proyectos/', require('./routes/proyectosRouter'));
app.use('/api/tareas/', require('./routes/tareasRouter'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Habilitar express.json
app.use(express.json({extended:true }));

//Puerto donde corre el app
const port=process.env.PORT || 4000;
//Arranca el servidor
app.listen(port,'0.0.0.0',()=>{
    console.log(`Conectado al puerto ${port}`);
})