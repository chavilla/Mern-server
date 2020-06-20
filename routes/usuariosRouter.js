const express=require('express');
const router=express.Router();
const usuarioController=require('../controllers/usuarioController');
const {check}=require('express-validator');



//Crea un usuario /api/usuario
router.post('/',
[
    //Campo a validar, mensaje de error y lo que se requiere validar
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password','El password debe ser al menos de 8 caracteres').isLength({min: 8})
],
usuarioController.crearUsuario);


module.exports=router;