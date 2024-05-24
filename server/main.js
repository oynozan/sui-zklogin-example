require('dotenv').config();
const cors = require('cors');
const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const server = require('http').createServer(app);

/* Middlewares */
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

server.listen(process.env.PORT);