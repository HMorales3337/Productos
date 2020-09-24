'use strict'

var app = require('./app');
var port = process.env.PORT || 3337;
var mysql = require ('mysql');

var jsonConexion = {
    host:"localhost", 
    user:"root", 
    password:"", 
    database:"X"
};

var connection = mysql.createConnection(jsonConexion);

connection.connect(function(error){                                                                                                 
    try { 
        if(error) 
             console.log("Error no se pudo conectar a la BD " + error); 
        else {
            console.log('Conexion a la base de datos a sido exitosa');
            app.listen(port, ()=> {
                console.log(`Servidor api rest funcionando en el puerto ${port}`);
            });
        }      
    }
    catch(x){ 
        console.log("Error " + x); 
    } 
});

app.get('/consultarProductos', function (req, res) {
    let enviar = true;
    let consulta = '';
    if(req.headers.token != '123') {
        enviar = false;
        res.status(403);
        res.send({mensaje: 'Error no se cuenta con los permisos necesarios para realizar la petición'});
    }
    if( (req.query.sku == null || req.query.sku == '') && (req.query.codigo == null || req.query.codigo == '')) {
        enviar = false;
        res.status(400);
        res.send({mensaje: 'Error no se envio la informacion necesaria'});
    }

    if(enviar == true) {
        if (req.query.codigo != null && req.query.codigo != '') {
            let codigo = req.query.codigo;
            consulta = `SELECT * FROM productos WHERE codigo = ${codigo}`;
        }
    
        if (req.query.sku != null && req.query.sku != '') {
            let sku = req.query.sku;
            consulta = `SELECT * FROM productos WHERE sku = ${sku}`;
        }
        
        let jsonrespuesta = {
            mensaje: '',
            codigo: null,
            sku: '',
            descripcion: ''
        };
        connection.query(consulta, function (err, result, fields) {
            if (err) {
                jsonrespuesta.mensaje = 'Error';
                res.status(500);
                res.send(jsonrespuesta);
                throw err;
            }
            else {
                if(result.length == 0) {
                    res.status(400);
                    res.send({mensaje: 'Error el articulo que esta buscando no existe'});
                }
                else {
                    jsonrespuesta.mensaje = 'Exito';
                    jsonrespuesta.codigo = result[0].codigo;
                    jsonrespuesta.sku = result[0].sku;
                    jsonrespuesta.descripcion = result[0].descripcion;
                    res.status(200);
                    res.send(jsonrespuesta); 
                }
            }
        });
    }
});