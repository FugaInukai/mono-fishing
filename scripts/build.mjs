import {mkdir,copyFile,writeFile} from 'node:fs/promises';
// Allowlist only browser assets. Never publish source, saves or environment files.
const root=new URL('../',import.meta.url),output=new URL('public/',root);await mkdir(output,{recursive:true});
for(const file of ['index.html','app.js','style.css','data.mjs','fish-profiles.mjs','graphics.mjs','world.mjs','environment.mjs'])await copyFile(new URL(file,root),new URL(file,output));
await writeFile(new URL('runtime.json',output),JSON.stringify({transport:'polling'}));
console.log('Vercel browser assets prepared in public/ (player saves excluded)');
