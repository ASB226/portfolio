// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize scroll animations
// Initialize scroll animations (Cover page only)
function initScrollAnimations() {
    // Only apply to cover page elements
    const coverPage = document.querySelector('.cover-page');
    if (!coverPage) return;
    
    const selectors = [
        '.cover-name',
        '.cover-title', 
        '.cover-subtitle',
        '.cover-contact'
    ];
    
    let coverElements = [];
    
    selectors.forEach(selector => {
        const elements = coverPage.querySelectorAll(selector);
        elements.forEach(element => {
            coverElements.push(element);
        });
    });
    
    // Sort elements by their position within the cover page
    coverElements.sort((a, b) => {
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            return -1;
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            return 1;
        }
        return 0;
    });
    
    // Apply animation classes only to cover page elements
    coverElements.forEach((element, index) => {
        element.classList.add('fade-in-element');
        element.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(element);
    });
    
    console.log(`Cover page: ${coverElements.length} elements`);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Auto-hide Navigation
    const nav = document.querySelector('.top-nav');
    const coverPage = document.querySelector('.cover-page');
    let isOnCoverPage = true;
    
    // Check if user is on cover page
    function checkCoverPage() {
        const coverRect = coverPage.getBoundingClientRect();
        const isCurrentlyOnCover = coverRect.bottom > window.innerHeight * 0.5;
        
        if (isCurrentlyOnCover !== isOnCoverPage) {
            isOnCoverPage = isCurrentlyOnCover;
            
            if (isOnCoverPage) {
                // On cover page - show nav normally
                nav.classList.remove('nav-hidden');
                nav.classList.remove('nav-hover-reveal');
            } else {
                // Not on cover page - hide nav and enable hover reveal
                nav.classList.add('nav-hidden');
                nav.classList.add('nav-hover-reveal');
            }
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', checkCoverPage);
    
    // Initial check
    checkCoverPage();
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuDropdown = document.querySelector('.mobile-menu-dropdown');
    
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuDropdown.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
                mobileMenuDropdown.classList.remove('active');
            }
        });
        
        // Close menu when clicking on menu item
        const mobileNavItems = mobileMenuDropdown.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenuDropdown.classList.remove('active');
            });
        });
    }

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when nav item is clicked
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    const navDots = document.querySelectorAll('.nav-dot');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const navLogo = document.querySelector('.nav-logo');
    
    // showPage 함수 정의
    function showPage(index) {
        if (pages[index]) {
            pages[index].scrollIntoView({ behavior: 'smooth' });
            
            // 페이지 이동 시 메뉴 닫기
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
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
        const scrollY = window.scrollY;
        let current = 0;
        
        // 각 페이지의 위치를 확인하여 현재 보이는 섹션 찾기
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (page && scrollY >= page.offsetTop - 200) {
                current = i;
                break;
            }
        }
        
        // 도트 업데이트
        navDots.forEach((dot, index) => {
            if (index === current) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 상단 메뉴 업데이트 (있는 경우에만)
        if (navItems.length > 0) {
            navItems.forEach((item, index) => {
                if (index === current) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }
    
    // 스크롤 이벤트를 throttle하여 성능 개선
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', onScroll);
    
    // 페이지 로드 시 초기 실행
    document.addEventListener('DOMContentLoaded', updateActiveNav);
    setTimeout(updateActiveNav, 500); // 확실히 로드된 후 실행
});
