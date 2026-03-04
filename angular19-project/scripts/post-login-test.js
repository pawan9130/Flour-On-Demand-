const http = require('http');
const data = JSON.stringify({ email: 'priya@mills.example', password: 'adminpass1' });

const options = {
  hostname: 'localhost', port: 3000, path: '/auth/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('STATUS', res.statusCode, 'BODY', body));
});
req.on('error', e => console.error('ERR', e));
req.write(data);
req.end();
