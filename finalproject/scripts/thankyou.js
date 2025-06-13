document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const data = {
        name: params.get('name') || '',
        email: params.get('email') || '',
        phone: params.get('phone') || '',
        rating: params.get('rating') || '',
        suggestions: params.get('suggestions') || '',
        subscribe: params.get('subscribe') || 'no'
    };

    const section = document.getElementById('thankyouSection');
    const dl = document.createElement('dl');

    function addTerm(label, value) {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        dl.appendChild(dt);
        dl.appendChild(dd);
    }

    const h1 = document.createElement('h1');
    h1.textContent = `Thank you, ${data.name}!`;
    section.appendChild(h1);

    addTerm('Email', data.email);
    addTerm('Phone', data.phone);
    addTerm('Rating', data.rating);
    addTerm('Suggestions', data.suggestions || '—');
    addTerm('Subscribed to newsletter', data.subscribe === 'yes' ? 'Yes' : 'No');

    section.appendChild(dl);
});
