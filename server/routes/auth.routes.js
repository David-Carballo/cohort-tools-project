const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const verifyToken = require("../middlewares/auth.middlewares")

//POST /auth/signup
router.post("/signup", async (req, res, next) => {
    const { email, password, name } = req.body;
  
    try {
      //Validaciones backend
      ///Campos obligatorios
      if (!email || !password || !name) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
      }
  
      ///contraseñas //g-> verificaciones globales m->
      const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/gm;
      if (!regexPass.test(password)) {
        res.status(400).json({
            message:
              "La contraseña debe tener almenos una mayuscula, una minuscula, un numero y entre 8-16 caracteres",
          });
        return;
      }
  
      ///estructura email /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  
      ///no hay otro user con el mismo mail (username)
      const foundUser = await User.findOne({ email: email });
      if (foundUser) {
        res.status(400).json({ message: "Usuario ya registrado con este email!" });
        return;
      }
  
      // const salt = await bcrypt.genSalt(14);
      // const hashPass = await bcrypt.hash(password, salt)
  
      await User.create({
        email,
        password: await bcrypt.hash(password, await bcrypt.genSalt(14)),
        name,
      });
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  });

//POST /auth/login
router.post("/login", async (req, res, next) => {
    try {
      const {email, password} = req.body;

      //los campos no estan vacios
      if (!email || !password) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
      }
      //el usuario existe en la BD
      const foundUser = await User.findOne({ email: email });
      if (!foundUser) {
        res.status(400).json({ message: "Este usuario no existe" });
        return;
      }
      
      //la contraseña es correcta
      if(!await bcrypt.compare(password, foundUser.password)){
        res.status(400).json({ message: "Contraseña incorrecta. Vuelve a intentarlo" });
        return;
      }
  
      //Crear token
      const payload = {
        _id: foundUser._id,
        email: foundUser.email
        // aqu debe estar cualquier propiedad que identifique al usuario o le de permisos 
      }

      //jwt.sign(payload, secretClue, configs{algorithme:})
      const authToken = jwt.sign(payload, process.env.TOKEN_JWT, {
        algorithm: "HS256",
        expiresIn: "7d", //7 days
      })
  
      res.status(200).json({authToken: authToken});
  
    } catch (error) {
      next(error);
    }
  });

//GET /auth/verify
router.get("/verify", verifyToken, (req, res) => {
  
    //!cada ruta que use verifyToken, recibe el payload con la info importante(user)
    console.log(req.payload);

    //! enviamos al frontend el payload(user)
    res.status(200).json(req.payload);
});

module.exports = router;