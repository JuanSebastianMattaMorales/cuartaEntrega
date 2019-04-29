require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var MemoryStore = require('memorystore')(session);

const dirPublic = path.join(__dirname, "../public");
const dirNode_modules = path.join(__dirname, '../node_modules');

app.use(express.static(dirPublic));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use(session({
	cookie: { maxAge: 86400000 },
	store: new MemoryStore({
		checkPeriod: 86400000
	}),
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use((req, res, next) => {
	if (req.session.usuario) {
		res.locals.sesion = true;
		if (req.session.rol == "Coordinador") {
			res.locals.coordinador = true
		}
		res.locals.avatar = req.session.avatar
		res.locals.nombre = req.session.nombre
	}
	next()
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./routes/index'));

cont = 0;
io.on('connection', client => {
	client.on("contador", () => {
		cont++;
		io.emit("contador", cont);
	})
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resultado) => {
	if (err) {
		return console.log(err)
	}
	console.log("Conectado a la base de datos")
});

server.listen(process.env.PORT, () => {
	console.log('Servidor localhost en el puerto: ' + process.env.PORT)
});

