process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/asignaturas';
}
else {
	urlDB = 'mongodb+srv://nodejstdea:nodejstdea@nodejstdea-qpr2v.mongodb.net/asignaturas?retryWrites=true'
}

process.env.URLDB = urlDB
process.env.SENDGRID_API_KEY="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";