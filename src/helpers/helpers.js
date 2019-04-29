const hbs = require('hbs');

hbs.registerHelper('administrar', (listado) => {
	let texto = `<form action="/administrar" method="post">
		<table class='table table-striped table-hover'> 
				<thead class='thead-dark'>
				<th>Nombre</th>
				<th class="text-center">Estado</th>
				<th class="text-center">Inscritos</th>
				<th></th>
				</thead>
				<tbody>`;
	let textoC = texto;
	listado.forEach(curso => {
		let color = "";
		if (curso.estado == "Cerrado") {
			color = "color:red";
		} else {
			color = "color:green";
		}
		texto +=
			`<tr>
				<td> ${curso.nombre} </td>
				<td class="text-center" style="${color}"> ${curso.estado} </td>
				<td class="text-center"> ${curso.inscritos.length} </td>
				<td class="text-right">
					<button form="abrir" class="btn btn-success" name="curso" value="${curso.id}">Abrir</button>
					<button class="btn btn-danger" name="curso" value="${curso.id}">Cerrar</button>
				</td>
				</tr> `;
	})
	if (texto == textoC) {
		texto +=
			`<tr>
			<td> No hay cursos disponibles. </td>
			<td></td>
			<td></td>
			</tr>`
	}
	texto = texto + `</tbody> </table></form>
	<form id="abrir" action="/administrar2" method="post"></form>`;
	return texto;
});

hbs.registerHelper('administrar3', (listado, usuarios) => {
	let mainTexto = "";
	listado.forEach(curso => {
		let texto = `<h3 class="alert alert-info text-center">${curso.nombre}</h3>
		<form action="/eliminarAspirante" method="post">
		<table class='table table-striped table-hover'> 
				<thead class='thead-dark'>
				<th>DNI</th>
				<th>Nombre</th>
				<th></th>
				</thead>
				<tbody>
				<tr>`;
		let textoC = texto;
		for (let index = 0; index < curso.inscritos.length; index++) {
			usuarios.forEach(user => {
				if (user._id == curso.inscritos[index]) {
					texto += `<td> ${user.dni} </td>
					<td> ${user.nombre} </td>
					<td class="text-right">
						<input type="hidden" name="curso" value="${curso.id}"/>
						<button class="btn btn-danger" name="aspirante" value="${user._id}">Eliminar</button>
					</td>
					</tr>`
				}
			})
		}
		if (texto == textoC) {
			texto +=
				`<tr>
			<td> No hay aspirantes inscritos. </td>
			<td></td>
			<td></td>
			</tr>`
		}
		texto = texto + `</tbody> </table></form>`
		mainTexto += texto;
	})
	return mainTexto
});

hbs.registerHelper('inscribir', (listado) => {
	let texto = `<form action="/inscribirse" method="post">
		<table class='table table-striped table-hover'> 
				<thead class='thead-dark'>
				<th>ID</th>
				<th>Nombre</th>
				<th>Valor</th>
				<th></th>
				</thead>
				<tbody>`;
	let textoC = texto;
	listado.forEach(curso => {
		if (curso.estado != "Cerrado") {
			texto +=
				`<tr>
				<td>${curso.id}</td>
				<td>${curso.nombre}</td>
				<td>${curso.valor}</td>
				<td class="text-right"><button class="btn btn-success" name="curso" value="${curso.id}">Incribirse</button></td>
				</tr> `;
		}
	})
	if (texto == textoC) {
		texto +=
			`<tr>
			<td>No hay cursos disponibles.</td>
			<td></td>
			<td></td>
			</tr>`
	}
	texto = texto + '</tbody> </table></form>';
	return texto;
});

hbs.registerHelper('listar', (listado) => {
	let texto =
		`<div class="accordion" id="accordionExample">`;
	let cont = 0;
	listado.forEach(curso => {
		if (curso.estado != "Cerrado") {
			texto +=
				`<div class="card">
			<div class="card-header" id="heading${cont}">
				<h5 class="mb-0">
					<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${cont}"
						aria-expanded="false" aria-controls="collapse${cont}">
						<div class="text-left">
						<b>Nombre:</b> ${curso.nombre}<br>
						<b>Descripción:</b> ${curso.descripcion} <br>
						<b>Valor:</b> ${curso.valor}
						</div>
					</button>
				</h5>
			</div>

			<div id="collapse${cont}" class="collapse" aria-labelledby="heading${cont}" data-parent="#accordionExample">
				<div class="card-body">
				<b>Descripción:</b> ${curso.descripcion} <br>
				<b>Modalidad:</b> ${curso.modalidad} <br>
				<b>Intensidad:</b> ${curso.intensidad} <br>
				</div>
			</div>
		</div>`;
			cont++;
		}
	})
	if (texto == `<div class="accordion" id="accordionExample">`) {
		texto += `<div class="card">
		<div class="card-header" id="heading${cont}">
			<h5 class="mb-0">
				<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${cont}"
					aria-expanded="false" aria-controls="collapse${cont}" disabled>
					No hay cursos disponibles
					</div>
				</button>
			</h5>
		</div>`;
	}
	texto +=
		`</div>`;
	return texto;
});