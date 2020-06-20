const Proyecto=require('../models/Proyecto');
const Tarea=require('../models/Tarea');
const { validationResult }=require('express-validator');

const controller={

    crearProyecto:async (req,res)=>{
        //Revisar si hay errores con express validator
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }

        try {
            const proyecto=new Proyecto(req.body);
            await proyecto.save()
            res.send({proyecto})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:'Hubo un Error'});
        }
        
    },
    obtenerProyectos:async (req,res)=>{
        
        try {
            const proyectos=await Proyecto.find({creador: req.body.creador}).sort({creado:-1});
            if (!proyectos) {
                return res.status(404).json({msg: 'No hay proyectos'});
            }

            res.send({proyectos})

        } catch (error) {
            return res.status(500).json({msg:'Hubo un problema'});
        }
    },
    actualizarProyecto: async (req,res)=>{
        //Revisar si hay errores con express validator
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }

        //Obtenerel nombre nuevo
        const { nombre, creador }=req.body;
        const nuevoProyecto={};

        try {

            //Revissar el id
            let proyecto=await Proyecto.findById(req.params.id);            

            //Si el proyecto existe o no
            if (proyecto.id!==req.params.id) {
                return res.status(404).json({msg: `No existe proyecto con id: ${req.params.id}`})    
            }

            //Veificar el creador del proyecto
            if (proyecto.creador.toString()!==creador) {
                res.status(404).json({msg:'No puedes editar este proyecto'});  
            }
            
            //Actualizar
            nuevoProyecto.nombre=nombre;
            proyecto=await Proyecto.findByIdAndUpdate({_id:req.params.id},{$set:nuevoProyecto},{new:true});
            res.json({proyecto})

        } catch (error) {
            console.log(error);
            
            return res.status(500).json({msg: 'Hubo un problema en el servidor'})
        }
    },
    //Eliminar un proyecto
    eliminarProyecto: async (req,res)=>{

        const { creador }=req.body;

        try {
            //Revisar el id
            let proyecto=await Proyecto.findById(req.params.id);

            //Si el proyecto existe o no
            if (proyecto.id!==req.params.id) {
                return res.status(404).json({msg: `No existe proyecto con id: ${req.params.id}`})    
            }
            //Veificar el creador del proyecto
            if (proyecto.creador.toString()!==creador) {
                res.status(404).json({msg:'No puedes eliminar este proyecto'});  
            }

            //Eliminar tareas del proyecto
            await Tarea.deleteMany({proyecto: req.params.id});

            //Eliminar proyecto
            await Proyecto.findOneAndRemove({_id:req.params.id});

            res.json({msg:'Proyecto Eliminado'});

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg:'Error en el servidor'})
        }
    }

}

module.exports=controller;