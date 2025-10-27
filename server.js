import http from 'http';
import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';

const serve = serveStatic('.', { index: ['index.html', 'index.htm'] });

const server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
