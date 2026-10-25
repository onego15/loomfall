import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.gif':'image/gif','.json':'application/json'};
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}const f=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(f,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data)})}).listen(Number(process.argv[2]||process.env.PORT)||5187,'0.0.0.0',()=>console.log('LOOMFALL http://localhost:5187'));
