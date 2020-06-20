const express=require('express');
const router=express.Router();
const {check}=require('express-validator');
const authController=require('../controllers/authController');
const auth=require('../middleware/auth');

//Crea un usuario /api/usuario
router.post('/',authController.login);

//Iniciar sesión obteniedo el usuario autenticado
router.get('/',auth, authController.usuarioAutenticado);


module.exports=router;