/* Click any content image to open it large. Images that are already inside a link are
   left alone, so document covers keep opening their document instead of their thumbnail. */
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('img')).filter(function (im) {
    if (im.closest('a')) return false;
    if (im.closest('.topbar') || im.closest('footer')) return false;
    return true;
  });
  if (!imgs.length) return;

  var ov = document.createElement('div');
  ov.className = 'lb';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close">Close</button>' +
    '<img class="lb-img" alt="">' +
    '<div class="lb-cap"><span class="lb-txt"></span>' +
    '<a class="lb-full" target="_blank" rel="noopener">Open original</a></div>';
  document.body.appendChild(ov);

  var lbImg = ov.querySelector('.lb-img');
  var lbTxt = ov.querySelector('.lb-txt');
  var lbFull = ov.querySelector('.lb-full');
  var lastFocus = null;

  function open(im) {
    lastFocus = im;
    lbImg.src = im.currentSrc || im.src;
    lbImg.alt = im.alt || '';
    lbTxt.textContent = im.alt || '';
    lbFull.href = im.src;
    ov.classList.add('on');
    document.body.classList.add('lb-open');
    ov.querySelector('.lb-close').focus();
  }

  function close() {
    ov.classList.remove('on');
    document.body.classList.remove('lb-open');
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  imgs.forEach(function (im) {
    im.classList.add('zoomable');
    im.setAttribute('role', 'button');
    im.setAttribute('tabindex', '0');
    if (!im.getAttribute('title')) im.setAttribute('title', 'Click to enlarge');
    im.addEventListener('click', function () { open(im); });
    im.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(im); }
    });
  });

  ov.addEventListener('click', function (e) {
    if (e.target === lbFull) return; // let the link do its job
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ov.classList.contains('on')) close();
  });
})();
