'use strict';

const http = require('http');

const BASE_PORT = 2000;

const pid = process.pid;
const id = parseInt(process.argv[2], 10);
const port = BASE_PORT + id;
const user = { name: 'Ruslan', age: 30 };

const routing = {
	'/': '<h1>Welcom to homepage</h1><hr>',
	'/user': user,
	'/user/name': () => user.name.toUpperCase(),
	'/user/age': () => user.age,
	'/hello': { hello: 'World', andArray: [1, 2, 3, 4, 5, 6, 7] },
	'/api/method1': (req, res) => {
		console.log(req.url + ' ' + res.statusCode);
		return { status: res.statusCode };
	},
	'/api/method2': req => ({
		user,
		url: req.url,
		cookie: req.headers.cookie
	}),
};

const types = {
	object: JSON.stringify,
	string: s => s,
	undefined: () => 'not found',
	function: (fn, req, res) => JSON.stringify(fn(req, res)),
};

console.log(`Worker: ${id + 1}, pid: ${pid}, port: ${port}`);
http.createServer((req, res) => {
	const data = routing[req.url];
	const type = typeof data;
	const serializer = types[type];
	res.setHeader('Process-Id', pid);
	console.log({ pid });
	res.end(serializer(data, req, res));
}).listen(port);
