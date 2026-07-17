/* Galactic Conquest — site interactions */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  /* Mobile menu toggle */
  if (toggle && nav && links) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    /* Close the menu after tapping a link */
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Add a solid background to the nav once the page is scrolled */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- What's New (patch-notes.json, synced from the app) ---------- */
  var listEl = document.getElementById('whatsnewList');
  var moreBtn = document.getElementById('whatsnewMore');
  var INITIAL_RELEASES = 4;

  function releaseCard(release, isLatest) {
    var card = document.createElement('article');
    card.className = 'release' + (isLatest ? ' release--latest' : '');

    var head = document.createElement('div');
    head.className = 'release__head';
    var v = document.createElement('span');
    v.className = 'release__version';
    v.textContent = 'v' + release.version;
    var d = document.createElement('span');
    d.className = 'release__date';
    d.textContent = release.date;
    head.appendChild(v);
    head.appendChild(d);
    if (isLatest) {
      var badge = document.createElement('span');
      badge.className = 'release__badge';
      badge.textContent = 'Latest';
      head.appendChild(badge);
    }
    card.appendChild(head);

    var ul = document.createElement('ul');
    (release.changes || []).forEach(function (change) {
      var li = document.createElement('li');
      var chip = document.createElement('span');
      chip.className = 'change-chip change-chip--' + change.type;
      chip.textContent = change.type;
      var txt = document.createElement('span');
      txt.textContent = change.text;
      li.appendChild(chip);
      li.appendChild(txt);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    return card;
  }

  if (listEl) {
    fetch('patch-notes.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var releases = data.releases || [];
        releases.slice(0, INITIAL_RELEASES).forEach(function (rel, i) {
          listEl.appendChild(releaseCard(rel, i === 0));
        });
        if (releases.length > INITIAL_RELEASES && moreBtn) {
          moreBtn.hidden = false;
          moreBtn.addEventListener('click', function () {
            releases.slice(INITIAL_RELEASES).forEach(function (rel) {
              listEl.appendChild(releaseCard(rel, false));
            });
            moreBtn.hidden = true;
          }, { once: true });
        }
      })
      .catch(function () {
        listEl.textContent = 'Patch notes are loading slowly — check back in a moment.';
      });
  }
})();
