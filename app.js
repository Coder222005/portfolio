const BLOGS_SRC = 'blogs.json'

let blogs = []
const $ = sel => document.querySelector(sel)

async function loadBlogs(){
  try{
    const res = await fetch(BLOGS_SRC,{cache:'no-store'})
    blogs = await res.json()
  }catch(e){
    const stored = localStorage.getItem('blogs_backup')
    blogs = stored ? JSON.parse(stored) : []
  }
  const searchQuery = $('#blogSearchInput')?.value.trim().toLowerCase() || ''
  renderBlogs(searchQuery)
}

function renderBlogs(searchQuery = ''){
  const list = $('#blogList')
  let filtered = blogs;
  if(searchQuery){
    filtered = blogs.filter(post => 
      post.title.toLowerCase().includes(searchQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
    );
  }
  if(!filtered.length) {
    return list.innerHTML = '<p style="text-align:center; padding: 3rem; color: var(--text-muted);">No posts found matching your search.</p>'
  }
  
  list.innerHTML = ''
  filtered.slice().reverse().forEach(post=>{
    const el = document.createElement('div')
    el.className = 'post'
    
    // Format date cleanly
    let dateStr = '';
    if(post.date){
      const d = new Date(post.date);
      if(!isNaN(d.getTime())){
        dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } else {
        dateStr = post.date;
      }
    }
    
    const tagsHtml = (post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')
    
    el.innerHTML = `
      <h3>${escapeHtml(post.title)}</h3>
      <div class="meta">
        ${dateStr ? `
          <div class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${dateStr}</span>
          </div>
        ` : ''}
        ${dateStr && tagsHtml ? '<span class="meta-divider">|</span>' : ''}
        ${tagsHtml ? `
          <div class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            <div style="display:inline-flex; gap:0.25rem; flex-wrap:wrap;">${tagsHtml}</div>
          </div>
        ` : ''}
      </div>
      <div class="content">${post.content}</div>
    `
    list.appendChild(el)
  })
}

function escapeHtml(s){
  return (s||'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
}

/* Dynamic Particles for Antigravity Mode */
let particleInterval = null;

function toggleAntigravity(){
  const isActive = document.body.classList.toggle('antigravity')
  if(isActive){
    startParticles()
  } else {
    stopParticles()
  }
}

function startParticles(){
  if(particleInterval) return;
  particleInterval = setInterval(()=>{
    if(!document.body.classList.contains('antigravity')){
      stopParticles()
      return
    }
    createParticle()
  }, 200)
}

function stopParticles(){
  clearInterval(particleInterval)
  particleInterval = null
  document.querySelectorAll('.particle').forEach(p => p.remove())
}

function createParticle(){
  const p = document.createElement('div')
  p.className = 'particle'
  
  const size = Math.random() * 4 + 2 // 2px to 6px
  const x = Math.random() * 100 // 0vw to 100vw
  const duration = Math.random() * 6 + 4 // 4s to 10s
  const drift = (Math.random() - 0.5) * 300 // drift offset in px
  
  p.style.width = `${size}px`
  p.style.height = `${size}px`
  p.style.left = `${x}vw`
  p.style.setProperty('--duration', `${duration}s`)
  p.style.setProperty('--drift', `${drift}px`)
  
  p.style.opacity = Math.random() * 0.4 + 0.3
  
  document.body.appendChild(p)
  
  setTimeout(() => p.remove(), duration * 1000)
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadBlogs()
  
  // Wire buttons
  $('#antigravityBtn').onclick = toggleAntigravity
  
  // Wire Live Search
  $('#blogSearchInput').oninput = e => {
    renderBlogs(e.target.value.trim().toLowerCase())
  }
})
