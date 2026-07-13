
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-wrapper a[href]');

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage ||
            href === currentPage.replace('.html', '') ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});
