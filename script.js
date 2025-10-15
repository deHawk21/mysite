// Smooth scroll for nav links
document.querySelectorAll('#bottom-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// Intersection observers for section fade-in
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });
sections.forEach(section => {
  section.classList.add('fade-in');
  sectionObserver.observe(section);
});

// Animate journey container and steps
const journey = document.getElementById('journey');
const steps = document.querySelectorAll('.step');

if (journey) {
  const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        journey.classList.add('visible');
        steps.forEach((step, index) => {
          setTimeout(() => { step.classList.add('visible'); }, index * 300);
        });
      } else {
        journey.classList.remove('visible');
        steps.forEach(step => step.classList.remove('visible'));
      }
    });
  }, { threshold: 0.2 });
  journeyObserver.observe(journey);
}

// *** Background animation setup ***
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});
canvas.width = width;
canvas.height = height;

// Generate points
const points = [];
const pointCount = 80;
for (let i=0; i<pointCount; i++) {
  points.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
  });
}

// Persistent list of lines
const lines = [];
const threshold = 250;

// Helper to find a line between points (by indices)
function getLine(i,j) {
  return lines.find(l => (l.i===i && l.j===j) || (l.i===j && l.j===i));
}

// Generate initial lines based on current points
function updateLines() {
  for (let i=0; i<points.length; i++) {
    for (let j=i+1; j<points.length; j++) {
      const p1=points[i], p2=points[j];
      const dist=Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist > threshold) {
        const index = lines.findIndex(l => (l.i===i && l.j===j)||(l.i===j && l.j===i));
        if (index !== -1) lines.splice(index,1);
      } else {
        if (!getLine(i,j)){
          lines.push({ i, j, progress:0 });
        }
      }
    }
  }
}

// Call to initialize lines at start
updateLines();

const lineSpeed=0.2;

function animate() {
  // Move points
  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }

  // Recompute lines based on current position
  updateLines();

  // Clear the entire canvas
  ctx.clearRect(0, 0, width, height);

  // Draw lines with animated opacity
  for (const l of lines) {
    // Sharpen the animation: increase progress
    if (l.progress < 1) {
      l.progress += lineSpeed;
      if (l.progress > 1) l.progress = 1;
    }

    const p1 = points[l.i];
    const p2 = points[l.j];

    ctx.strokeStyle = `rgba(0, 0, 0, ${l.progress * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}
// Continue animation
animate();

// Select all steps inside #journey
const journeySteps = document.querySelectorAll('#journey .step');

const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const step = entry.target;
      const index = Array.from(journeySteps).indexOf(step);
      // Delay animation based on index for sequential effect
      setTimeout(() => {
        step.classList.add('visible');
      }, index * 300); // 300ms delay per step
      observer.unobserve(step); // optional, or keep unobserved
    }
  });
}, observerOptions);

// Observe each step
journeySteps.forEach(step => {
  observer.observe(step);
});

