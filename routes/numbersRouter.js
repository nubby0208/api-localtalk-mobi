//"use strict";
//created by Muhammad Ali Tufail. 'https://malitufail.github.io'
const express = require("express");
const numbersRouter = new express.Router();
const numbersController = require('../controllers/numbersController');

//numbersRouter.post("/generate", numbersController.generateNumbers);
numbersRouter.get("/generate", numbersController.numbersListV2);
numbersRouter.post("/", numbersController.numbersList);
numbersRouter.post("/availibilty", numbersController.availablityCheck);
numbersRouter.get("/test/", (req, res)=>{res.status(500).json({error: true, data: "Test"});    });
module.exports = numbersRouter;

//module.exports = (app) => {
    //const numbersRouter = app;
    //const numbersController = require('../controllers/numbersController');

      //numbersRouter.post("/api/v1/numbers/generate/", numbersController///.generateNumbers);
    //numbersRouter.post("/api/v1/numbers/", numbersController.numbersList);
    //numbersRouter.post("/api/v1/numbers/availibilty/", numbersController//.availablityCheck);
     //numbersRouter.get("/api/v1/numbers/test/", ()=>{
 //         res.status(500).json({error: true, data: "Test"});
//     });
//};