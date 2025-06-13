document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-list a');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });

  async function initStats() {
    if (!localStorage.getItem('topMovies') || !localStorage.getItem('topShows')) {
      try {
        const res  = await fetch('/data/initial-stats.json');
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        localStorage.setItem('topMovies', JSON.stringify(data.topMovies));
        localStorage.setItem('topShows', JSON.stringify(data.topShows));
      } catch (err) {
        console.error('Unable to load initial stats:', err);
      }
    }
  }

  function populate(key, id) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    const list = document.getElementById(id);
    data.slice(0, 10).forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  initStats().then(() => {
    populate('topMovies', 'topMovies');
    populate('topShows',  'topShows');
  });

  const form = document.querySelector('.search-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.q.value.trim();
    if (!q) return;

    // ['topMovies','topShows'].forEach(key => {
    //   const arr = JSON.parse(localStorage.getItem(key)) || [];
    //   const updated = [q, ...arr.filter(x => x !== q)].slice(0, 10);
    //   localStorage.setItem(key, JSON.stringify(updated));
    // });

    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  });
});