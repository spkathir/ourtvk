// Thiruvarangulam Village Web Application JavaScript

class VillageApp {
    constructor() {
        this.currentPage = 'home';
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeCounters();
                this.initializeGallery();
                this.initializeModal();
                this.showPage('home');
            });
        } else {
            this.setupEventListeners();
            this.initializeCounters();
            this.initializeGallery();
            this.initializeModal();
            this.showPage('home');
        }
    }

    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.setActiveNavLink(link);
                    this.closeMobileMenu();
                    this.updateURL(page);
                }
            });
        });

        // Quick link cards
        const quickLinkCards = document.querySelectorAll('.quick-link-card');
        quickLinkCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const page = card.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.setActiveNavLinkByPage(page);
                    this.updateURL(page);
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Gallery filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                this.filterGallery(filter);
                this.setActiveFilter(btn);
            });
        });

        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openImageModal(item);
            });
        });

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        const modal = document.querySelector('#imageModal');
        
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        console.log('Event listeners setup completed');
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        // Hide all pages
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            // Force reflow
            targetPage.offsetHeight;
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Animate page content
            setTimeout(() => {
                this.animatePageContent(targetPage);
            }, 100);

            // Initialize page-specific features
            setTimeout(() => {
                this.initPageSpecificFeatures(pageId);
            }, 200);

            console.log('Page shown successfully:', pageId);
        } else {
            console.error('Page not found:', pageId);
        }
    }

    setActiveNavLink(activeLink) {
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setActiveNavLinkByPage(pageId) {
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }

    updateURL(pageId) {
        const newURL = `${window.location.pathname}#${pageId}`;
        history.pushState({ page: pageId }, '', newURL);
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const btn = document.querySelector('.mobile-menu-btn');
        
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (nav) {
            if (this.mobileMenuOpen) {
                nav.classList.add('active');
                nav.style.display = 'block';
            } else {
                nav.classList.remove('active');
                setTimeout(() => {
                    nav.style.display = '';
                }, 300);
            }
        }
        
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = this.mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        }

        console.log('Mobile menu toggled:', this.mobileMenuOpen);
    }

    closeMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const btn = document.querySelector('.mobile-menu-btn');
        
        this.mobileMenuOpen = false;
        
        if (nav) {
            nav.classList.remove('active');
            setTimeout(() => {
                nav.style.display = '';
            }, 300);
        }
        
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    }

    initializeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number based on type
                if (target > 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else if (target < 100 && target % 1 !== 0) {
                    counter.textContent = current.toFixed(2);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 30);
        };

        // Intersection Observer for counters
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
        console.log('Counters initialized:', counters.length);
    }

    initializeGallery() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterGallery('all');
        console.log('Gallery initialized with items:', this.galleryItems.length);
    }

    filterGallery(category) {
        if (!this.galleryItems) return;
        
        this.galleryItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                // Animate in with stagger
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    setActiveFilter(activeBtn) {
        const allFilterBtns = document.querySelectorAll('.filter-btn');
        allFilterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    initializeModal() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        console.log('Modal initialized');
    }

    openImageModal(galleryItem) {
        const img = galleryItem.querySelector('img');
        const overlay = galleryItem.querySelector('.gallery-overlay');
        
        if (img && overlay && this.modal) {
            const title = overlay.querySelector('h4')?.textContent || 'Image';
            const description = overlay.querySelector('p')?.textContent || '';
            
            this.modalImage.src = img.src;
            this.modalImage.alt = img.alt;
            this.modalTitle.textContent = title;
            this.modalDescription.textContent = description;
            
            this.modal.classList.remove('hidden');
            setTimeout(() => {
                this.modal.classList.add('active');
            }, 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            console.log('Modal opened for:', title);
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            setTimeout(() => {
                this.modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
            console.log('Modal closed');
        }
    }

    animatePageContent(page) {
        const elements = page.querySelectorAll('.card, .stat-card, .demo-card, .crop-card, .practice-card, .facility-card, .transport-card, .culture-card, .festival-card, .gallery-item, .achievement-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initPageSpecificFeatures(pageId) {
        switch (pageId) {
            case 'home':
                this.initHomePageFeatures();
                break;
            case 'demographics':
                this.initDemographicsFeatures();
                break;
            case 'education':
                this.initEducationFeatures();
                break;
            case 'gallery':
                this.initGalleryFeatures();
                break;
        }
        console.log('Page-specific features initialized for:', pageId);
    }

    initHomePageFeatures() {
        // Reset and restart counter animations
        const counters = document.querySelectorAll('#home [data-count]');
        counters.forEach(counter => {
            counter.classList.remove('counted');
            counter.textContent = '0';
        });
        
        // Re-initialize counters with delay
        setTimeout(() => {
            this.initializeCounters();
        }, 500);
    }

    initDemographicsFeatures() {
        // Animate progress bars
        const progressBars = document.querySelectorAll('.bar-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    initEducationFeatures() {
        // Animate comparison bars
        setTimeout(() => {
            this.initDemographicsFeatures();
        }, 300);
    }

    initGalleryFeatures() {
        // Reset gallery items animation
        if (this.galleryItems) {
            this.galleryItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease-out';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Custom animations for scroll effects
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Mobile menu animation improvements */
    @media (max-width: 768px) {
        .main-nav {
            transition: all 0.3s ease-out;
            transform: translateY(-10px);
            opacity: 0;
            display: none !important;
        }
        
        .main-nav.active {
            transform: translateY(0);
            opacity: 1;
            display: block !important;
        }
    }
    
    /* Loading animation */
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize the application
let appInitialized = false;

const initApp = () => {
    if (appInitialized) return;
    appInitialized = true;
    
    window.villageApp = new VillageApp();
    
    // Add some helpful console messages
    console.log('🏘️ Thiruvarangulam Village Application Loaded');
    console.log('📱 Responsive design active');
    console.log('🎨 Interactive features enabled');
    
    // Handle URL hash on load
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'demographics', 'agriculture', 'education', 'transport', 'tourism', 'gallery'].includes(hash)) {
        setTimeout(() => {
            window.villageApp.showPage(hash);
            window.villageApp.setActiveNavLinkByPage(hash);
        }, 100);
    }
};

// Multiple initialization attempts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Fallback initialization
setTimeout(initApp, 100);

// Handle back button navigation
window.addEventListener('popstate', (e) => {
    const hash = window.location.hash.substring(1);
    if (hash && window.villageApp) {
        window.villageApp.showPage(hash);
        window.villageApp.setActiveNavLinkByPage(hash);
    }
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VillageApp;
}