const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt=require('jsonwebtoken');

const controller = {
  //Crea un usuario
  crearUsuario: async (req, res) => {

    //Revisar si hay errores con express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    //Extraer email y password
    const { email, password } = req.body;
    

    try {
      //Revisar email unico
      let usuario = await Usuario.findOne({ email });
      
      if (usuario) {
        return res.status(400).json({ msg: "Este email ya está registrado" });
      }

      //Crear instancia de usuario
      usuario = new Usuario(req.body);

      const salt=await bcryptjs.genSalt(10);
      //hash usuario
      usuario.password = await bcryptjs.hash(password,salt);
      //guarda usuario
      await usuario.save();
      //Crear un jwt
      const payload={
          id:usuario.id
      }
      //firmar el jwt
      jwt.sign(payload,process.env.SECRETA,{
          expiresIn:3600
      },(error,token)=>{
          if(error) throw error;
          //Mensaje de confirmación
          res.status(200).json({ token });
      })

    } catch (error) {
      res.status(400).send("Hubo un error");
    }
  }
};

module.exports = controller;
