// Wklej adres pliku instalacyjnego lub wydania GitHub Releases.
const DOWNLOAD_URL = '';
const menu = document.querySelector('.menu');
const links = document.querySelector('.links');
function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#downloadButton').addEventListener('click',()=>{if(!DOWNLOAD_URL){document.querySelector('#status').textContent='Link do pobrania nie został jeszcze opublikowany.';return;}window.location.assign(DOWNLOAD_URL);});
