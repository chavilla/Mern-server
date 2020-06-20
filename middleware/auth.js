const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{

    //Lee token
    const token=req.header('x-auth-token');
    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg:"Permiso no válido"});
    }

    //validar el token
    try {
        //verificar el token
        const cifrado=jwt.verify(token,process.env.SECRETA);
        req.body.creador=cifrado.id;
        next();
    } catch (error) {
        console.log(error);
        
        res.status(401).json({msg:"Token no válido"});
    }
}