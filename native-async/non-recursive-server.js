'use strict';

const http = require('http');

const user = { name: 'Ruslan', age: 30 };

const routing = {
	'/': '<h1>Welcom to homepage</h1><hr>',
	'/user': user,
	'/user/name': () => user.name.toUpperCase(),
	'/user/age': () => user.age,
	'/hello': { hello: 'World', andArray: [1, 2, 3, 4, 5, 6, 7] },
	'/api/method1': (req, res, callback) => {
		console.log(req.url + ' ' + res.statusCode);
		callback({ status: res.statusCode });
	},
	'/api/method2': req => ({
		user,
		url: req.url,
		cookie: req.headers.cookie
	}),
};

const types = {
	object: ([data], callback) => callback(JSON.stringify(data)),
	string: ([str], callback) => callback(str),
	undefined: (args, callback) => callback('not found'),
	function: ([fn, req, res], callback) => {
		if (fn.length === 3) fn(req, res, callback);
		else callback(JSON.stringify(fn(req, res)));
	},
};

const serve = (data, req, res) => {
	const type = typeof data;
	const serializer = types[type];
	serializer([data, req, res],
		data => (
			(typeof data === 'string') ?
				res.end(data) :
				res.end(JSON.stringify(data))
		)
	);
};

http.createServer((req, res) => {
	const data = routing[req.url];
	serve(data, req, res);
}).listen(8000);

setInterval(() => user.age++, 2000);
