(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const $ = (s,sc=document)=> sc.querySelector(s);

    // =========================
    // Menu toggle
    // =========================
    const menuBtn = $('#menuBtn'); 
    const nav = document.querySelector('header nav');
    if(menuBtn && nav){
      menuBtn.addEventListener('click', ()=>{
        nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', nav.classList.contains('open'));
      });
    }

    // =========================
    // Theme toggle (robusto)
    // =========================
    const root = document.documentElement;
    const themeBtn = $('#themeBtn');

    function safeSet(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
    function safeGet(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }

    function setThemeIcon(mode){
      if(!themeBtn) return;
      // Usamos SVG sol/luna controlado por CSS; aquí solo títulos/aria:
      themeBtn.title = mode==='dark' ? 'Light theme' : 'Dark theme'; // Cambiado a inglés
      themeBtn.setAttribute('aria-label', themeBtn.title);
    }
    function applyTheme(mode){
      root.setAttribute('data-theme', mode);
      document.body.classList.toggle('dark', mode==='dark');
      document.body.classList.toggle('light', mode==='light');
      setThemeIcon(mode);
      safeSet('theme', mode);
    }

    const storedT = safeGet('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initTheme = storedT || (prefersLight ? 'light':'dark');
    applyTheme(initTheme);

    if(themeBtn){
      themeBtn.addEventListener('click', ()=>{
        const cur = root.getAttribute('data-theme') || initTheme;
        const next = cur==='dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    // =========================
    // i18n: diccionario + aplicación
    // =========================
    const dict = {
      es: {
        'nav.home': 'Inicio',
        'nav.hist': 'Historia',
        'nav.econ': 'Gastronomía',
        'nav.sitios': 'Sitios',
        'nav.sobre': 'San Jorge',
        'nav.gastro': 'Gastronomía',

        'index.kicker': 'Puerto • Cultura • Naturaleza',
        'index.h1': 'Bienvenido a San Jorge',
        'index.p': 'Puerta de entrada a Ometepe, con legado nicarao, puerto activo y paisajes del Cocibolca.',
        'index.cta1': 'Descubrir sitios',
        'index.cta2': 'Cómo llegar a Ometepe',
        'index.h2why': 'Motivos para visitar',
        'index.h2gal': 'Galería',

        'search.title': 'Buscar',
        'search.placeholder': 'Buscar…',
        'search.type': 'Escribe para buscar…',
        'search.no': 'Sin resultados.'
      },
      en: {
        'nav.home': 'Home',
        'nav.hist': 'History',
        'nav.econ': 'Gastronomy',
        'nav.sitios': 'Highlights',
        'nav.sobre': 'About San Jorge',
        'nav.gastro': 'Gastronomy',

        'index.kicker': 'Harbor • Culture • Nature',
        'index.h1': 'Welcome to San Jorge',
        'index.p': 'Gateway to Ometepe with Nicarao heritage, an active harbor and lake vistas.',
        'index.cta1': 'Explore highlights',
        'index.cta2': 'How to reach Ometepe',
        'index.h2why': 'Reasons to visit',
        'index.h2gal': 'Gallery',

        'search.title': 'Search',
        'search.placeholder': 'Search…',
        'search.type': 'Type to search…',
        'search.no': 'No results.'
      }
    };

    const langBtn = $('#langBtn');
    function currentLang(){ return root.getAttribute('lang') || 'en'; } // Cambiado a 'en'

    function applyI18n(lang){
      const pack = dict[lang] || dict.en; // Cambiado a dict.en por defecto
      root.setAttribute('lang', lang);

      // Texto interior
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key = el.getAttribute('data-i18n');
        const val = pack[key];
        if (val != null) el.textContent = val;
      });

      // Atributos
      document.querySelectorAll('[data-i18n-title]').forEach(el=>{
        const key = el.getAttribute('data-i18n-title');
        const val = pack[key];
        if (val != null) el.setAttribute('title', val);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const key = el.getAttribute('data-i18n-placeholder');
        const val = pack[key];
        if (val != null) el.setAttribute('placeholder', val);
      });

      // Botón idioma: muestra el próximo
      if(langBtn){
        const next = lang === 'es' ? 'EN' : 'ES';
        langBtn.textContent = next;
        langBtn.title = lang === 'es' ? 'Switch to English' : 'Cambiar a español';
        langBtn.setAttribute('aria-label', langBtn.title);
      }

      safeSet('lang', lang);

      // Actualiza textos del overlay de búsqueda si ya está en DOM
      const searchTitle = $('[data-i18n="search.title"]');
      const searchField = $('#searchField');
      if(searchTitle) searchTitle.textContent = pack['search.title'];
      if(searchField) searchField.setAttribute('placeholder', pack['search.placeholder']);
    }

    // CAMBIO PRINCIPAL: Inglés por defecto
    const storedLang = safeGet('lang') || 'en'; // Cambiado de 'es' a 'en'
    applyI18n(storedLang);

    if(langBtn){
      langBtn.addEventListener('click', ()=>{
        const next = currentLang() === 'es' ? 'en' : 'es';
        applyI18n(next);
      });
    }

    // =========================
    // Lightbox simple
    // =========================
    const lb = document.createElement('div'); 
    lb.id='lightbox'; 
    lb.innerHTML='<div class="lb-backdrop"></div><img class="lb-img" alt="">'; 
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('.lb-img'); 
    const closeLb = ()=> lb.classList.remove('show');
    lb.addEventListener('click', (e)=>{ if(e.target===lb || e.target.classList.contains('lb-backdrop')) closeLb(); }); 
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLb(); });
    
    // Lightbox - asegurar que las imágenes sean clickeables
    document.querySelectorAll('.lightboxable').forEach(img=> {
      // Asegurar que las imágenes lightboxable sean siempre visibles
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
      img.style.cursor = 'pointer';
      
      img.addEventListener('click', ()=>{
        lbImg.src = img.currentSrc || img.src; 
        lb.classList.add('show'); 
      });
    });

    // Un poco de estilo para el lightbox (inline para simplificar)
    const style = document.createElement('style');
    style.textContent = `
      #lightbox{position:fixed;inset:0;z-index:20000;display:none;place-items:center}
      #lightbox.show{display:grid}
      #lightbox .lb-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(2px)}
      #lightbox .lb-img{position:relative;max-width:min(92vw,1100px);max-height:80vh;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      
      /* Asegurar que las imágenes lightboxable sean siempre visibles */
      .lightboxable {
        opacity: 1 !important;
        transform: scale(1) !important;
        cursor: pointer;
        transition: transform 0.3s ease !important;
      }
      .lightboxable:hover {
        transform: scale(1.02) !important;
      }
    `;
    document.head.appendChild(style);

    // =========================
    // Search overlay
    // =========================
    const overlay = $('#searchOverlay'); 
    const openBtn = $('#searchBtn'); 
    const closeBtn = $('#searchClose'); 
    const field = $('#searchField'); 
    const results = $('#searchResults');

    function messages(){
      const lang = currentLang();
      return {
        type: (dict[lang]||dict.en)['search.type'], // Cambiado a dict.en
        none: (dict[lang]||dict.en)['search.no'] // Cambiado a dict.en
      };
    }

    function openSearch(){ 
      if(!overlay) return;
      overlay.hidden = false; 
      document.body.style.overflow='hidden'; 
      setTimeout(()=> field && field.focus(), 10); 
      renderResults(''); 
    }
    function closeSearch(){ 
      if(!overlay) return;
      overlay.hidden = true; 
      document.body.style.overflow=''; 
    }
    openBtn && openBtn.addEventListener('click', openSearch); 
    closeBtn && closeBtn.addEventListener('click', closeSearch);
    overlay && overlay.addEventListener('click', (e)=>{ if(e.target===overlay || e.target.classList.contains('search-backdrop')) closeSearch(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && overlay && !overlay.hidden) closeSearch(); });

    // Índice de búsqueda
    const index = []; 
    (function buildIndex(){ 
      const blacklist=new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','HEADER','FOOTER','NAV','BUTTON']); 
      const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode:n=>{ 
        const p=n.parentElement; 
        if(!p || blacklist.has(p.tagName)) return NodeFilter.FILTER_REJECT; 
        const t=n.textContent.trim(); 
        return t.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT; 
      }}); 
      let n; 
      while(n=walker.nextNode()){ index.push({text:n.textContent.trim(), el:n.parentElement}); } 
    })();

    function highlight(t,q){ 
      if(!q) return t; 
      const re=new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','ig'); 
      return t.replace(re,'<mark>$1</mark>'); 
    }
    function renderResults(q){ 
      if(!results) return; 
      const msg = messages();
      results.innerHTML=''; 
      if(!q){ results.innerHTML='<div class="result">'+msg.type+'</div>'; return; } 
      const found=index.filter(i=> i.text.toLowerCase().includes(q.toLowerCase())).slice(0,30); 
      if(!found.length){ results.innerHTML='<div class="result">'+msg.none+'</div>'; return; } 
      found.forEach(i=>{ 
        const div=document.createElement('div'); 
        div.className='result'; 
        div.innerHTML=highlight(i.text,q); 
        div.addEventListener('click', ()=>{ 
          closeSearch(); 
          i.el.scrollIntoView({behavior:'smooth', block:'center'}); 
          i.el.style.outline='2px solid var(--accent)'; 
          setTimeout(()=> i.el.style.outline='',1100); 
        }); 
        results.appendChild(div); 
      }); 
    }
    field && field.addEventListener('input', e=> renderResults(e.target.value.trim()));

    // =========================
    // Botón Volver arriba
    // =========================
    const topBtn = document.createElement('button'); 
    topBtn.id='toTop'; 
    topBtn.title='Back to top'; // Cambiado a inglés
    topBtn.textContent='⬆'; 
    document.body.appendChild(topBtn);
    const toggleTop=()=>{ if(window.scrollY>400) topBtn.classList.add('show'); else topBtn.classList.remove('show'); }; 
    window.addEventListener('scroll', toggleTop, {passive:true}); 
    toggleTop(); 
    topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

    // ... el resto de tu código permanece igual ...
    // Solo asegúrate de que las funciones currentLang() usen 'en' por defecto
  });
})();
