const mongoose=require('mongoose');
require('dotenv').config({path:'variables.env'});

const conexion=async ()=>{
    try {
        await mongoose.connect(process.env.DB_MONGO,{
            useCreateIndex: true,
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        });
        console.log('Base de datos conectada');
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports=conexion;