function errorHandling(app) {
    app.use((req, res)=>{
        res.status(404).json({ errorMessage: "Failed server" });
      })
      
    app.use((error, req, res, next)=>{
    console.log(error);
    res.status(500).json({ errorMessage: "Failed server" });
    })
}

module.exports = errorHandling;