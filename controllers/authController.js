const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

var controller = {
  login: async (req, res) => {
    //Revisar si hay errores con express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    //Extraer email y password
    const { email, password } = req.body;

    try {
      //Revisar si el usuario está registrado
      let usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ msg: "Usuario o contraseña no válido" });
      }

      //Revisar password
      const passwordCorrecto = await bcryptjs.compare(
        password,
        usuario.password
      );

      if (!passwordCorrecto) {
        return res.status(400).send({ msg: "Usuario o contraseña no válido." });
      }

      //Crear un jwt
      const payload = {
        id: usuario.id,
      };
      //firmar el jwt
      jwt.sign(
        payload,
        process.env.SECRETA,
        {
          expiresIn: 3600,
        },
        (error, token) => {
          if (error) throw error;
          //Mensaje de confirmación
          res.send({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send("Hubo un error");
    }
  },

  usuarioAutenticado: async (req,res)=>{
    
    try {

      const usuario=await Usuario.findById(req.body.creador).select('-password');
      res.json(usuario);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({msg: 'Hubo un error'});
    }
  }
};

module.exports = controller;
