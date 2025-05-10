const copywrightYearElement = document.getElementById('currentyear');
const lastModifiedElement = document.getElementById('lastModified');

const currentYear = new Date().getFullYear();
copywrightYearElement.textContent = currentYear;

const lastModified = `Last Modification: ${document.lastModified}`;
lastModifiedElement.textContent = lastModified;