// Smooth scroll to sections when navigation links are clicked
document.querySelectorAll('#bottom-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animate sections: fade in when entering view, fade out when leaving view
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Fade in section
      entry.target.classList.add('visible');
    } else {
      // Fade out section
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

// Observe each section
sections.forEach(section => {
  section.classList.add('fade-in'); // ensure initial fade-in style
  sectionObserver.observe(section);
});

// Animate the journey container and steps when they come into view
const journey = document.getElementById('journey');
const steps = document.querySelectorAll('.step');

const journeyObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Fade in journey container
      journey.classList.add('visible');
      // Fade in each step with stagger
      steps.forEach((step, index) => {
        setTimeout(() => {
          step.classList.add('visible');
        }, index * 300);
      });
    } else {
      // Optionally, remove classes for fade out effect
      journey.classList.remove('visible');
      steps.forEach(step => step.classList.remove('visible'));
    }
  });
}, { threshold: 0.2 });

// Observe journey container
journeyObserver.observe(journey);
