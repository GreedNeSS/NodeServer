'use strict';

const os = require('os');
const express = require('express');
const cluster = require('cluster');
const app = express();

const user = { name: 'Ruslan', age: 30 };

if (cluster.isMaster) {

	console.log(`Started master ID: ${process.pid}`);
	const count = os.cpus().length;
	for (let i = 0; i < count; i++) cluster.fork();

} else {

	console.log(`Worker id: ${process.pid}`);
	app.get('/', (req, res) => {
		res.end(`Welcome to homepage. worker id: ${process.pid}`);
	});

	app.get('/user', (req, res) => {
		res.end(JSON.stringify(user) + '. worker id:' + process.pid);
	});

	app.get('/user/name', (req, res) => {
		res.end(user.name + '. worker id:' + process.pid);
	});

	app.get('/user/age', (req, res) => {
		res.end(user.age.toString() + '. worker id:' + process.pid);
	});

	app.listen(8000);

}
