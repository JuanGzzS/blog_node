
//Declaracion de todos los requires necesarios (se debieron haber instalado en terminal)

let express = require( "express" );

let morgan = require( "morgan" );

let bodyParser = require("body-parser");

let mongoose = require( 'mongoose' );

let { ComentList } = require( './model' );

let {DATABASE_URL, PORT} = require( './config' );

let jsonParser = bodyParser.json();

let uuid = require("uuid");

let app = express();

app.use(express.static('public')); //ESTO ES PARA DECIR QUE HAY UNA PARTE PUBLICA PARA FRONTEND

app.use( morgan("dev") );

let nueva = new Date();

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
 res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
 if (req.method === "OPTIONS") {
 return res.send(204);
 }
 next();
});

//COMENTARIOS PRUEBA

let comentarios = [{

	id : 12345,
	titulo : "Mi primer comentario",
	contenido : "Solo es una prueba",
	autor : "Juan",
	fecha : nueva
	
	
},
{
	id : 67890,
	titulo : "Mi segundo comentario",
	contenido : "Solo es otra prueba de web",
	autor : "Francisco",
	fecha : nueva
}];

//NOS DESPLIEGA TODOS LOS COMENTARIOS

app.get('/blog-api/comentarios', (req,res) => { // req trae la infomración que trae del content ( si tiene headers, etc)... res es para mandar una respuesta 


	ComentList.getAll()
        .then( ComentList => {
            return res.status( 200 ).json( ComentList );
        })
        .catch( error => {
            console.log(error);
            res.statusMessage = "Hubo un error de conexion con la BD."
            return res.status( 500 ).send();
        });

});

//BUSCAMOS COMENTARIOS POR AUTOR VALIDANDO PARAMETROS Y USANDO LA FUNCION FILTER PARA OBTENER COMENTARIO

app.get('/blog-api/comentarios-por-autor', (req,res)=> { // Asi es el formato y POSTMAN lo toma directo

	let autor = req.query.autor;

	if ( autor == undefined ){

		res.statusMessage = "Parametro de autor no incluido";
		return res.status(406).send();

	}else{

		let result = comentarios.filter( (elemento) => {

			if (elemento.autor == autor){

				return elemento;
			}
		
		});

		if (result){

			res.status(200).json(result);
		}
		else{

			res.statusMessage = "El autor no tiene comentarios en la lista";
			return res.status(404).send();
	}

	}

});

//SE INGRESA UN NUEVO COMENTARIO, TOMANDO EN CUENTA LAS VALIDACIONES QUE TENEMOS QUE HACER (LOS VALORES DE FECHA E ID SE AGREGAN DESDE AQUI)

app.post('/blog-api/nuevo-comentario',jsonParser,(req,res)=>{

		let objeto = req.body;
		let dia = new Date();

		let autorN = req.body.autor;
		let contenidoN = req.body.contenido;
		let tituloN = req.body.titulo;

		if (autorN == '' || contenidoN == '' || tituloN == '' ){

		res.statusMessage = "Falto uno de los elementos del objeto";
		return res.status(406).json({});

		}else{

			objeto.fecha = dia;
			objeto.id = uuid.v4(); 

			console.log(objeto);
			comentarios.push(objeto);

			let newComent = {

				id : uuid.v4(),
				titulo : tituloN,
				contenido : contenidoN,
				autor : autorN,
				fecha : dia
			}


			ComentList.create( newComent)
        		.then( ComentList => {
            	return res.status( 200 ).json( ComentList );
        	})
        		.catch( error => {
            	console.log(error);
            	res.statusMessage = "Hubo un error de conexion con la BD."
            	return res.status( 500 ).send();
        });

		}		

});

//REMUEVE UN COMENTARIO REALIZANDO ANTES VALIDACIONES DE PARAMETROS.

app.delete('/blog-api/remover-comentario/:id',jsonParser, (req,res)=> {

		 let idBorrar = req.params.id;

		 let objRemove = { id : idBorrar};

		 console.log(idBorrar);
		 console.log(objRemove);

		

		 	 ComentList.remove(objRemove) 
    			.then( ComentList => {
            	return res.status( 201 ).json( ComentList );
        	})
        		.catch( error => {
            	res.statusMessage = "Error en conexión con la base de datos";
            	return res.status( 500 ).json( error );
        });


	
});

//ACTUALIZA UN COMENTARIO MEDIANTE PUT, TOMANDO EN CUENTA VALIDACIONES.

app.put('/blog-api/actualizar-comentario/:id',jsonParser, (req,res)=> {

		 let idActualizar = req.params.id;



		 if (idActualizar == undefined){

		 	res.statusMessage = "No ha enviado id en request";
		 	return res.status(406).json({})

		 }
	
		let idV = req.params.id;
		let noTitulo = req.body.titulo;
		let noContenido = req.body.contenido;
		let noAutor = req.body.autor;

	

	

		if ( idActualizar != idV){

			res.statusMessage = "El id de REQUEST no coincide con id de Parametro(Objeto)";
		 	return res.status(409).json({})

		}


		if ( noTitulo == undefined && noContenido == undefined && noAutor == undefined){

			res.statusMessage = "Campos de Objeto VACIOS!";
		 	return res.status(406).json({})
		}
		
		let dia = new Date();
		let actualizar = req.body;
		let actComent = { id : idV };


		console.log(actComent);
		console.log(actualizar)
			

		ComentList.update(actComent, actualizar) 
   		.then( ComentList => {
            	return res.status( 201 ).json( ComentList );
        	})
        	.catch( error => {
            	res.statusMessage = "Error en conexión con la base de datos";
            	return res.status( 500 ).json( error );
        	});



});


let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL );

module.exports = { app, runServer, closeServer }


