
//ESTA FUNCION SE MANDA LLAMAR EN INIT LA CUAL SE ACTIVA MEDIANTE EL EVENTO DE CLICK, DEPENDIENDO DEL VALOR ES EL PROCEDIMIENTO QUE REALIZA.


function procesoComentarios(){

	//FUNCION MEDIANTE EVENTO QUE NOS AYUDA A BUSCAR UN AUTOR, TOMAMOS EL VALOR USANOD GETELEMENT DIRECTO DEL HTML Y SE MANDA A LLAMAR GET
	//AL TERMINAR LA FUNCION MANDA LOS VALORES A DISPLAY YA QUE NO NECESITAMOS DE NINGUN CAMBIO
	let search = document.getElementById('buscar');
		buscar.addEventListener('submit', (event) =>{

			event.preventDefault();

				let url = 'http://localhost:8081/blog-api/comentarios-por-autor?autor='+document.getElementById('autor').value;
				let settings = {
					method : "GET"
				}
				fetch(url, settings)
					.then(response => {
						if(response.ok){
							return response.json();
						}
					})
					.then(responseJSON => {
						displayResults(responseJSON);
					});
			
		});
	
	//FUNCION QUE NOS AYUDA A GENERAR UN NUEVO COMENTARIO, TOMANDO COMO PARAMETRO SOLO LOS 3 VALORES QUE APARECEN
	//AL FINAL SE MANDAN LOS VALORES A COMENTARIOS D
	let nuevoC = document.getElementById('submitN');
		nuevoC.addEventListener('click', (event) =>{

			event.preventDefault();

			let titulo = document.getElementById('nuevoT').value;
			let autor = document.getElementById('nuevoA').value;
			let contenido = document.getElementById('nuevoCo').value;

			if(titulo!=""&&autor!=""&&contenido!=""){

				let url = "http://localhost:8081/blog-api/nuevo-comentario";
				
				let bodyJSON = {
					"titulo" : titulo,
					"autor" : autor,
					"contenido" : contenido
				}
				let settings = {
					method : "POST",
					body : JSON.stringify(bodyJSON),
					headers:{
    					'Content-Type': 'application/json'
  					}
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							return response.json();
					}

					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					comentariosD();
				});
			}
			document.getElementById('nuevoC').reset();
		});

	//FUNCION QUE NOS ACTUALIZA LOS VALORES, TOMANDO COMO PARAMETRO EL ID QUE SE PROPORCIONA EN EL HTML	

	let actualizarC = document.getElementById('submitA');
		actualizarC.addEventListener('click', (event) =>{
			let url = "http://localhost:8081/blog-api/actualizar-comentario/"+document.getElementById('actualizarId').value;

			let bodyJSON = {

				"titulo" : document.getElementById('actualizarT').value,
				"autor" : document.getElementById('actualizarA').value,
				"contenido" : document.getElementById('actualizarCo').value,
			}

			let settings = {
				method : "PUT",
				body : JSON.stringify(bodyJSON),
				headers:{
    				'Content-Type': 'application/json'
  				}
			}
			fetch(url, settings)
				.then((response)=>{
					if(response.ok){
						return response.json();
				}
					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					comentariosD();
				});
		});

	//FUNCION QUE BORRA EL COMENTARIO DEL ID QUE SE PROPORCIONA
	let comBorrar = document.getElementById('submitR');
		comBorrar.addEventListener('click', (event) =>{

				let url = "http://localhost:8081/blog-api/remover-comentario/"+document.getElementById('removerId').value;
				let settings = {
					method : "DELETE",
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							return response.json();
					}

					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					comentariosD();
				});
			
		});
}

//EN ESTA FUNCION HACEMOS UN LLAMADO A GET, LA UTILICE MÁS QUE NADA PARA LOS VALORES DEFAULT Y EN CASO DE QUE SE ACTUALICEN
function comentariosD(){

	let url = 'http://localhost:8081/blog-api/comentarios';

	let settings = {
		method : "GET"
	}
	fetch(url, settings)
		.then(response => {
			if(response.ok){
				return response.json();
			}
		})
		.then(responseJSON => {
			displayResults(responseJSON);
		});
}

//SE DESPLIEGAN RESULTADOS, (NO ES UNA MANERA MUY EFICIENTE) BUSCANDO IMPRIMIR LOS COMENTARIOS EN FORMATO LEGIBLE
function displayResults (responseJSON){

	let comentarios = document.getElementById('comentarios');
	comentarios.innerHTML = "";

	for(let i=0; i<responseJSON.length; i++){


		let id = responseJSON[i].id;
		let titulo = responseJSON[i].titulo;
		let contenido = responseJSON[i].contenido;
		let autor = responseJSON[i].autor;
		let fecha = responseJSON[i].fecha;
		let salto = document.createElement("div");
		let salto1 = document.createElement("div");
		let salto2 = document.createElement("div");
		let salto3 = document.createElement("div");
		let salto4 = document.createElement("div");
		let espacio = document.createElement("p"); 


		comentarios.append(salto);
		comentarios.append(titulo);
		comentarios.append(salto1);
		comentarios.append(contenido);
		comentarios.append(salto2);
		comentarios.append(autor);
		comentarios.append(salto3);
		comentarios.append(fecha);
		comentarios.append(salto4);
		comentarios.append(id);
		comentarios.append(espacio);
		

	}
}



function init(){

	comentariosD();
	procesoComentarios();
}
init();
