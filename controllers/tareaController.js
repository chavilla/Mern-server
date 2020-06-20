const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

const controller = {
  crearTareas: async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      //Extraer proyecto y creador
      const { proyectoId, creador } = req.body;
      const proyecto = await Proyecto.findById(proyectoId);
      //Si no se encuentra id del proyecto
      if (!proyecto) {
        return res
          .status(404)
          .json({ msg: "No existe proyecto con ID introducido" });
      }

      //Revisar si eres el creador del proyecto
      if (proyecto.creador.toString() !== creador) {
        return res.status(401).json({ msg: "No estás autorizado" });
      }

      //Creamos la tarea
      const tarea = new Tarea(req.body);
      tarea.proyecto = proyecto._id;
      await tarea.save();

      return res.json({ tarea });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Hubo un problema en el servidor");
    }
  },

  obtenerTareas: async (req, res) => {
    try {
      //Extraer creador
      const { creador } = req.body;
      const proyecto = await Proyecto.findById(req.query.proyecto);
      //Si no se encuentra id del proyecto
      if (!proyecto) {
        return res
          .status(404)
          .json({ msg: "No existe proyecto con ID introducido" });
      }

      //Revisar si eres el creador del proyecto
      if (proyecto.creador.toString() !== creador) {
        return res.status(401).json({ msg: "No estás autorizado" });
      }

      //Obtener tareas
      const tareas = await Tarea.find({ proyecto:req.query.proyecto }).sort({creado:-1});

      res.json({ tareas });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Hubo un problema en el servidor");
    }
  },

  actualizarTareas: async (req, res) => {
    //Obtener datos y el proyecto
    const { proyecto, nombre, estado,creador } = req.body;
    
    try {
      //Revisrar si existe la tarea
      let tarea = await Tarea.findById(req.params.id);
      if (!tarea) {
        return res.status(404).json({ msg: "No existe esa tarea" });
      }

      //Revisar si eres el creador del proyecto
      const proyectoId = await Proyecto.findById(proyecto);
      if (proyectoId.creador.toString() !== creador) {
        return res.status(401).json({ msg: "No estás autorizado" });
      }

      const actualizado = await Tarea.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      res.json({ actualizado });
    } catch (error) {
      console.log(error);
      res.status(500).send("Hubo un error en el servidor");
    }
  },

  eliminarTarea: async (req, res) => {
    const { creador } = req.body;
    const { proyectoId }=req.query;

    try {
      //Si la tarea existe o no
      let tarea = await Tarea.findById(req.params.id);
      if (tarea.id !== req.params.id) {
        return res
          .status(404)
          .json({ msg: `No existe Tarea con id: ${req.params.id}` });
      }
      //Veificar el creador del proyecto
      let proyecto = await Proyecto.findById(proyectoId);
      if (proyecto.creador.toString() !== creador) {
        res.status(404).json({ msg: "No puedes eliminar esta tarea" });
      }

      //Eliminar tarea
      await Tarea.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Tarea Eliminada" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ msg: "Error en el servidor" });
    }
  },
};

module.exports = controller;
