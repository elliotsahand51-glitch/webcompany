/**
 * DANIEL - Digital Solutions Brand Hero
 * Interactions, Smooth 3D Parallax, Audio Visualizer, and Node Mesh Network
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DParallax();
  initAudioVisualizer();
  initNodeNetwork();
  initModalInteractions();
  initPanelMicroInteractions();
  initLiveTelemetrySimulator();
  initHeaderAndScrollSpy();
  initTestimonials();
  initWorkCarousel();
  initMobileNav();
});

/* ==========================================================================
   1. SMOOTH 3D PARALLAX EFFECT
   ========================================================================== */
function init3DParallax() {
  const stage = document.getElementById('showroomStage');
  const heroMaster = document.querySelector('.hero-master');
  const panels = document.querySelectorAll('.glass-panel');

  if (!stage || !heroMaster) return;

  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // Track mouse coordinates across hero section
  heroMaster.addEventListener('mousemove', (e) => {
    const rect = heroMaster.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subdued, luxury-grade subtle rotation range (-4 to +4 deg)
    targetRotateX = ((y - centerY) / centerY) * -4.5;
    targetRotateY = ((x - centerX) / centerX) * 5.5;
  });

  // Smooth reset on mouse leave
  heroMaster.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
  });

  // Animation render loop with smooth linear interpolation (damping)
  function renderParallax() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    stage.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    // Additional subtle translation depth on individual panels
    panels.forEach((panel, index) => {
      const depthMultiplier = 1 + (index % 3) * 0.4;
      const transX = currentRotateY * depthMultiplier * 1.5;
      const transY = -currentRotateX * depthMultiplier * 1.5;
      panel.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, ${index * 8}px)`;
    });

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/* ==========================================================================
   2. DYNAMIC AUDIO WAVEFORM VISUALIZER
   ========================================================================== */
function initAudioVisualizer() {
  const canvas = document.getElementById('audioWaveCanvas');
  const toggleBtn = document.getElementById('toggleAudioWaveBtn');
  const playIcon = document.getElementById('audioPlayIcon');
  const statusText = document.getElementById('audioStatusText');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isPlaying = true;
  let animationFrameId;
  let step = 0;

  function drawWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (isPlaying) {
      step += 0.06;
    }

    const barCount = 38;
    const barWidth = (width / barCount) - 2;
    const centerY = height / 2;

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + 2) + 1;
      
      // Calculate realistic audio harmonics
      const distanceToCenter = 1 - Math.abs((i - barCount / 2) / (barCount / 2));
      const envelope = Math.pow(distanceToCenter, 0.85);

      const wave1 = Math.sin(step + i * 0.28);
      const wave2 = Math.cos(step * 1.4 + i * 0.18);
      const wave3 = Math.sin(step * 0.8 - i * 0.4);

      let amplitude = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2) * envelope;
      amplitude = Math.max(0.1, Math.abs(amplitude));

      const barHeight = Math.max(4, amplitude * (height * 0.88));
      const y = centerY - barHeight / 2;

      // Premium Daniel Blue to Periwinkle Gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
      grad.addColorStop(0, '#A8B8F8');
      grad.addColorStop(0.4, '#5688E8');
      grad.addColorStop(1, '#2848A8');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();

      // Subtle glow on top peaks
      if (barHeight > height * 0.5) {
        ctx.shadowColor = 'rgba(152, 152, 232, 0.8)';
        ctx.shadowBlur = 6;
      } else {
        ctx.shadowBlur = 0;
      }
    }

    animationFrameId = requestAnimationFrame(drawWaveform);
  }

  drawWaveform();

  // Audio Play/Pause toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlaying = !isPlaying;
      if (isPlaying) {
        playIcon.textContent = '❚❚';
        statusText.textContent = 'Live Feed';
        toggleBtn.style.background = 'rgba(86, 136, 232, 0.12)';
      } else {
        playIcon.textContent = '▶';
        statusText.textContent = 'Paused';
        toggleBtn.style.background = 'rgba(152, 152, 232, 0.25)';
      }
    });
  }
}

/* ==========================================================================
   3. SYSTEM INTEGRATIONS INTERCONNECTED NODE MESH
   ========================================================================== */
function initNodeNetwork() {
  const canvas = document.getElementById('nodeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  // Define structured node positions with hexagonal symmetry
  const nodes = [
    { x: width * 0.2, y: height * 0.3, vx: 0.15, vy: 0.12, r: 4.5, label: 'API' },
    { x: width * 0.5, y: height * 0.25, vx: -0.12, vy: 0.1, r: 6, label: 'HUB' },
    { x: width * 0.8, y: height * 0.35, vx: -0.1, vy: -0.15, r: 4.5, label: 'DB' },
    { x: width * 0.3, y: height * 0.72, vx: 0.12, vy: -0.1, r: 5, label: 'ERP' },
    { x: width * 0.7, y: height * 0.7, vx: -0.14, vy: -0.12, r: 5.5, label: 'POS' },
    { x: width * 0.5, y: height * 0.55, vx: 0.08, vy: -0.08, r: 7, isCore: true, label: 'CORE' }
  ];

  // Moving data packets along connections
  const packets = [
    { from: 0, to: 5, progress: 0.1, speed: 0.008 },
    { from: 5, to: 1, progress: 0.5, speed: 0.01 },
    { from: 2, to: 5, progress: 0.8, speed: 0.007 },
    { from: 3, to: 5, progress: 0.3, speed: 0.009 },
    { from: 5, to: 4, progress: 0.6, speed: 0.011 }
  ];

  function renderNodes() {
    ctx.clearRect(0, 0, width, height);

    // Update node minor floating drift
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 15 || n.x > width - 15) n.vx *= -1;
      if (n.y < 15 || n.y > height - 15) n.vy *= -1;
    });

    // Draw connection lines
    ctx.lineWidth = 1.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          const alpha = 1 - dist / 90;
          ctx.strokeStyle = `rgba(86, 136, 232, ${alpha * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw moving data packets
    packets.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const n1 = nodes[p.from];
      const n2 = nodes[p.to];
      const px = n1.x + (n2.x - n1.x) * p.progress;
      const py = n1.y + (n2.y - n1.y) * p.progress;

      ctx.fillStyle = '#A8B8F8';
      ctx.shadowColor = '#5688E8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    nodes.forEach(n => {
      // Outer ring
      ctx.strokeStyle = n.isCore ? '#5688E8' : 'rgba(152, 152, 232, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.stroke();

      // Inner fill
      ctx.fillStyle = n.isCore ? '#3B73E0' : '#ffffff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Center core pulse
      if (n.isCore) {
        ctx.shadowColor = 'rgba(86, 136, 232, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#D8E8F8';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    requestAnimationFrame(renderNodes);
  }

  renderNodes();
}

/* ==========================================================================
   4. MODAL AND DRAWER INTERACTIONS
   ========================================================================== */
function initModalInteractions() {
  const projectModal = document.getElementById('projectModal');
  const workDrawer = document.getElementById('workDrawerOverlay');

  const openContactBtn = document.getElementById('openContactBtn');
  const heroStartBtn = document.getElementById('heroStartProjectBtn');
  const heroWorkBtn = document.getElementById('heroViewWorkBtn');
  const navWorkBtn = document.getElementById('navWorkBtn');

  const closeProjectBtn = document.getElementById('closeProjectModalBtn');
  const closeWorkDrawerBtn = document.getElementById('closeWorkDrawerBtn');

  // Open Project Modal
  function openProjectModal() {
    if (projectModal) {
      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Project Modal
  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Open Work Drawer
  function openWorkDrawer(e) {
    if (e) e.preventDefault();
    if (workDrawer) {
      workDrawer.classList.add('active');
      workDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Work Drawer
  function closeWorkDrawer() {
    if (workDrawer) {
      workDrawer.classList.remove('active');
      workDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openContactBtn) openContactBtn.addEventListener('click', openProjectModal);
  if (heroStartBtn) heroStartBtn.addEventListener('click', openProjectModal);
  if (heroWorkBtn) {
    heroWorkBtn.addEventListener('click', () => {
      const workSec = document.getElementById('work');
      if (workSec) {
        workSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        openWorkDrawer();
      }
    });
  }

  if (closeProjectBtn) closeProjectBtn.addEventListener('click', closeProjectModal);
  if (closeWorkDrawerBtn) closeWorkDrawerBtn.addEventListener('click', closeWorkDrawer);

  // Footer contact modal triggers
  document.querySelectorAll('.footer-open-contact').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal();
    });
  });

  // Close on overlay backdrop click
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  if (workDrawer) {
    workDrawer.addEventListener('click', (e) => {
      if (e.target === workDrawer) closeWorkDrawer();
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeWorkDrawer();
    }
  });

  // Project Form Submission simulation
  const projectForm = document.getElementById('projectInquiryForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitInquiryBtn');
      submitBtn.textContent = 'Preparing Proposal...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✓ Request Received! We’ll be in touch.';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
          closeProjectModal();
          projectForm.reset();
          submitBtn.textContent = 'Submit Project Request →';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2200);
      }, 900);
    });
  }
}

