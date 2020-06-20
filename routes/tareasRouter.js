const express=require('express');
const router=express.Router();
const tareasController=require('../controllers/tareaController');
const auth=require('../middleware/auth');
const { check }=require('express-validator');


router.post('/', auth,
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('proyectoId','El id proyecto es obligatorio').not().isEmpty()
],
tareasController.crearTareas
);

router.get('/',auth,tareasController.obtenerTareas);
router.put('/:id',auth,tareasController.actualizarTareas);
router.delete('/:id',auth,tareasController.eliminarTarea);
module.exports=router;