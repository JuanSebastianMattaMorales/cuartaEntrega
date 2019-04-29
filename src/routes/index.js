const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');
const bcrypt = require('bcrypt');
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('./../helpers/helpers');

app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

app.get('/', (req, res) => {
	res.render('index')
});
var upload = multer({
	limits: {
		fileSize: 10000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|png|jpeg)$/i)) {
			cb(null, false)
		} else {
			cb(null, true)
		}
	}
});

app.post('/', upload.single("archivo"), (req, res) => {
	if (req.file) {
		let usuario = new Usuario({
			dni: req.body.dni,
			nombre: req.body.nombre,
			correo: req.body.correo,
			tel: req.body.tel,
			rol: "Aspirante",
			password: bcrypt.hashSync(req.body.password, 10),
			avatar: req.file.buffer
		});
		const msg = {
			to: req.body.correo,
			from: 'daniel_diosa82172@elpoli.edu.co',
			subject: 'Registro éxitoso',
			text: 'Bienvenido a la página de la cuarta entrega de Node.JS, su registro ha sido éxitoso.'
		};
		usuario.save((err, resultado) => {
			if (err) {
				return res.render('index', {
					mostrar: `<div class="alert alert-danger"><h3>ERROR: Ya existe un usuario con ese documento de identidad, por favor verifique.</h3></div>`,
					nombre: req.body.nombre,
					correo: req.body.correo,
					tel: req.body.tel
				});
			}
			sgMail.send(msg);
			res.render('index', {
				mostrar: `<div class="alert alert-success"><h3>Usuario ${resultado.nombre} registrado, por favor inicie sesión.</h3></div>`
			});
		});
	} else {
		return res.render('index', {
			mostrar: `<div class="alert alert-danger"><h3>ERROR: Tipo de archivo no válido, por favor verifique que sea una imagen de máximo 8MB.</h3></div>`,
			dni: req.body.dni,
			nombre: req.body.nombre,
			correo: req.body.correo,
			tel: req.body.tel
		});
	}
});

app.get('/registrarcurso', (req, res) => {
	res.render('registrarcurso', {
		titulo: 'Registro de cursos',
		modalidad: "No asignada"
	})
});
app.post('/registrarcurso', (req, res) => {
	let curso = new Curso({
		id: req.body.id,
		nombre: req.body.nombreC,
		descripcion: req.body.descripcion,
		valor: "$" + req.body.valor,
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad,
		estado: "Disponible"
	});
	if (curso.intensidad == "") {
		curso.intensidad = "No asignada";
	} else {
		curso.intensidad += "h";
	}
	curso.save((err, resultado) => {
		if (err) {
			return res.render('registrarcurso', {
				titulo: 'Registro de cursos',
				mostrar: `<div class="alert alert-danger"><h3>ERROR: Ya existe un curso con ese ID, por favor verifique.</h3></div>`,
				nombreC: req.body.nombreC,
				descripcion: req.body.descripcion,
				valor: req.body.valor,
				modalidad: req.body.modalidad,
				intensidad: req.body.intensidad
			});
		}
		res.render('registrarcurso', {
			titulo: 'Registro de cursos',
			mostrar: `<div class="alert alert-success"><h3>Curso ${resultado.nombre} registrado.</h3></div>`,
			modalidad: "No asignada"
		});
	});
});

app.get('/vercursos', (req, res) => {
	Curso.find({}, (err, respuesta) => {
		if (err) {
			return console.log(err)
		}
		res.render('vercursos', {
			listado: respuesta
		});
	});
});

app.get('/inscribirse', (req, res) => {
	Curso.find({}, (err, respuesta) => {
		if (err) {
			return console.log(err)
		}
		res.render('inscribirse', {
			listado: respuesta
		});
	});
});
app.post('/inscribirse', (req, res) => {
	Curso.findOne({ id: req.body.curso }, (e, r) => {
		if (e) {
			return console.log(err)
		}
		Curso.findOneAndUpdate({ id: req.body.curso },
			{ "$addToSet": { "inscritos": req.session.usuario } },
			{ new: true, runValidators: true, context: 'query' },
			(err, curso) => {
				if (err) {
					return console.log(err)
				}
				Curso.find({}, (err, respuesta) => {
					if (r.inscritos.length != curso.inscritos.length) {
						res.render('inscribirse', {
							mostrar: `<div class="alert alert-success"><h3>Se ha inscrito en el curso con ID: ${req.body.curso} exitosamente.</h3></div>`,
							listado: respuesta
						});
					} else {
						res.render('inscribirse', {
							mostrar: `<div class="alert alert-danger"><h3>Ya está inscrito en el curso con ID: ${req.body.curso}.</h3></div>`,
							listado: respuesta
						});
					}
				});
			});
	})
});

app.get('/administrar', (req, res) => {
	Curso.find({}, (err, respuesta) => {
		if (err) {
			return console.log(err)
		}
		res.render('administrar', {
			listado: respuesta
		});
	});
});
app.post('/administrar', (req, res) => {
	Curso.findOneAndUpdate({ id: req.body.curso },
		{ $set: { "estado": "Cerrado" } }, { new: true, runValidators: true, context: 'query' },
		(err, resultados) => {
			if (err) {
				return console.log(err)
			}
			Curso.find({}, (err, respuesta) => {
				if (err) {
					return console.log(err)
				}
				res.render('administrar', {
					listado: respuesta
				});
			});
		});
});
app.post('/administrar2', (req, res) => {
	Curso.findOneAndUpdate({ id: req.body.curso },
		{ $set: { "estado": "Disponible" } }, { new: true, runValidators: true, context: 'query' },
		(err, resultados) => {
			if (err) {
				return console.log(err)
			}
			Curso.find({}, (err, respuesta) => {
				if (err) {
					return console.log(err)
				}
				res.render('administrar', {
					listado: respuesta
				});
			});
		});
});

