/**
 * ملف main.js - EduTechPro
 * يحتوي على جميع الوظائف التفاعلية للموقع
 * تم التعديل ليكون خاليًا من الأخطاء ومحسنًا للأداء
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============= متغيرات عامة =============
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const statsSection = document.querySelector('.stats');
    const statItems = document.querySelectorAll('.stat-item h3');
    let statsAnimated = false;

    // ============= وظائف مساعدة =============
    const isElementInViewport = (element, offset = 1.2) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) / offset
        );
    };

    const setupScrollAnimation = (selector, offset = 1.2) => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const animateElements = () => {
            elements.forEach(element => {
                if (isElementInViewport(element, offset)) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        window.addEventListener('scroll', animateElements);
        animateElements(); // تشغيل مرة أولية
    };

    // ============= شريط التنقل =============
    if (header && menuToggle && navbar) {
        // تأثير التمرير
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });

        // تبديل القائمة في الأجهزة الصغيرة
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuToggle.innerHTML = navbar.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // ============= تأثير العدادات =============
    if (statsSection && statItems.length > 0) {
        const animateStats = () => {
            if (statsAnimated || !isElementInViewport(statsSection)) return;

            statItems.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count')) || 0;
                const count = parseInt(stat.textContent) || 0;
                const increment = Math.max(1, Math.floor(target / 100));

                if (count < target) {
                    stat.textContent = Math.min(count + increment, target);
                    requestAnimationFrame(animateStats);
                } else {
                    stat.textContent = target;
                }
            });

            statsAnimated = true;
        };

        window.addEventListener('scroll', animateStats);
        animateStats(); // تشغيل مرة أولية
    }

    // ============= التمرير السلس =============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#' && targetId !== '') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============= تأثيرات التمرير =============
    // تأثيرات الصفحة الرئيسية
    if (document.querySelector('.feature-card, .service-card, .testimonial-card')) {
        setupScrollAnimation('.feature-card, .service-card, .testimonial-card');
    }

    // تأثيرات صفحات الخدمات والمشاريع
    if (document.querySelector('.category-card, .project-card, .value-card, .team-member, .faq-item')) {
        setupScrollAnimation('.category-card, .project-card, .value-card, .team-member, .faq-item');
    }

    // ============= الأسئلة الشائعة (FAQ) =============
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.maxHeight;

            // إغلاق جميع الإجابات أولاً
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer) {
                    item.style.maxHeight = null;
                    item.previousElementSibling.classList.remove('active');
                }
            });

            // فتح/إغلاق الإجابة الحالية
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.classList.add('active');
            } else {
                answer.style.maxHeight = null;
                this.classList.remove('active');
            }
        });
    });

    // ============= تصفية المشاريع =============
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // تحديث حالة الأزرار
            document.querySelectorAll('.filter-btn').forEach(b => 
                b.classList.toggle('active', b === this)
            );

            // تصفية المشاريع
            document.querySelectorAll('.project-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 
                    'block' : 'none';
            });
        });
    });


});

// ============= تحسينات الأداء =============
// استخدم requestAnimationFrame للحركات والتحسينات
let lastScrollPosition = 0;
const scrollHandlers = [];

function onScroll(callback) {
    scrollHandlers.push(callback);
}

window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;
    if (Math.abs(currentScrollPosition - lastScrollPosition) > 50) {
        lastScrollPosition = currentScrollPosition;
        scrollHandlers.forEach(handler => {
            requestAnimationFrame(handler);
        });
    }
});


document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // عرض حالة التحميل
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
  
  // إرسال البريد باستخدام EmailJS
  emailjs.sendForm('service_vwiosod', 'template_ihyxvx4', form)
    .then(function() {
      // نجاح الإرسال
      showSuccessMessage();
      form.reset();
    }, function(error) {
      // فشل الإرسال
      alert('حدث خطأ أثناء الإرسال: ' + JSON.stringify(error));
    })
    .finally(function() {
      // إعادة تعيين حالة الزر
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
});

function showSuccessMessage() {
  const form = document.getElementById('contactForm');
  const successHTML = `
    <div class="success-message">
      <i class="fas fa-check-circle"></i>
      <h3>تم الإرسال بنجاح!</h3>
      <p>سنقوم بالرد على رسالتك في أقرب وقت ممكن</p>
    </div>
  `;
  
  form.style.display = 'none';
  form.insertAdjacentHTML('afterend', successHTML);
}