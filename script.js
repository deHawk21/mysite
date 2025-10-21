// Smooth scroll for navigation links
document.querySelectorAll('#bottom-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

/// Select all elements to animate
const elementsToAnimate = document.querySelectorAll('section, .step, .contact-info-card');

// Store timeouts for each element
const toggleTimeouts = new Map();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const target = entry.target;
    // Clear existing timeout
    if (toggleTimeouts.has(target)) {
      clearTimeout(toggleTimeouts.get(target));
    }

    if (entry.isIntersecting) {
      // Add after slight delay to prevent jitter
      const t = setTimeout(() => {
        target.classList.add('visible');
      }, 200); // delay in ms
      toggleTimeouts.set(target, t);
    } else {
      // Remove after delay
      const t = setTimeout(() => {
        target.classList.remove('visible');
      }, 200); // delay in ms
      toggleTimeouts.set(target, t);
    }
  });
});

// Observe all elements
elementsToAnimate.forEach(el => observer.observe(el));

// Also observe the logo
const logoWrapper = document.querySelector('#logo-wrapper');
if (logoWrapper) {
  observer.observe(logoWrapper);
}

// Background animation setup
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

// Generate points for the moving background
var pointCount = 0;
 var isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Use the variable as needed
  if (isMobile) {
    pointCount = 20;
  } else {
    pointCount = 80;
  }
const points = [];
//const pointCount = 80;
for (let i = 0; i < pointCount; i++) {
  points.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
  });
}

// Persistent list of lines for the background
const lines = [];
const threshold = 250;

// Helper function to find a line between points by indices
function getLine(i, j) {
  return lines.find(l => (l.i === i && l.j === j) || (l.i === j && l.j === i));
}

// Function to update the lines connecting nearby points
function updateLines() {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i], p2 = points[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist > threshold) {
        const index = lines.findIndex(l => (l.i === i && l.j === j) || (l.i === j && l.j === i));
        if (index !== -1) lines.splice(index, 1);
      } else {
        if (!getLine(i, j)) {
          lines.push({ i, j, progress: 0 });
        }
      }
    }
  }
}

// Initialize lines based on initial points positioning
updateLines();

const lineSpeed = 0.2;

// Animation loop for the moving background
function animate() {
  // Move points
  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }

  // Update lines based on current point positions
  updateLines();

  // Clear canvas for redrawing
  ctx.clearRect(0, 0, width, height);

  // Draw and animate lines
  for (const l of lines) {
    if (l.progress < 1) {
      l.progress += lineSpeed;
      if (l.progress > 1) l.progress = 1;
    }
    const p1 = points[l.i], p2 = points[l.j];
    ctx.strokeStyle = `rgba(0, 0, 0, ${l.progress * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

// Start animation
animate();

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    document.getElementById('bottom-nav').style.opacity = '1';
    document.getElementById('bottom-nav').style.visibility = 'visible';
  } else {
    document.getElementById('bottom-nav').style.opacity = '0';
    document.getElementById('bottom-nav').style.visibility = 'hidden';
  }
});

// Array of image URLs
const images = [
  'images/image1.jpeg', // Replace these with your image paths
  'images/image2.jpeg',
  'images/image3.jpeg',
  // Add more as needed
];

let currentIndex = 1;

// Set initial image
const currentImage = document.getElementById('current-image');
currentImage.src = images[currentIndex];
currentImage.classList.add('active');

function updateImage(index) {
  currentImage.classList.remove('active');
  
  setTimeout(() => {
    currentImage.classList.add('next');
    currentImage.src = images[index];
    
    setTimeout(() => {
      currentImage.classList.remove('next');
      currentImage.classList.add('active');
    }, 100); // Start as next before becoming active
  }, 500); // Time should align with CSS transition to remove "active"
}

// Button click handlers
document.getElementById('prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
  updateImage(currentIndex);
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
  updateImage(currentIndex);
});

