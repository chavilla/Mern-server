const express=require('express');
const router=express.Router();
const proyectosController=require('../controllers/proyectoController');
const auth=require('../middleware/auth');
const { check }=require('express-validator');

//En esta parte tenemos nuestro middleware el cual verifica si el usuario está autenticado para poder crear un proyecto
router.post('/',
auth,
[
    check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
],
proyectosController.crearProyecto);

router.get('/', auth, proyectosController.obtenerProyectos);

router.put('/:id', 
auth, 
[
    check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
],
proyectosController.actualizarProyecto);

router.delete('/:id', auth, proyectosController.eliminarProyecto);

module.exports=router;