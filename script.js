'use strict';
// Wstaw tutaj adres HTTPS do zweryfikowanego wydania klienta.
const DOWNLOAD_URL = '';
const menu = document.querySelector('#menu');
const links = document.querySelector('#links');
function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
if(DOWNLOAD_URL){try{const url=new URL(DOWNLOAD_URL);if(url.protocol==='https:'){const link=document.querySelector('#download-link');link.href=url.href;link.hidden=false;document.querySelector('#download-status').hidden=true;}}catch{}}
