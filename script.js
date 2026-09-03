// ---- Countdown (usado en index.html) ----
(function(){
  const daysEl = document.getElementById('cd-days');
  if(!daysEl) return;

  const target = new Date("2026-10-05T14:00:00-05:00").getTime();
  function updateCountdown(){
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    daysEl.textContent = d;
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-min').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-sec').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ---- Avatares de participantes ----
(function(){
  window.getParticipantAvatarElement = function(name, size = 84){
    if(!name) return null;
    
    let fileName = '';
    const cleanName = name.trim().toLowerCase();
    
    if(cleanName.includes('andrea salgado')) fileName = 'ANDREASALGADO';
    else if(cleanName.includes('andrea chapela')) fileName = 'ANDREACHAPELA';
    else if(cleanName.includes('fernanda')) fileName = 'FERNANDA';
    else {
      let first = name.trim().split(/\s+/)[0] || '';
      fileName = first.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }

    const pathPng = `IMAGENES/PARTICIPANTES/${fileName}.png`;
    const img = document.createElement('img');
    img.alt = name || '';
    img.loading = 'lazy';
    img.width = size;
    img.height = size;
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    
    img.onerror = function(){
      this.remove();
    };
    
    img.src = pathPng;
    return img;
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.participant-card').forEach(card => {
      const name = card.dataset.name || '';
      const avatarDiv = card.querySelector('.avatar');
      if(!avatarDiv) return;
      
      const existingImg = avatarDiv.querySelector('img');
      if(existingImg){
        existingImg.style.width = '100%';
        existingImg.style.height = '100%';
        existingImg.style.objectFit = 'cover';
        existingImg.style.display = 'block';
        existingImg.style.borderRadius = '50%';
        return;
      }

      const img = window.getParticipantAvatarElement(name, 84);
      if(img){
        avatarDiv.textContent = '';
        avatarDiv.appendChild(img);
      } else {
        avatarDiv.textContent = (name || '?').charAt(0);
      }
    });
  });
})();

// ---- Modal de biografía (usado en participantes.html) ----
(function(){
  const modal = document.getElementById('bio-modal');
  if(!modal) return;

  const modalAvatar = document.getElementById('modal-avatar');
  const modalName = document.getElementById('modal-name');
  const modalRole = document.getElementById('modal-role');
  const modalBio = document.getElementById('modal-bio');
  const closeBtn = document.getElementById('modal-close');
  let lastFocused = null;

  function onKeydown(e){
    if(e.key === 'Escape') closeModal();
  }

  function openModal(card){
    modalName.textContent = card.dataset.name || '';
    modalRole.textContent = card.dataset.role || '';
    modalBio.textContent = card.dataset.bio || '';
    
    modalAvatar.innerHTML = '';
    const avatarEl = window.getParticipantAvatarElement(card.dataset.name || '', 84);
    if(avatarEl){
      avatarEl.style.width = '84px';
      avatarEl.style.height = '84px';
      modalAvatar.appendChild(avatarEl);
    } else {
      modalAvatar.textContent = (card.dataset.name || '?').charAt(0);
    }

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if(lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.participant-card').forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
})();

// ---- Footer dinámico ----
document.addEventListener("DOMContentLoaded", function() {
    const footerHTML = `
      <div class="container footer-content">
        <div class="footer-logo">
          <a href="https://www.fundacion451.com/" target="_blank" rel="noopener noreferrer">
            <img src="IMAGENES/LOGOS/FUNDFAH.png" alt="Fundación Fahrenheit 451">
          </a>
        </div>
        <div class="footer-text">
          <p>Organización cultural independiente sin ánimo de lucro.</p>
          <p>&copy; 2026 Festival de Literatura de Bogotá. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    const existingFooter = document.querySelector("footer");
    if (existingFooter) {
        existingFooter.innerHTML = footerHTML;
    }
});

// --- Control JS para el modal de "talleres" en index.html (abre/cierra sin :target) ---
(function(){
  const modal = document.getElementById('modal-talleres');
  if (!modal) return;

  // Abre desde enlaces que apuntan a #modal-talleres
  document.querySelectorAll('a[href="#modal-talleres"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      // limpiar fragmento de URL (no dependemos de :target)
      try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
      const close = modal.querySelector('.modal-close');
      if (close && typeof close.focus === 'function') close.focus();
    });
  });

  // Cerrar desde los botones/enlaces con clase .modal-close dentro del modal
  modal.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.hidden = true;
      document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
    });
  });

  // Cerrar al hacer click fuera del .modal-content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      modal.hidden = true;
      document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname + location.search); } catch(e){}
    }
  });
})();
