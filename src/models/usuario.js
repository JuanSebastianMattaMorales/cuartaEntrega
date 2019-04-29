const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
	dni: {
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
	correo: {
		type: String,
		required: true,
		trim: true
	},
	tel: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	rol: {
		type: String,
		required: true,
		trim: true
	},
	avatar: {
		type: Buffer
	}
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;