document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('timestamp')) {
        document.getElementById('timestamp').value = new Date().toISOString();
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const modal = document.getElementById(card.dataset.modal);
            modal.style.display = 'flex';
        });
    });
    const closes = document.querySelectorAll('.close-modal');
    closes.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});
