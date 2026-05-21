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
      <div class="post-actions">
        <button data-id="${post.id}" class="editBtn btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Edit
        </button>
      </div>
    `
    list.appendChild(el)
  })
  attachEditButtons()
}

function attachEditButtons(){
  document.querySelectorAll('.editBtn').forEach(b=>b.onclick = e=>{
    const id = e.currentTarget.dataset.id
    openEditor(blogs.find(p=>p.id==id))
  })
}

function openEditor(post){
  const modal = $('#editorModal')
  const form = $('#postForm')
  
  // Use native <dialog> API
  modal.showModal()
  
  form.title.value = post?.title || ''
  form.date.value = post?.date || new Date().toISOString().slice(0,10)
  form.tags.value = (post?.tags||[]).join(', ')
  form.content.value = post?.content || ''
  $('#formTitle').textContent = post ? 'Edit Post' : 'New Post'
  
  form.onsubmit = e => {
    e.preventDefault()
    const data = {
      id: post?.id || Date.now().toString(36),
      title: form.title.value.trim(),
      date: form.date.value,
      tags: form.tags.value.split(',').map(s=>s.trim()).filter(Boolean),
      content: form.content.value
    }
    if(post){
      const idx = blogs.findIndex(p=>p.id==post.id); blogs[idx]=data
    }else blogs.push(data)
    localStorage.setItem('blogs_backup', JSON.stringify(blogs))
    closeEditor()
    const searchQuery = $('#blogSearchInput')?.value.trim().toLowerCase() || ''
    renderBlogs(searchQuery)
  }
}

function closeEditor(){
  // Use native <dialog> API
  $('#editorModal').close()
}

function downloadBlogs(){
  const blob = new Blob([JSON.stringify(blogs, null, 2)],{type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'blogs.json'
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
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
  $('#newPostBtn').onclick = () => openEditor()
  $('#cancelEdit').onclick = closeEditor
  $('#downloadBtn').onclick = downloadBlogs
  $('#antigravityBtn').onclick = toggleAntigravity
  
  // Wire Live Search
  $('#blogSearchInput').oninput = e => {
    renderBlogs(e.target.value.trim().toLowerCase())
  }
  
  // Close dialog when clicking the backdrop overlay
  $('#editorModal').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (e.target.tagName === 'DIALOG' && (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )) {
      closeEditor()
    }
  })
})
