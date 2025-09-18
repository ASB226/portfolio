document.addEventListener('DOMContentLoaded', function() {
    const navDots = document.querySelectorAll('.nav-dot');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const navLogo = document.querySelector('.nav-logo');
    
    // showPage 함수 정의
    function showPage(index) {
        if (pages[index]) {
            pages[index].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // 로고 클릭 이벤트
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            showPage(0);
        });
    }
    
    // 네비게이션 도트 클릭 이벤트
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (pages[index]) {
                pages[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 상단 네비게이션 클릭 이벤트
    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (pages[index]) {
                pages[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 스크롤 시 활성 네비게이션 업데이트
    function updateActiveNav() {
        let current = 0;
        const scrollY = window.scrollY + window.innerHeight / 2;
        
        pages.forEach((page, index) => {
            const pageTop = page.offsetTop;
            const pageBottom = pageTop + page.offsetHeight;
            
            if (scrollY >= pageTop && scrollY < pageBottom) {
                current = index;
            }
        });
        
        // 도트 업데이트
        navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === current);
        });
        
        // 상단 메뉴 업데이트
        navItems.forEach((item, index) => {
            item.classList.toggle('active', index === current);
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // 초기 실행
});
