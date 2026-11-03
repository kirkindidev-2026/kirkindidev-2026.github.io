/* Kod & Kahve · personel paneli
   Panel içeriği şifreli tutulur; yalnızca doğru kullanıcı adı ve şifreyle açılır. */
'use strict';
(function () {
  const BOX = {
    salt: '0IfsBVI5x27ivEhLqqB6eg==',
    iv: 'YxiDdFZVfr61VrA1',
    ct: 'V/luhAh8YBg1YZSJ0/XDEXmApOoVsvwCPSNfLmZHS8F1Hnny3tVsxq7B4Ko1L2nW7xBorzJOeMRQPp+EEQx2G/WK1AhtYZJHwm6QpoMsFeu+wx6za58h04/b4ZECx3+aogPJD6vDqo64yUs8rUqIeNjwlBqeI+IOh5mq6VY65447cZbsutw6lEGIyuAJhsv6RBs1kHco+CIb2OpkttgqlgiXuV4r+aUysRfrazZCKg8n8M67wmjQLdRZRfZFuV/zLtGxhkb9cnvzYrA7Ln7hF56sCnQ9+Quj+ZlJEb0zK1rjjfY+ShEvg7R44Ov5cvEMGBOa3Fx0OGPuFblN7YASnMshnAhvlxpMfk/AB3cK2lyYIqEpNB2vcA9wjzZw2LXyl+ZS4F0t1T5kpM31PNS5b4VLYmaO+eyj1BV86GWfglPDWQFMif2wzQQl8bHRq+OBygojH4/KVkr1ofeZ4XoLh+AItMgCjCKyHMlqCTt4HZs8u44QSlVR1VEpL1rdyYotYXtPtuT4WIBBRuYgaBE8q+D7R3c4ScwyxcOrjFdbXf/XsP0gGkBNuP3p6XZldGA5YZZTIO9hIkQFeKfpFlJnmXX/Nz9Kr4QmxCYSM/fwMdMwaM7/XGtQqhRrw97Ju4tbmOvgI9ypQqKb/GXiyAarDaB2o6VVOn3eM4ozQsaXsIAZs179XjgRvV4iFYQTWSh0hEycXE79yobQhGUCJ7Bv85MqoodUj6bfIWFOljt97hDXYi9HAuaWwByZW80r/QC3Nym2T+jSa0cto40FQPE2gXAU302a/7Wlllj83EbqO2UCGo4lShFO9vyIj0EWD/Wu0QF+ydpfAjH4XPr3QmRZ1XLRdlGaCoK9n1Ego0E3OZhgfll6egsJww9PlUdIzM3mZgSPbXqd04rjMGkBEYC+Q6Rgu2UC3ECxm/w8ZWQyzowN34LJEV2myNwSUuFySP9b4x9vPLve4N26Y0o5M++zgbKbNSgV9koX7Qh6kDghfbxUhkG5GCdYsgT365olJOh96ctVG3WPwIcujSPghfUxH+BCnVoqaAReYL/102+K1HmiCH/OeqXZcDPT9t4W5ukR9jO8iiSKX1M4zOLCDxUqqZbLSVHX+BkRBci/LfPP8jsSFVs6h+Zgbwu5bD42W4cNbXjEnObNxBcpyrM6yWiHC3/ONpz8+OZ9sA3fQ+XmkQ/5WAuFBUhI3PGyt72+Zj0C5mPNYK0B6f1BaAL/TcAJ2OLg9r2EROg4djeaX8elAJpx7Ss0IxoRFMn7eJ3hmPgWbWdE+0Bn4qiZNKf7KUrLYKVJJuAAhvuqbhUmKCuBL/tI+LibF3m0W3SRqLCPc8zmxCWZ0kBiqDmJhqQwXO7Mk0njxgfHTMCRBI/I6lm19vbQ/KGbzuVE4aDE9oIKswCN4oxzHowIfF+hjdYgwlHn21sQJkjAgqDnlF6I7aj2RIbiN/md5dOtTFrTMCKXdW8RwW8xB7H/Az5TGtJZP+GLlJYkXb7/fBcYYyL5gHS9JI+Czqxzv86/Pacp9pEWo9Rd2xknnbtgRs4CXKJlIzVtmvpvGCcaseqeluPVcZT/kNIvH7Bqe+DoxBxh6XZ7GqSqyae3mQMWJvtGOLLglitfYSuFbNu8CsjoghoWeyZZwnKz5CTAcgRXzo5Wvo2jJVUglCzcGPAO7BRsp67oAI2vTJ+FB1x3b3zfHFhfFm/SEJ49kugpBsvJyki7DomrU7KZAoCKjiLoumoR',
    iterations: 250000
  };

  const f = document.getElementById('giris');
  const msg = document.getElementById('giris-msg');
  const go = document.getElementById('go');
  const enc = new TextEncoder();
  const unb64 = s => Uint8Array.from(atob(s), ch => ch.charCodeAt(0));

  async function open(secret) {
    const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: unb64(BOX.salt), iterations: BOX.iterations, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    try {
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(BOX.iv) }, key, unb64(BOX.ct));
      return new TextDecoder().decode(pt);
    } catch (e) { return null; }
  }

  f.addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('u').value.trim().toLocaleLowerCase('tr');
    const p = document.getElementById('p').value.trim();
    if (!window.crypto || !crypto.subtle) { msg.className = 'msg bad show'; msg.textContent = 'Tarayıcınız desteklemiyor.'; return; }
    go.disabled = true; go.textContent = 'Kontrol ediliyor…';
    const html = await open(u + ':' + p);
    go.disabled = false; go.textContent = 'Giriş';
    if (!html) { msg.className = 'msg bad show'; msg.textContent = 'Kullanıcı adı veya şifre hatalı.'; return; }
    f.remove();
    document.getElementById('panel').innerHTML = html;
  });
})();