app.get('/administrar3', (req, res) => {
	Usuario.find({}, (e, r) => {
		Curso.find({}, (err, respuesta) => {
			if (err) {
				return console.log(err)
			}
			res.render('administrar3', {
				listado: respuesta,
				usuarios: r
			});
		});
	})
});

app.post('/eliminarAspirante', (req, res) => {
	Curso.findOneAndUpdate({ id: req.body.curso },
		{ $pull: { "inscritos": req.body.aspirante } }, { new: true, runValidators: true, context: 'query' },
		(err, resultados) => {
			if (err) {
				return console.log(err)
			}
			Usuario.find({}, (e, r) => {
				Curso.find({}, (err, respuesta) => {
					if (err) {
						return console.log(err)
					}
					res.render('administrar3', {
						listado: respuesta,
						usuarios: r
					});
				});
			})
		});
});

app.post('/ingresar', (req, res) => {
	Usuario.findOne({ dni: req.body.dni }, (err, resultados) => {
		if (err) {
			return console.log(err);
		}
		if (!resultados) {
			return res.render('ingresar', {
				mensaje: `<div class="alert alert-danger"><h3>Usuario y/o contraseña incorrecta.</h3></div>`,
			});
		}
		if (!bcrypt.compareSync(req.body.password, resultados.password)) {
			return res.render('ingresar', {
				mensaje: `<div class="alert alert-danger"><h3>Usuario y/o contraseña incorrecta.</h3></div>`,
			});
		}
		req.session.usuario = resultados._id;
		req.session.nombre = resultados.nombre;
		req.session.rol = resultados.rol;
		if (resultados.rol == "Coordinador") {
			return res.render('ingresar', {
				mensaje: `<div class="alert alert-success"><h3>Bienvenido coordinador ${resultados.nombre}, elija una opción en el menú.</h3></div>`,
				nombre: resultados.nombre,
				coordinador: true,
				sesion: true
			});
		}
		req.session.avatar = resultados.avatar.toString("base64");
		return res.render('ingresar', {
			mensaje: `<div class="alert alert-success"><h3>Bienvenido aspirante ${resultados.nombre}, elija una opción en el menú.</h3></div>`,
			nombre: resultados.nombre,
			sesion: true,
			avatar: req.session.avatar
		});
	});
});

app.get("/cambiar", (req, res) => {
	res.render("cambiar")
})

app.post("/cambiar", (req, res) => {
	Usuario.findOne({ _id: req.session.usuario }, (err, resultados) => {
		if (err) {
			return console.log(err);
		}
		// if (!resultados) {
		// 	return res.render('cambiar', {
		// 		mensaje: `<div class="alert alert-danger"><h3>Contraseña incorrecta.</h3></div>`,
		// 	});
		// }
		if (!bcrypt.compareSync(req.body.viejaPass, resultados.password)) {
			return res.render('cambiar', {
				mensaje: `<div class="alert alert-danger"><h3>Contraseña actual incorrecta.</h3></div>`,
			});
		}
		Usuario.findOneAndUpdate({ _id: req.session.usuario },
			{ $set: { "password": bcrypt.hashSync(req.body.nuevaPass, 10) } }, { new: true, runValidators: true, context: 'query' },
			(err, resultados) => {
				if (err) {
					return console.log(err)
				}
				res.render("cambiar", {
					mensaje: `<div class="alert alert-success"><h3>Contraseña cambiada exitosamente.</h3></div>`,
				})
			});
	})
})

app.get("/cambiar2", (req, res) => {
	res.render("cambiar2")
})

app.post("/cambiar2", upload.single("archivo"), (req, res) => {
	if (req.file) {
		Usuario.findOneAndUpdate({ _id: req.session.usuario },
			{ $set: { "avatar": req.file.buffer } }, { new: true, runValidators: true, context: 'query' },
			(err, resultados) => {
				if (err) {
					return console.log(err)
				}
				Usuario.findOne({ _id: req.session.usuario }, (err, resultados) => {
					if (err) {
						return console.log(err);
					}
					req.session.avatar = resultados.avatar.toString("base64");
					res.render("cambiar2", {
						mensaje: `<div class="alert alert-success"><h3>Foto de perfil cambiada exitosamente.</h3></div>`,
						avatar: req.session.avatar
					})
				})
			})
	} else {
		return res.render('cambiar2', {
			mostrar: `<div class="alert alert-danger"><h3>ERROR: Tipo de archivo no válido, por favor verifique que sea una imagen de máximo 8MB.</h3></div>`,
		});
	}
})

app.get('/salir', (req, res) => {
	req.session.destroy((err) => {
		if (err) return console.log(err)
	});
	res.redirect('/');
})

app.get('*', (req, res) => {
	res.render('error', {
		titulo: "Error 404",
	})
});

module.exports = app;