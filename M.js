 // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.getElementById('mobile-menu').classList.remove('open');
                }
            });
        });

        // Mobile menu toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');

        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        // Scroll to top button functionality
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show button after scrolling down 300px
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Basic form submission (client-side only for demonstration)
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission

            // In a real application, you would send this data to a backend server
            // using fetch() or XMLHttpRequest.
            console.log('Form submitted!');
            console.log('Name:', this.name.value);
            console.log('Email:', this.email.value);
            console.log('Message:', this.message.value);

            // Display a simple alert to the user
            alert('Thank you for your message! I will get back to you soon.');

            // Clear the form
            this.reset();
        });