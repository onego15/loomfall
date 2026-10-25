import {mkdir,cp,rm} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const item of ['index.html','src','assets']) await cp(item,'dist/'+item,{recursive:true});
console.log('Static build ready: dist/ (all URLs are relative)');