/* ==========================================================================
   5. PANEL MICRO-INTERACTIONS
   ========================================================================== */
function initPanelMicroInteractions() {
  const panels = document.querySelectorAll('.glass-panel');
  const sculpture = document.getElementById('sculptureHotspot');

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      panel.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      panel.style.transform = 'scale(1.05) translateY(-6px)';
      panel.style.borderColor = '#5688E8';

      setTimeout(() => {
        panel.style.transform = '';
        panel.style.borderColor = '';
      }, 400);
    });
  });

  if (sculpture) {
    sculpture.addEventListener('click', () => {
      const glowRing = sculpture.querySelector('.sculpture-glow-ring');
      if (glowRing) {
        glowRing.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        glowRing.style.transform = 'translateX(-50%) scale(1.35)';
        glowRing.style.filter = 'blur(18px)';

        setTimeout(() => {
          glowRing.style.transform = '';
          glowRing.style.filter = '';
        }, 600);
      }
    });
  }

  // Active state on nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. REALITY LIVE TELEMETRY SIMULATOR
   Dynamic real-time changing numbers in POS, Mobile, Systems, Web & Audio
   ========================================================================== */
function initLiveTelemetrySimulator() {
  // 1. POS Solutions Live Data Stream
  let grossVolume = 148290;
  let transactions = 3842;
  const grossVolEl = document.getElementById('posGrossVolume');
  const transEl = document.getElementById('posTransactions');
  const peakThroughputEl = document.getElementById('posPeakThroughput');
  const throughputBar = document.getElementById('posThroughputBar');
  const orderItemEl = document.getElementById('posOrderItem');
  const orderBadgeEl = document.getElementById('posOrderBadge');

  const orderLocations = ['POS-East', 'POS-Manhattan', 'POS-London', 'POS-Tokyo', 'POS-Zurich', 'POS-Singapore', 'POS-Paris'];
  let orderNumber = 8492;
  let locIndex = 0;

  setInterval(() => {
    // Increment gross volume with realistic transaction size ($45 - $290)
    const sale = Math.floor(Math.random() * 245) + 45;
    grossVolume += sale;
    transactions += 1;
    orderNumber += 1;
    locIndex = (locIndex + 1) % orderLocations.length;

    if (grossVolEl) {
      grossVolEl.textContent = `$${grossVolume.toLocaleString()}`;
      grossVolEl.style.transition = 'color 0.25s ease, transform 0.25s ease';
      grossVolEl.style.color = '#38d39f';
      grossVolEl.style.transform = 'scale(1.04)';
      setTimeout(() => { 
        grossVolEl.style.color = '#ffffff'; 
        grossVolEl.style.transform = 'scale(1)';
      }, 550);
    }

    if (transEl) {
      transEl.textContent = transactions.toLocaleString();
    }

    // Fluctuating throughput percentage (97.8% - 99.4%)
    const throughput = (97.8 + Math.random() * 1.6).toFixed(1);
    if (peakThroughputEl) {
      peakThroughputEl.textContent = `Peak ${throughput}%`;
    }
    if (throughputBar) {
      const barPercent = Math.min(94, Math.max(76, Math.floor(throughput * 0.85)));
      throughputBar.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      throughputBar.style.width = `${barPercent}%`;
    }

    // Live order cycling
    if (orderItemEl) {
      orderItemEl.textContent = `Order #${orderNumber} • ${orderLocations[locIndex]}`;
    }
    if (orderBadgeEl) {
      orderBadgeEl.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
      orderBadgeEl.style.transform = 'scale(1.15)';
      orderBadgeEl.style.backgroundColor = 'rgba(56, 211, 159, 0.4)';
      setTimeout(() => {
        orderBadgeEl.style.transform = 'scale(1)';
        orderBadgeEl.style.backgroundColor = 'rgba(56, 211, 159, 0.18)';
      }, 400);
    }
  }, 2600);

  // 2. Mobile Applications Live Portfolio & Chart Jitter
  const mobileValEl = document.getElementById('mobileAnalyticsVal');
  const chartBars = document.querySelectorAll('#phoneChartBars .phone-bar');
  let baseVal = 42.8;

  setInterval(() => {
    // Realistic financial fluctuation (+42.4% to +43.9%)
    const delta = (Math.random() * 0.6 - 0.25);
    baseVal = Math.max(41.5, Math.min(44.8, baseVal + delta));
    if (mobileValEl) {
      mobileValEl.textContent = `+${baseVal.toFixed(1)}%`;
      mobileValEl.style.transition = 'color 0.2s ease';
      mobileValEl.style.color = delta >= 0 ? '#38d39f' : '#9898E8';
      setTimeout(() => { mobileValEl.style.color = '#ffffff'; }, 500);
    }

    // Smoothly randomize bar chart heights
    chartBars.forEach((bar) => {
      const randomHeight = Math.floor(Math.random() * 55) + 32;
      bar.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      bar.style.height = `${randomHeight}%`;
    });
  }, 3000);

  // 3. System Integrations Real-time Latency Jitter
  const latencyEl = document.getElementById('nodeTelemetryMetric');
  const latencies = ['10ms • 99.99%', '12ms • 99.99%', '11ms • 99.99%', '9ms • 99.99%', '13ms • 99.99%', '8ms • 99.99%'];
  let latIdx = 0;
  setInterval(() => {
    latIdx = (latIdx + 1) % latencies.length;
    if (latencyEl) {
      latencyEl.textContent = latencies[latIdx];
    }
  }, 2000);

  // 4. Audio Solutions Live Decibel Meter
  const dbEl = document.getElementById('audioDbLevel');
  setInterval(() => {
    if (dbEl) {
      const db = (-16 + Math.random() * 7.5).toFixed(1);
      dbEl.textContent = `${db} dB`;
    }
  }, 450);

  // 5. Web Development Response Time
  const webSpeedEl = document.getElementById('webDevSpeedMetric');
  const speeds = ['⚡ 14ms', '⚡ 11ms', '⚡ 13ms', '⚡ 9ms', '⚡ 12ms'];
  let speedIdx = 0;
  setInterval(() => {
    speedIdx = (speedIdx + 1) % speeds.length;
    if (webSpeedEl) {
      webSpeedEl.textContent = speeds[speedIdx];
    }
  }, 3400);
}

