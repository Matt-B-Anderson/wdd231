export async function loadStats() {
    const KEY = 'searchStats';
    let stats = JSON.parse(localStorage.getItem(KEY));
    if (!stats) {
        const res = await fetch('assets/data/searches.json');
        stats = res.ok ? await res.json() : { movies: [], tv: [] };
    }
    stats.movies.sort((a, b) => b.count - a.count);
    stats.tv.sort((a, b) => b.count - a.count);
    localStorage.setItem(KEY, JSON.stringify(stats));
    return stats;
}