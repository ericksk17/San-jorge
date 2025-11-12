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
      themeBtn.title = mode==='dark' ? 'Tema claro' : 'Tema oscuro';
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
    function currentLang(){ return root.getAttribute('lang') || 'es'; }

    function applyI18n(lang){
      const pack = dict[lang] || dict.es;
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

    const storedLang = safeGet('lang') || 'es';
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
        type: (dict[lang]||dict.es)['search.type'],
        none: (dict[lang]||dict.es)['search.no']
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
    topBtn.title='Volver arriba'; 
    topBtn.textContent='⬆'; 
    document.body.appendChild(topBtn);
    const toggleTop=()=>{ if(window.scrollY>400) topBtn.classList.add('show'); else topBtn.classList.remove('show'); }; 
    window.addEventListener('scroll', toggleTop, {passive:true}); 
    toggleTop(); 
    topBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

    // =========================
    // ANIMACIONES Y TRANSICIONES MEJORADAS
    // =========================
    
    // CSS para las animaciones
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
      /* ANIMACIONES PERSONALIZADAS */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      /* Clases de animación */
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out;
      }

      .animate-fade-in-left {
        animation: fadeInLeft 0.8s ease-out;
      }

      .animate-fade-in-right {
        animation: fadeInRight 0.8s ease-out;
      }

      .animate-pulse-slow {
        animation: pulse 3s infinite;
      }

      .animate-float {
        animation: float 3s ease-in-out infinite;
      }

      /* Animaciones específicas para elementos */
      .hero .stack > * {
        opacity: 0;
      }

      .hero .shots img:not(.lightboxable) {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
      }

      .card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s ease;
      }

      .gallery figure {
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.5s ease;
      }

      /* Mejoras a las transiciones existentes */
      .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease, transform 0.5s ease !important;
      }

      .btn {
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease !important;
      }

      .action {
        transition: all 0.3s ease !important;
      }

      /* Efectos hover mejorados */
      .card:hover {
        transform: translateY(-8px) scale(1.02);
      }

      .btn:hover {
        transform: translateY(-2px);
      }

      .action:hover {
        transform: scale(1.1);
      }

      /* Logo animation */
      .brand-logo {
        transition: transform 0.3s ease;
      }
      
      .brand-logo:hover {
        transform: scale(1.05);
      }

      /* Asegurar que las imágenes de la galería sean visibles */
      .gallery img.lightboxable {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
    `;
    document.head.appendChild(animationStyles);

    function initAnimations() {
      // Animación del hero section
      setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .stack > *');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
          }, 200 * index);
        });
      }, 300);

      // Animación de las imágenes del hero (EXCLUIR lightboxable)
      setTimeout(() => {
        const heroShots = document.querySelectorAll('.hero .shots img:not(.lightboxable)');
        heroShots.forEach((img, index) => {
          setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'translateY(0)';
          }, 400 + (index * 100));
        });
      }, 800);

      // Animación de cards al hacer scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observar cards
      document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
      });

      // Observar elementos de la galería
      document.querySelectorAll('.gallery figure').forEach(figure => {
        observer.observe(figure);
      });

      // Animación para el botón de tema
      if(themeBtn){
        themeBtn.addEventListener('click', function() {
          this.style.transform = 'scale(0.8)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 300);
        });
      }

      // Animación de carga para imágenes (EXCLUIR lightboxable y logo)
      const images = document.querySelectorAll('img:not(.lightboxable):not(.brand-logo)');
      images.forEach(img => {
        if (img.complete) {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        } else {
          img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
          });
        }
        
        // Solo aplicar fade-in a imágenes que no son lightboxable
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
    // =========================
    // LIGHTBOX SIMPLE Y FUNCIONAL
    // =========================
    
    // Crear elemento lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'simple-lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `;
    
    lightbox.innerHTML = `
        <button id="lightbox-close" style="
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
        ">×</button>
        <img id="lightbox-image" style="
            max-width: 90%;
            max-height: 80vh;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        ">
        <div id="lightbox-caption" style="
            color: white;
            margin-top: 15px;
            font-size: 16px;
            text-align: center;
        "></div>
    `;
    
    document.body.appendChild(lightbox);
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Función para abrir lightbox
    function openLightbox(imgElement) {
        const imgSrc = imgElement.src;
        const imgAlt = imgElement.alt;
        
        lightboxImage.src = imgSrc;
        lightboxCaption.textContent = imgAlt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        console.log('Lightbox abierto con imagen:', imgSrc);
    }
    
    // Función para cerrar lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Event listeners para cerrar
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    // Agregar event listeners a todas las imágenes lightboxable
    function initLightboxableImages() {
        const images = document.querySelectorAll('.lightboxable');
        console.log('Encontradas', images.length, 'imágenes lightboxable');
        
        images.forEach(img => {
            // Hacer la imagen clickeable
            img.style.cursor = 'zoom-in';
            img.style.transition = 'transform 0.2s ease';
            
            // Agregar efecto hover
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Agregar evento click
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en imagen:', this.src);
                openLightbox(this);
            });
        });
    }
    
    // Inicializar cuando el DOM esté listo
    initLightboxableImages();
    
    // Re-inicializar si se cargan nuevas imágenes
    const originalApplyI18n = window.applyI18n;
    if (originalApplyI18n) {
        window.applyI18n = function(lang) {
            originalApplyI18n(lang);
            setTimeout(initLightboxableImages, 100);
        };
    }
      // Efecto de aparición suave para el header
      const header = document.querySelector('header');
      if (header) {
        // Asegurar que el logo esté visible inmediatamente
        const logo = document.querySelector('.brand-logo');
        if (logo) {
          logo.style.opacity = '1';
          logo.style.transform = 'scale(1)';
        }
        
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        header.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
          header.style.opacity = '1';
          header.style.transform = 'translateY(0)';
        }, 200);
      }

      // Animación para el botón de idioma
      if(langBtn){
        langBtn.addEventListener('click', function() {
          this.style.transform = 'rotate(180deg)';
          setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
          }, 300);
        });
      }

      // Animación para el menú móvil
      if(menuBtn){
        menuBtn.addEventListener('click', function() {
          this.style.transform = 'scale(0.9)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 200);
        });
      }
    }

    // Inicializar animaciones después de un pequeño delay
    setTimeout(() => {
      initAnimations();
    }, 100);
  });
})();