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

// Moving background
function draw() {
  ctx.clearRect(0, 0, width, height);

  // Move points
  for (let p of points) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }

  // Draw lines and triangles
  for (let i = 0; i < pointCount; i++) {
    const p1 = points[i];

    for (let j = i + 1; j < pointCount; j++) {
      const p2 = points[j];

      // Connect points within threshold
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 150) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  // Draw triangles connecting three points close together
  for (let i = 0; i < pointCount; i++) {
    const p1 = points[i];
    for (let j = i + 1; j < pointCount; j++) {
      const p2 = points[j];
      for (let k = j + 1; k < pointCount; k++) {
        const p3 = points[k];

        const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
        const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);

        if (d1 < 150 && d2 < 150 && d3 < 150) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }

  requestAnimationFrame(draw);
}
