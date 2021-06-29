var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var user = require('./models/user');

//Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
var apiRoutes = express.Router();



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



apiRoutes.post('/', function (req, res) {

    

    if (req.body.user != "senai" || req.body.password != "redes") {
        res.json({ success: false, message: 'Usuário ou senha invalido' });

    } else {

        let usuario = new user()
        {
            name: "tadriano";
            admin: true
        };

        var token = jwt.sign(usuario, 'palavra-chave', {
            expiresInMinutes: 1440
        });

        res.json({
            success: true,
            message: 'token criado',
            token: token
        });
    }


});


apiRoutes.use(function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'palavra-chave', function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Falha ao validar o token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: '403 - Forbidden'
        });
    }
});


apiRoutes.get('/', function (req, res) {
    res.json({ message: 'atividade jwt' });
});

app.use('/', apiRoutes);

var port = process.env.PORT || 8001;
app.listen(port);
console.log('Server Node na porta:' + port);