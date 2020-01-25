
//Declaracion de todos los requires necesarios (se debieron haber instalado en terminal)

let express = require( "express" );

let morgan = require( "morgan" );

let bodyParser = require("body-parser");

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


	res.status( 200 ).json( comentarios );

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

		let autor = req.body.autor;
		let contenido = req.body.contenido;
		let titulo = req.body.titulo;

		if (autor == '' || contenido == '' || titulo == '' ){

		res.statusMessage = "Falto uno de los elementos del objeto";
		return res.status(406).json({});

		}else{

			objeto.fecha = dia;
			objeto.id = uuid.v4(); 

			console.log(objeto);
			comentarios.push(objeto);
			res.statusMessage = "COMENTARIO AGREGADO :)";
			return res.status(201).json({objeto});

		}		

});

//REMUEVE UN COMENTARIO REALIZANDO ANTES VALIDACIONES DE PARAMETROS.

app.delete('/blog-api/remover-comentario/:id',jsonParser, (req,res)=> {

		 let idBorrar = req.params.id;

		 let result = comentarios.find( (elemento) => {

			if (elemento.id == idBorrar){

				console.log("Se encontro un id igual");
				return elemento;
			}
		
		});

		 if (result){

		 	comentarios = comentarios.filter((elemento) => {

		 		if ( result.id != elemento.id){
		 			return elemento
		 		}
		 	});

		 		return res.status(200).json({});
		 }else{

		 	res.statusMessage = "No existe comentario con ese id";
		 	return res.status(404).json({})
		 }
	
});

//ACTUALIZA UN COMENTARIO MEDIANTE PUT, TOMANDO EN CUENTA VALIDACIONES.

app.put('/blog-api/actualizar-comentario/:id',jsonParser, (req,res)=> {

		 let idActualizar = req.params.id;

		 if (idActualizar == undefined){

		 	res.statusMessage = "No ha enviado id en request";
		 	return res.status(406).json({})

		 }
	
		let idObjeto = req.params.id;
		let noTitulo = req.body.titulo;
		let noContenido = req.body.contenido;
		let noAutor = req.body.autor;

		console.log(idObjeto);

		if ( idActualizar != idObjeto){

			res.statusMessage = "El id de REQUEST no coincide con id de Parametro(Objeto)";
		 	return res.status(409).json({})

		}


		if ( noTitulo == undefined && noContenido == undefined && noAutor == undefined){

			res.statusMessage = "Campos de Objeto VACIOS!";
		 	return res.status(406).json({})
		}
		
		let result = comentarios.find((elemento) =>{

				if (idObjeto == elemento.id){

					elemento.titulo = req.body.titulo;
					elemento.contenido = req.body.contenido;
					elemento.autor = req.body.autor;

					
				}
				
				
		});

		return res.status(202).json(result);


});


app.listen( 8081,() => {  //Requiere dos parametros, numero de puerto en que corre y funcion anonima

	console.log("Servidor corriendo en puerto 8081");

}); 


