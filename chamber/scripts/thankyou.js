document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(location.search);
    const first = params.get('firstname') || '';
    const last = params.get('lastname') || '';
    const email = params.get('email') || '';
    const phone = params.get('phone') || '';
    const business = params.get('business') || '';
    const timestamp = params.get('timestamp');
    const dt = timestamp ? new Date(timestamp) : null;

    document.getElementById('firstName').textContent = first;
    document.getElementById('lastName').textContent = last;
    document.getElementById('emailAddr').textContent = email;
    document.getElementById('mobilePhone').textContent = phone;
    document.getElementById('businessName').textContent = business;
    document.getElementById('submittedAt').textContent = dt ? dt.toLocaleString() : '';
});
