// ==========================================================================
// Izadora Cassimiro Arquitetura — script (shared by all pages)
// ==========================================================================

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------- NAV SCROLL STATE ---------------- */
var nav = document.getElementById('mainNav');
if (nav){
  function onScroll(){
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* ---------------- MOBILE DRAWER ---------------- */
var drawer = document.getElementById('navDrawer');
var burgerBtn = document.getElementById('burgerBtn');
var drawerClose = document.getElementById('drawerClose');
if (drawer && burgerBtn && drawerClose){
  burgerBtn.addEventListener('click', function(){ drawer.classList.add('open'); });
  drawerClose.addEventListener('click', function(){ drawer.classList.remove('open'); });
  drawer.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ drawer.classList.remove('open'); });
  });
}

/* ---------------- GENERIC LIGHTBOX GALLERY ----------------
   Works on any page that has .gallery-item links + the lightbox markup.
   Nothing breaks if either is missing (guarded). */
var lightbox = document.getElementById('lightbox');
if (lightbox){
  var lbImg = document.getElementById('lbImg');
  var lbTitle = document.getElementById('lbTitle');
  var lbCount = document.getElementById('lbCount');
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var gallery = galleryItems.map(function(a){
    return { src: a.getAttribute('href'), caption: a.getAttribute('data-caption') || '' };
  });
  var currentIndex = 0;

  function updateLightbox(){
    var item = gallery[currentIndex];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.caption;
    if (lbTitle) lbTitle.textContent = item.caption;
    if (lbCount) lbCount.textContent = (currentIndex+1) + ' / ' + gallery.length;
  }
  function openLightbox(i){
    currentIndex = i;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function nextImg(){ currentIndex = (currentIndex + 1) % gallery.length; updateLightbox(); }
  function prevImg(){ currentIndex = (currentIndex - 1 + gallery.length) % gallery.length; updateLightbox(); }

  galleryItems.forEach(function(a, i){
    a.addEventListener('click', function(e){
      e.preventDefault();
      openLightbox(i);
    });
  });

  var lbClose = document.getElementById('lbClose');
  var lbNext = document.getElementById('lbNext');
  var lbPrev = document.getElementById('lbPrev');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', nextImg);
  if (lbPrev) lbPrev.addEventListener('click', prevImg);
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImg();
    if (e.key === 'ArrowLeft') prevImg();
  });

  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', function(e){
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 50) prevImg();
    else if (dx < -50) nextImg();
  });
}

/* ---------------- ORCAMENTO FORM ----------------
   Builds a WhatsApp message from the form fields. No backend needed. */
var orcamentoForm = document.getElementById('orcamentoForm');
if (orcamentoForm){
  orcamentoForm.addEventListener('submit', function(e){
    e.preventDefault();
    var nome = (document.getElementById('orcNome') || {}).value || '';
    var telefone = (document.getElementById('orcTelefone') || {}).value || '';
    var email = (document.getElementById('orcEmail') || {}).value || '';
    var tipo = (document.getElementById('orcTipo') || {}).value || '';
    var cidade = (document.getElementById('orcCidade') || {}).value || '';
    var mensagem = (document.getElementById('orcMensagem') || {}).value || '';

    var lines = [
      'Olá! Gostaria de solicitar um orçamento.',
      'Nome: ' + nome,
      'Tipo de projeto: ' + tipo
    ];
    if (cidade) lines.push('Cidade: ' + cidade);
    if (mensagem) lines.push('Detalhes: ' + mensagem);
    lines.push('Telefone: ' + telefone);
    if (email) lines.push('E-mail: ' + email);

    var text = encodeURIComponent(lines.join('\n'));
    var feedback = document.getElementById('orcFeedback');
    if (feedback){
      feedback.textContent = 'Abrindo o WhatsApp com sua solicitação...';
      feedback.classList.add('show');
    }
    window.open('https://wa.me/556799044601?text=' + text, '_blank');
  });
}

/* ---------------- SCROLL REVEAL ----------------
   IntersectionObserver adds motion as sections enter the viewport.
   A safety timeout guarantees everything becomes visible even if the
   observer never fires for some reason, so content can never get stuck. */
var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
if (revealEls.length){
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  // safety net: force-reveal anything left behind after 2.5s
  setTimeout(function(){
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }, 2500);
}

/* ---------------- HERO PARALLAX (subtle) ---------------- */
var heroBg = document.querySelector('.hero-bg');
if (heroBg){
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if (y < window.innerHeight){
      heroBg.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.06)';
    }
  });
}
