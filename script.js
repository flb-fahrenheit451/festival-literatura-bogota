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
    return null; 
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.participant-card .avatar img').forEach(img => {
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      img.style.borderRadius = '50%';
    });
  });
})();

  // Crea un elemento <img> apuntando al avatar (intenta .png y cae a .jpg). size en px
  window.getParticipantAvatarElement = function(name, size = 84){
    const base = normalizeName(name);
    if(!base) return null;
    const pathPng = `IMAGENES/PARTICIPANTES/${base}.png`;
    const pathJpg = `IMAGENES/PARTICIPANTES/${base}.jpg`;
    const img = document.createElement('img');
    img.alt = name || '';
    img.loading = 'lazy';
    img.width = size;
    img.height = size;
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.onerror = function(){
      // si falla el PNG, intenta JPG; si falla el JPG, se remueve para permitir fallback a inicial
      if(this.src && this.src.toLowerCase().endsWith('.png')){
        this.src = pathJpg;
      } else {
        this.remove();
      }
    };
    img.src = pathPng;
    return img;
  };

  // Reemplaza los <div class="avatar">? con <img> cuando exista
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.participant-card').forEach(card => {
      const name = card.dataset.name || '';
      const avatarDiv = card.querySelector('.avatar');
      if(!avatarDiv) return;
      const img = window.getParticipantAvatarElement(name, 84);
      if(img){
        // adapta el img para ocupar el contenedor
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';
        img.className = 'participant-avatar-img';
        // limpiar y poner imagen
        avatarDiv.textContent = '';
        avatarDiv.appendChild(img);
      } else {
        // fallback: dejar inicial (como venía)
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
