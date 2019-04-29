const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursoSchema = new Schema({
	id: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	descripcion: {
		type: String,
		required: true,
		trim: true
	},
	valor: {
		type: String,
		required: true,
		trim: true
	},
	modalidad: {
		type: String
	},
	intensidad: {
		type: String
	},
	estado: {
		type: String
	},
	inscritos: {
		type: [String]
	}
});

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;