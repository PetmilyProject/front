const { Router } = require('express');
const http = require('http');
const fs = require('fs'); 
var path = require('path');

const mainRouter = express.Router();

mainRouter.get('/', async (req, res) => {
    try {
        res.send("Success");
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});