/* ==========================================================================
   7. STICKY HEADER & SCROLL SPY
   Adapts navigation between daylight hero & midnight about section
   ========================================================================== */
function initHeaderAndScrollSpy() {
  const header = document.querySelector('.site-header');
  const aboutSection = document.getElementById('about');
  const processSection = document.getElementById('process');
  const servicesSection = document.getElementById('services');
  const workSection = document.getElementById('work');
  const productsSection = document.getElementById('products');
  const testimonialsSection = document.getElementById('testimonials');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollY = window.scrollY;

    // Header glass transition
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Dynamic scroll spy highlighting
    let currentId = '#home';
    if (testimonialsSection && scrollY >= testimonialsSection.offsetTop - 250) {
      currentId = '#testimonials';
    } else if (productsSection && scrollY >= productsSection.offsetTop - 250) {
      currentId = '#products';
    } else if (workSection && scrollY >= workSection.offsetTop - 250) {
      currentId = '#work';
    } else if (servicesSection && scrollY >= servicesSection.offsetTop - 250) {
      currentId = '#services';
    } else if (processSection && scrollY >= processSection.offsetTop - 250) {
      currentId = '#process';
    } else if (aboutSection && scrollY >= aboutSection.offsetTop - 250) {
      currentId = '#about';
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentId);
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Products & Services Section Interactions
  const viewAllBtn = document.getElementById('viewAllProductsBtn');
  const exploreServicesBtn = document.getElementById('exploreAllServicesBtn');
  const workDrawer = document.getElementById('workDrawerOverlay');
  const projectModal = document.getElementById('projectModal');
  const serviceCards = document.querySelectorAll('.service-card');

  if (viewAllBtn && workDrawer) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      workDrawer.classList.add('active');
      workDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (exploreServicesBtn && workDrawer) {
    exploreServicesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      workDrawer.classList.add('active');
      workDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  // Service cards open Project Modal with that specific service pre-selected
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = card.getAttribute('data-service');
      if (projectModal) {
        const checkboxes = projectModal.querySelectorAll('input[name="services"]');
        checkboxes.forEach(cb => {
          if (cb.value === serviceName) cb.checked = true;
        });
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Product "Learn More" links open Project Modal with pre-selected service
  const productLinks = document.querySelectorAll('.product-link');
  productLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = link.getAttribute('data-product');
      if (projectModal) {
        // Pre-select checkbox if matching
        const checkboxes = projectModal.querySelectorAll('input[name="services"]');
        checkboxes.forEach(cb => {
          if (cb.value === serviceName) cb.checked = true;
        });

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // About & Final CTA Banner Interactions
  const meetTeamBtn = document.getElementById('aboutMeetTeamBtn');
  const ctaGetInTouchBtn = document.getElementById('ctaGetInTouchBtn');

  if (meetTeamBtn && workDrawer) {
    meetTeamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      workDrawer.classList.add('active');
      workDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (ctaGetInTouchBtn && projectModal) {
    ctaGetInTouchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }
}

/* ==========================================================================
   8. TESTIMONIALS SECTION INTERACTIONS & CONTROLS
   Minimal carousel controls, smooth card focus, and responsive scrolling
   ========================================================================== */
function initTestimonials() {
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');
  const track = document.getElementById('testimonialsTrack');
  const cards = document.querySelectorAll('.testimonial-card');

  if (!track || !cards.length) return;

  let activeIndex = -1;

  function highlightCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.style.borderColor = 'rgba(86, 136, 232, 0.45)';
        card.style.transform = 'translateY(-7px)';
        card.style.boxShadow = '0 18px 45px -6px rgba(24, 36, 58, 0.08), 0 32px 65px -12px rgba(86, 136, 232, 0.16)';
      } else {
        card.style.borderColor = '';
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex <= 0) {
        activeIndex = cards.length - 1;
      } else {
        activeIndex--;
      }
      highlightCard(activeIndex);
      const scrollStep = (cards[0].offsetWidth || 340) + 24;
      track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex >= cards.length - 1) {
        activeIndex = 0;
      } else {
        activeIndex++;
      }
      highlightCard(activeIndex);
      const scrollStep = (cards[0].offsetWidth || 340) + 24;
      track.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   9. OUR WORK / PROJECTS PORTFOLIO CAROUSEL
   Synchronizes indicator dots, card clicking, and drawer integration
   ========================================================================== */
function initWorkCarousel() {
  const track = document.getElementById('workTrack');
  const dots = document.querySelectorAll('.work-dot');
  const cards = document.querySelectorAll('.work-card');
  const viewAllBtn = document.getElementById('workViewAllBtn');
  const workDrawer = document.getElementById('workDrawerOverlay');

  if (!track || dots.length === 0) return;

  // Dot click navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (cards[idx]) {
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    });
  });

  // Track scroll synchronization with dots
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = track.scrollLeft;
      let closestIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const distance = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      dots.forEach((d, i) => {
        const isActive = i === closestIdx;
        d.classList.toggle('active', isActive);
        d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }, 50);
  }, { passive: true });

  // Card click opens project drawer with details
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (workDrawer) {
        workDrawer.classList.add('active');
        workDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Top-right CTA button: "View All Projects →"
  if (viewAllBtn && workDrawer) {
    viewAllBtn.addEventListener('click', () => {
      workDrawer.classList.add('active');
      workDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }
}

/* ==========================================================================
   10. ADAPTIVE MOBILE NAVIGATION
   Controls drawer, hamburger animation, backdrop, and keyboard/touch events
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('closeMobileNavBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileCtaBtn = document.getElementById('mobileCtaStartBtn');
  const projectModal = document.getElementById('projectModal');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-active');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-active');
    backdrop.setAttribute('aria-hidden', 'true');
    if (!projectModal || !projectModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.contains('is-active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  backdrop.addEventListener('click', closeMenu);

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
      closeMenu();
    }
  });

  // Close when tapping a mobile navigation link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Mobile CTA button in drawer triggers project modal
  if (mobileCtaBtn && projectModal) {
    mobileCtaBtn.addEventListener('click', () => {
      closeMenu();
      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  // Automatically close mobile menu if viewport resized to desktop (>= 1024px)
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  function handleBreakpoint(e) {
    if (e.matches && drawer.classList.contains('is-active')) {
      closeMenu();
    }
  }
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleBreakpoint);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleBreakpoint);
  }
}




