/* ---------------------------------------------------------------
   ΦωτοΜέτρα — σύνδεση με άλλη εφαρμογή (π.χ. Δρομολόγιο)
   ---------------------------------------------------------------
   Τοποθέτηση: ανέβασε ΜΟΝΟ αυτό το αρχείο στο repository της εφαρμογής
   σου (π.χ. "dromologio"). Η ίδια η ΦωτοΜέτρα μένει στο δικό της
   repository — έτσι κάθε αναβάθμισή της περνάει αυτόματα και εδώ.

   Στο index.html της εφαρμογής σου, πριν το </body>:
       <script src="embed.js"></script>

   Χρήση:
       FotoMetra.open('pelatis:' + id, 'Παπαδόπουλος');   // μέσα στον πελάτη
       FotoMetra.open('*', 'Όλες οι φωτογραφίες');        // κεντρικό μενού
       FotoMetra.count('pelatis:' + id).then(n => ...);   // πόσες φωτό έχει
       FotoMetra.list('pelatis:' + id).then(recs => ...); // οι εγγραφές
   --------------------------------------------------------------- */
(function () {
  'use strict';

  /* Η ζωντανή ΦωτοΜέτρα. Επειδή είναι στον ίδιο ιστότοπο (aglentzakis-dot.github.io),
     οι δύο εφαρμογές μοιράζονται την ίδια αποθήκη — οι φωτογραφίες είναι κοινές.
     Κάθε φορά που αναβαθμίζεται η ΦωτοΜέτρα, η αλλαγή φαίνεται αμέσως και εδώ,
     χωρίς να πειράξεις τίποτα σε αυτή την εφαρμογή.
     (Αν κάποτε θελήσεις τοπικό αντίγραφο, βάλε: var APP = 'fotometra/index.html';) */
  var APP = 'https://aglentzakis-dot.github.io/fotometra/index.html';
  var ov = null;

  function open(owner, title) {
    close();
    ov = document.createElement('div');
    ov.setAttribute('data-fotometra', '1');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000';

    var f = document.createElement('iframe');
    var q = (APP.indexOf('?')<0?'?':'&') + 'embed=1&owner=' + encodeURIComponent(owner || '');
    if (title) q += '&title=' + encodeURIComponent(title);
    f.src = APP + q;
    f.style.cssText = 'width:100%;height:100%;border:0;display:block';
    f.allow = 'camera; web-share';

    ov.appendChild(f);
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!ov) return;
    ov.remove();
    ov = null;
    document.body.style.overflow = '';
    if (typeof window.onFotoMetraClose === 'function') {
      try { window.onFotoMetraClose(); } catch (e) {}
    }
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'fotometra-close') close();
  });

  function db() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open('fotometra', 1);
      r.onupgradeneeded = function () {
        if (!r.result.objectStoreNames.contains('p')) r.result.createObjectStore('p', { keyPath: 'id' });
      };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }

  function list(owner) {
    return db().then(function (d) {
      if (!d.objectStoreNames.contains('p')) return [];
      return new Promise(function (res, rej) {
        var t = d.transaction('p', 'readonly');
        var q = t.objectStore('p').getAll();
        q.onsuccess = function () { res(q.result || []); };
        q.onerror = function () { rej(q.error); };
      });
    }).then(function (all) {
      if (owner && owner !== '*') all = all.filter(function (r) { return (r.owner || '') === owner; });
      return all.sort(function (a, b) { return b.date - a.date; });
    }).catch(function () { return []; });
  }

  function count(owner) { return list(owner).then(function (r) { return r.length; }); }

  /* Μικρογραφία εγγραφής, για να δείχνεις προεπισκόπηση μέσα στην εφαρμογή σου.
     Θυμήσου να καλέσεις URL.revokeObjectURL(url) όταν δεν τη χρειάζεσαι πια. */
  function thumb(rec) { return rec && rec.blob ? URL.createObjectURL(rec.blob) : null; }

  window.FotoMetra = { open: open, close: close, list: list, count: count, thumb: thumb };
})();
