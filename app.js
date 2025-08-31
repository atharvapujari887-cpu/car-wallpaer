
list.sort((a,b)=> new Date(b.date) - new Date(a.date));
}


gallery.innerHTML = '';
resultsInfo.textContent = `${list.length} result${list.length!==1?'s':''}`;


if(list.length === 0){
gallery.innerHTML = `<div class="panel">No wallpapers match your filters.</div>`;
return;
}


const tpl = document.getElementById('cardTemplate');
for(const w of list){
const node = tpl.content.cloneNode(true);
const art = node.querySelector('.card');
const img = node.querySelector('img'); img.src = w.url; img.alt = w.title;
node.querySelector('.title').textContent = w.title;
node.querySelector('.author').textContent = w.author || 'Unknown';
node.querySelector('.date').textContent = formatDate(w.date);
const likeBtn = node.querySelector('.like-btn');
const likeCount = node.querySelector('.like-count');
likeCount.textContent = likes[w.id] || 0;
likeBtn.addEventListener('click', ()=>{
likes[w.id] = (likes[w.id] || 0) + 1;
saveLikes(likes);
likeCount.textContent = likes[w.id];
likeBtn.classList.add('liked');
});


const tagsWrap = node.querySelector('.card-tags');
(w.tags||[]).forEach(t=>{
const tEl = document.createElement('button');
tEl.className='tag'; tEl.textContent = t; tEl.addEventListener('click', ()=>{
// toggle tag in the sidebar UI
const btn = [...tagsContainer.children].find(b=> b.dataset.tag===t);
if(btn){ btn.click(); }
});
tagsWrap.appendChild(tEl);
});


gallery.appendChild(node);
}
}


// UI handlers
searchInput.addEventListener('input', (e)=>{ query = e.target.value; render(); });
clearSearch.addEventListener('click', ()=>{ searchInput.value=''; query=''; render(); });


els('.section-btn').forEach(b=> b.addEventListener('click', (ev)=>{
els('.section-btn').forEach(x=> x.classList.remove('active'));
ev.currentTarget.classList.add('active');
currentSection = ev.currentTarget.dataset.section;
render();
}));


el('#onlyLiked').addEventListener('change', (e)=>{ onlyLiked = e.target.checked; render(); });


// init default active section button
const defaultBtn = document.querySelector('.section-btn[data-section="all"]');
defaultBtn && defaultBtn.classList.add('active');


// load
loadData();
