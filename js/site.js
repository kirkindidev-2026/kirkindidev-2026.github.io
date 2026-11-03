'use strict';
(function () {
  // Galeri: fotoğrafı büyüt
  const lb = document.getElementById('lb');
  if (lb) {
    const big = lb.querySelector('img');
    document.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => {
      big.src = img.src; big.alt = img.alt; lb.classList.add('show');
    }));
    lb.addEventListener('click', () => lb.classList.remove('show'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('show'); });
  }

  // Rezervasyon: sunucu yok, yalnızca teşekkür mesajı
  const rez = document.getElementById('rez');
  if (rez) rez.addEventListener('submit', e => {
    e.preventDefault();
    const m = document.getElementById('rez-msg');
    m.className = 'msg ok show';
    m.textContent = 'Talebiniz alındı. Bu bir CTF sitesidir; gerçek rezervasyon yapılmaz ve bilgileriniz hiçbir yere gönderilmez.';
    rez.reset();
  });
})();
