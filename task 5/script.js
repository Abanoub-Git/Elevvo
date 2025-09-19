        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.querySelector('.theme-toggle');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                themeToggle.innerHTML = '🌙 Dark';
                localStorage.removeItem('theme');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '☀️ Light';
                localStorage.setItem('theme', 'dark');
            }
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            const themeToggle = document.querySelector('.theme-toggle');
            
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '☀️ Light';
            }
        }

        function initSmoothScrolling() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

        function initHeaderScroll() {
            const header = document.querySelector('.header');
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.style.background = document.body.getAttribute('data-theme') === 'dark' 
                        ? 'rgba(26, 32, 44, 0.98)' 
                        : 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.background = document.body.getAttribute('data-theme') === 'dark' 
                        ? 'rgba(26, 32, 44, 0.95)' 
                        : 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
                
                lastScrollY = currentScrollY;
            });
        }

        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenu = document.querySelector('.mobile-menu');
            
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        }

        function initAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
            animatedElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(el);
            });
        }

        function initTypingEffect() {
            const heroTitle = document.querySelector('.hero-content h1');
            const originalText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 500);
        }

        function createParticleEffect() {
            const hero = document.querySelector('.hero');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                hero.appendChild(particle);
            }
        }

        function animateCounters() {
            const counters = document.querySelectorAll('[data-count]');
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                const increment = target / 100;
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(count).toLocaleString();
                    }
                }, 20);
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            loadTheme();
            initSmoothScrolling();
            initHeaderScroll();
            initAnimations();
            createParticleEffect();
            
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .nav-links.active {
                        display: flex;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--bg-card);
                        flex-direction: column;
                        padding: 2rem;
                        box-shadow: var(--shadow);
                        border-top: 1px solid var(--border-color);
                    }
                    
                    .mobile-menu.active span:nth-child(1) {
                        transform: rotate(-45deg) translate(-5px, 6px);
                    }
                    
                    .mobile-menu.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .mobile-menu.active span:nth-child(3) {
                        transform: rotate(45deg) translate(-5px, -6px);
                    }
                }
            `;
            document.head.appendChild(style);
        });

        
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = this.classList.contains('popular') ? 
                    'translateY(-10px) scale(1.05)' : 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = this.classList.contains('popular') ? 
                    'scale(1.05)' : 'none';
            });
        });

        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });