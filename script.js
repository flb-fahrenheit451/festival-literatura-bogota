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

// ---- Línea de tiempo interactiva (usada en sobre-el-festival.html) ----
(function(){
  const track = document.getElementById('timeline-track');
  const detail = document.getElementById('timeline-detail');
  if(!track || !detail) return;

  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
  const timelineData = romans.map((r) => {
    const isCurrent = r === "XV";
    return {
      roman: r,
      year: "2026",
      title: isCurrent ? "Vendrán Lluvias Suaves" : "[Título pendiente]",
      text: isCurrent
        ? "Edición dedicada a la ciencia ficción, en homenaje al cuento de Ray Bradbury \"Vendrán lluvias suaves\"."
        : "[Espacio reservado para reseña de esta edición: tema, hitos y actividades destacadas.]",
      link: isCurrent ? "edicion-15.html" : null
    };
  });

  function renderDetail(idx){
    const item = timelineData[idx];
    detail.innerHTML = `
      <div class="td-head">
        <span class="td-roman">Edición ${item.roman}</span>
        <span class="td-year">${item.year}</span>
      </div>
      <h3 style="margin-bottom:10px;">${item.title}</h3>
      <p>${item.text}</p>
      ${item.link ? `<a class="td-link" href="${item.link}">Ver edición completa →</a>` : ''}
    `;
    document.querySelectorAll('.timeline-node').forEach((n, i) => {
      n.classList.toggle('active', i === idx);
    });
  }

  timelineData.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'timeline-node';
    btn.innerHTML = `<span class="dot"></span><span class="roman-label">${item.roman}</span>`;
    btn.addEventListener('click', () => renderDetail(idx));
    track.appendChild(btn);
  });

  renderDetail(timelineData.length - 1);
})();

// ---- Avatares de participantes ----
(function(){
  window.getParticipantAvatarElement = function(name, size = 84){
    if(!name) return null;
    
    // Mapeo exacto para los nombres compuestos que requieren archivos específicos
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
      
      // Si el HTML ya tiene una imagen adentro, la respetamos y estilizamos
      const existingImg = avatarDiv.querySelector('img');
      if(existingImg){
        existingImg.style.width = '100%';
        existingImg.style.height = '100%';
        existingImg.style.objectFit = 'cover';
        existingImg.style.display = 'block';
        existingImg.style.borderRadius = '50%';
        return;
      }

      // Si no la tiene, el script la genera usando el mapeo
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
    // intentar mostrar imagen en el modal (misma lógica de nombre)
    modalAvatar.innerHTML = '';
    const avatarEl = window.getParticipantAvatarElement(card.dataset.name || '', 84);
    if(avatarEl){
      // estilo para el modal (84x84 con border-radius ya aplicado)
      avatarEl.style.width = '84px';
      avatarEl.style.height = '84px';
      modalAvatar.appendChild(avatarEl);
    } else {
      modalAvatar.textContent = (card.dataset.name || '?').charAt(0);
    }

    lastFocused = document.activeElement;
    modal.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal(){
    modal.hidden = true;
    document.removeEventListener('keydown', onKeydown);
    if(lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.participant-card').forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
})();

document.addEventListener("DOMContentLoaded", function() {
    const footerHTML = `
      <div class="container footer-content">
        <div class="footer-logo">
          <img src="IMAGENES/LOGOS/FUNDFAH.png" alt="Fundación Fahrenheit 451">
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
