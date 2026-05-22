    import { inject } from "@vercel/analytics";

    inject();

    const pageScroll = document.getElementById("page-scroll");
    const pageScrollbar = document.getElementById("page-scrollbar");
    const pageScrollbarThumb = document.getElementById("page-scrollbar-thumb");
    let scrollbarFadeTimeout = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.18
    });

    document.querySelectorAll(".reveal:not(.visible)").forEach((element) => {
      observer.observe(element);
    });

    const syncCustomScrollbar = () => {
      if (!pageScroll || !pageScrollbar || !pageScrollbarThumb) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = pageScroll;
      const trackHeight = pageScrollbar.clientHeight;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);

      if (scrollHeight <= clientHeight + 4) {
        pageScrollbar.classList.add("is-hidden");
        return;
      }

      pageScrollbar.classList.remove("is-hidden");

      const thumbHeight = Math.max(72, (clientHeight / scrollHeight) * trackHeight);
      const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
      const thumbTop = (scrollTop / maxScroll) * maxThumbTop;

      pageScrollbarThumb.style.height = `${thumbHeight}px`;
      pageScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
    };

    const showCustomScrollbar = () => {
      if (!pageScrollbar || pageScrollbar.classList.contains("is-hidden")) {
        return;
      }

      pageScrollbar.classList.add("is-active");
      window.clearTimeout(scrollbarFadeTimeout);
      scrollbarFadeTimeout = window.setTimeout(() => {
        pageScrollbar.classList.remove("is-active");
      }, 700);
    };

    const setScrollLocked = (locked) => {
      if (!pageScroll) {
        document.body.style.overflow = locked ? "hidden" : "";
        return;
      }

      pageScroll.style.overflowY = locked ? "hidden" : "auto";
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);
        if (!target || !pageScroll) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        history.replaceState(null, "", targetId);
      });
    });

    if (pageScroll) {
      pageScroll.addEventListener("scroll", () => {
        syncCustomScrollbar();
        showCustomScrollbar();
      }, { passive: true });
      window.addEventListener("resize", syncCustomScrollbar);
      window.addEventListener("load", syncCustomScrollbar);
      syncCustomScrollbar();
    }

    const aboutHeadingType = document.querySelector(".about-heading-type");

    if (aboutHeadingType && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const fullText = "About Me";
      let charIndex = 0;
      let direction = 1;
      let typingTimeout = 0;

      const tickTypeHeading = () => {
        aboutHeadingType.textContent = fullText.slice(0, charIndex);

        if (direction > 0 && charIndex < fullText.length) {
          charIndex += 1;
          typingTimeout = window.setTimeout(tickTypeHeading, 185);
          return;
        }

        if (direction > 0) {
          direction = -1;
          typingTimeout = window.setTimeout(tickTypeHeading, 2400);
          return;
        }

        if (charIndex > 0) {
          charIndex -= 1;
          typingTimeout = window.setTimeout(tickTypeHeading, 120);
          return;
        }

        direction = 1;
        typingTimeout = window.setTimeout(tickTypeHeading, 1100);
      };

      tickTypeHeading();
    }

    const contactForm = document.getElementById("contact-form");
    const contactSubmit = document.getElementById("contact-submit");
    const contactStatus = document.getElementById("contact-status");

    if (contactForm && contactSubmit && contactStatus) {
      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const payload = {
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          company: String(formData.get("company") || "").trim(),
          message: String(formData.get("message") || "").trim()
        };

        contactStatus.textContent = "";
        contactStatus.classList.remove("is-success", "is-error");

        if (!payload.name || !payload.email || !payload.message) {
          contactStatus.textContent = "Please fill out your name, email, and message.";
          contactStatus.classList.add("is-error");
          return;
        }

        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
        contactStatus.textContent = "Sending your message...";

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          const result = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(result.error || "Something went wrong while sending your message.");
          }

          contactForm.reset();
          contactStatus.textContent = "Message sent. I'll get back to you soon.";
          contactStatus.classList.add("is-success");
        } catch (error) {
          contactStatus.textContent = error.message || "Something went wrong while sending your message.";
          contactStatus.classList.add("is-error");
        } finally {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Send Message";
        }
      });
    }

    const projectGalleries = {
      "pos-system": {
        title: "POS System",
        label: "Full Stack Gallery",
        description: "Use this gallery for ordering screens, admin views, reservation flow, and operations dashboards.",
        images: [
          "public/lumi-pos-system/home.jpeg",
          "public/lumi-pos-system/menu.jpeg",
          "public/lumi-pos-system/tables.png",
          "public/lumi-pos-system/takeout.png",
          "public/lumi-pos-system/kitchen.png",
          "public/lumi-pos-system/back-office.png",
          "public/lumi-pos-system/reports.png"
        ]
      },
      "ecommerce-store": {
        title: "UH Marketplace",
        label: "Campus Marketplace Gallery",
        description: "A University of Houston marketplace with a campus-branded home hero, searchable dashboard, listing detail discussion, share-resource form, and simple auth flow.",
        images: [
          "public/UH-marketplace-ecomm/home.jpeg",
          "public/UH-marketplace-ecomm/marketplace.png",
          "public/UH-marketplace-ecomm/resource.png"
        ]
      },
      "pup-central": {
        title: "Pup Central",
        label: "C++ Game Gallery",
        description: "A terminal-based virtual pet game presented with custom gallery slides that show the real game loop, breed system, save flow, and C++ architecture.",
        images: [
          "public/pup-central/cover.svg",
          "public/pup-central/gameplay.svg",
          "public/pup-central/breeds-stats.svg",
          "public/pup-central/oop-architecture.svg",
          "public/pup-central/save-load.svg",
          "public/pup-central/engineering-summary.svg"
        ]
      },
      "barbershop-booking": {
        title: "Barbershop Booking",
        label: "Web App Gallery",
        description: "Use this gallery for booking steps, service cards, barber profiles, and confirmation screens.",
        images: [
          "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503951458645-643d53bfd90f?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      "portfolio-system": {
        title: "Portfolio System",
        label: "Interface Gallery",
        description: "Use this gallery for hero concepts, mobile views, section designs, and final polished layouts.",
        images: [
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      "operational-insights": {
        title: "Operational Insights",
        label: "Data Gallery",
        description: "Use this gallery for KPI widgets, trend charts, table states, and reporting dashboards.",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      "api-integration": {
        title: "API Integration",
        label: "Engineering Gallery",
        description: "Use this gallery for loading states, API-driven screens, system diagrams, and connected UI flows.",
        images: [
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    };

    const galleryModal = document.getElementById("gallery-modal");
    const galleryTitle = document.getElementById("gallery-title");
    const galleryLabel = document.getElementById("gallery-label");
    const galleryDescription = document.getElementById("gallery-description");
    let galleryMainImage = document.getElementById("gallery-main-image");
    const galleryStage = document.getElementById("gallery-stage");
    const galleryThumbs = document.getElementById("gallery-thumbs");
    const galleryPrev = document.getElementById("gallery-prev");
    const galleryNext = document.getElementById("gallery-next");
    const galleryExpand = document.getElementById("gallery-expand");
    let activeGalleryKey = "";
    let activeGalleryIndex = 0;

    const ensureGalleryMainImage = () => {
      if (!galleryStage) {
        return null;
      }

      const existingImage = galleryStage.querySelector("#gallery-main-image");
      if (existingImage) {
        galleryMainImage = existingImage;
        return galleryMainImage;
      }

      const nextImage = document.createElement("img");
      nextImage.id = "gallery-main-image";
      nextImage.alt = "Project gallery preview";
      nextImage.decoding = "async";
      nextImage.loading = "eager";
      galleryStage.replaceChildren(nextImage);
      galleryMainImage = nextImage;
      return galleryMainImage;
    };

    const setGalleryImage = (projectKey, index) => {
      const gallery = projectGalleries[projectKey];
      const activeImage = ensureGalleryMainImage();
      if (!gallery || !activeImage) {
        return;
      }

      activeGalleryKey = projectKey;
      activeGalleryIndex = index;
      activeImage.src = gallery.images[index];
      activeImage.alt = `${gallery.title} screenshot ${index + 1}`;
      galleryThumbs.querySelectorAll(".gallery-thumb").forEach((thumb, thumbIndex) => {
        thumb.classList.toggle("active", thumbIndex === index);
      });
    };

    const openGallery = (projectKey) => {
      const gallery = projectGalleries[projectKey];
      if (!gallery || !galleryModal) {
        return;
      }

      galleryLabel.textContent = gallery.label;
      galleryTitle.textContent = gallery.title;
      galleryDescription.textContent = gallery.description;
      galleryThumbs.innerHTML = "";
      ensureGalleryMainImage();

      gallery.images.forEach((imageUrl, index) => {
        const thumbButton = document.createElement("button");
        thumbButton.type = "button";
        thumbButton.className = "gallery-thumb";
        thumbButton.innerHTML = `<img src="${imageUrl}" alt="${gallery.title} thumbnail ${index + 1}">`;
        thumbButton.addEventListener("click", () => setGalleryImage(projectKey, index));
        galleryThumbs.appendChild(thumbButton);
      });

      const firstThumb = galleryThumbs.querySelector(".gallery-thumb");
      if (firstThumb) {
        setGalleryImage(projectKey, 0);
      }

      galleryModal.classList.add("open");
      galleryModal.classList.remove("is-expanded");
      galleryModal.setAttribute("aria-hidden", "false");
      if (galleryExpand) {
        galleryExpand.textContent = "Expand";
      }
      setScrollLocked(true);
    };

    const closeGallery = () => {
      if (!galleryModal) {
        return;
      }

      galleryModal.classList.remove("open");
      galleryModal.classList.remove("is-expanded");
      galleryModal.setAttribute("aria-hidden", "true");
      if (galleryMainImage) {
        galleryMainImage.removeAttribute("src");
        galleryMainImage.alt = "Project gallery preview";
      }
      setScrollLocked(false);
    };

    const bindGalleryTriggers = (scope = document) => {
      scope.querySelectorAll(".gallery-trigger").forEach((button) => {
        button.addEventListener("click", () => openGallery(button.dataset.project));
      });
    };

    bindGalleryTriggers();

    const stepGallery = (direction) => {
      const gallery = projectGalleries[activeGalleryKey];
      if (!gallery) {
        return;
      }

      const nextIndex = (activeGalleryIndex + direction + gallery.images.length) % gallery.images.length;
      setGalleryImage(activeGalleryKey, nextIndex);
    };

    if (galleryPrev) {
      galleryPrev.addEventListener("click", () => stepGallery(-1));
    }

    if (galleryNext) {
      galleryNext.addEventListener("click", () => stepGallery(1));
    }

    if (galleryExpand && galleryModal) {
      galleryExpand.addEventListener("click", () => {
        const expanded = galleryModal.classList.toggle("is-expanded");
        galleryExpand.textContent = expanded ? "Standard" : "Expand";
      });
    }

    document.querySelectorAll("[data-close-gallery='true']").forEach((element) => {
      element.addEventListener("click", closeGallery);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeGallery();
      } else if (galleryModal?.classList.contains("open") && event.key === "ArrowLeft") {
        stepGallery(-1);
      } else if (galleryModal?.classList.contains("open") && event.key === "ArrowRight") {
        stepGallery(1);
      }
    });

    const allProjectsModal = document.getElementById("all-projects-modal");
    const allProjectsGrid = document.getElementById("all-projects-grid");
    const openAllProjectsButton = document.getElementById("open-all-projects");
    const sourceProjectsGrid = document.getElementById("projects-grid");

    if (allProjectsGrid && sourceProjectsGrid) {
      const clonedProjects = sourceProjectsGrid.cloneNode(true);
      clonedProjects.removeAttribute("id");
      clonedProjects.querySelectorAll(".project-card").forEach((card) => {
        card.classList.remove("is-hidden");
        card.classList.remove("reveal", "delay-1", "delay-2", "delay-3");
        card.classList.add("visible");
      });
      allProjectsGrid.append(...Array.from(clonedProjects.children));
      bindGalleryTriggers(allProjectsGrid);
    }

    const openAllProjects = () => {
      if (!allProjectsModal) {
        return;
      }
      allProjectsModal.classList.add("open");
      allProjectsModal.setAttribute("aria-hidden", "false");
      setScrollLocked(true);
    };

    const closeAllProjects = () => {
      if (!allProjectsModal) {
        return;
      }
      allProjectsModal.classList.remove("open");
      allProjectsModal.setAttribute("aria-hidden", "true");
      setScrollLocked(false);
    };

    if (openAllProjectsButton) {
      openAllProjectsButton.addEventListener("click", openAllProjects);
    }

    document.querySelectorAll("[data-close-projects='true']").forEach((element) => {
      element.addEventListener("click", closeAllProjects);
    });

    const skillsTrack = document.getElementById("skills-track");
    const skillsGrid = document.getElementById("skills-grid");

    if (skillsTrack && skillsGrid && skillsTrack.children.length === 1) {
      const duplicateSkillsGrid = skillsGrid.cloneNode(true);
      duplicateSkillsGrid.removeAttribute("id");
      duplicateSkillsGrid.setAttribute("aria-hidden", "true");
      duplicateSkillsGrid.querySelectorAll(".skill-card").forEach((card) => {
        card.classList.remove("reveal", "delay-1", "delay-2", "delay-3");
        card.classList.add("visible");
      });
      skillsTrack.appendChild(duplicateSkillsGrid);
    }

    const canvas = document.getElementById("hero-particles");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (canvas && !reducedMotionQuery.matches) {
      const context = canvas.getContext("2d");
      const pointer = { x: null, y: null };
      let animationFrameId = 0;
      let particles = [];
      let currentParticleCount = 0;
      let width = 0;
      let height = 0;
      let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      let frame = 0;
      const particleConfig = {
        // Current baseline: count = max(90, floor(viewport area / 12000))
        minCount: 90,
        densityDivisor: 12000,
        baseSizeMin: 1.4,
        baseSizeRange: 3
      };

      const palette = [
        "rgba(245, 240, 255, 0.96)",
        "rgba(223, 208, 255, 0.92)",
        "rgba(196, 168, 255, 0.9)",
        "rgba(176, 124, 255, 0.92)",
        "rgba(214, 107, 255, 0.88)",
        "rgba(164, 214, 255, 0.9)",
        "rgba(189, 235, 255, 0.88)",
        "rgba(255, 228, 196, 0.82)"
      ];

      const getViewportParticleTuning = () => {
        if (width <= 520) {
          return {
            minCount: 42,
            densityDivisor: 22000,
            velocityScale: 0.34
          };
        }

        if (width <= 760) {
          return {
            minCount: 54,
            densityDivisor: 18500,
            velocityScale: 0.48
          };
        }

        if (width <= 1050) {
          return {
            minCount: 72,
            densityDivisor: 15000,
            velocityScale: 0.72
          };
        }

        return {
          minCount: particleConfig.minCount,
          densityDivisor: particleConfig.densityDivisor,
          velocityScale: 1
        };
      };

      const buildParticles = () => {
        const viewportTuning = getViewportParticleTuning();
        const count = Math.max(
          viewportTuning.minCount,
          Math.floor((width * height) / viewportTuning.densityDivisor)
        );
        currentParticleCount = count;
        canvas.dataset.nodeCount = String(count);
        window.__portfolioNodeCount = count;
        particles = Array.from({ length: count }, (_, index) => {
          const baseSize = Math.random() * particleConfig.baseSizeRange + particleConfig.baseSizeMin;
          const driftRange = 0.34 * viewportTuning.velocityScale;

          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * driftRange,
            vy: (Math.random() - 0.5) * driftRange,
            size: baseSize,
            baseSize,
            alpha: Math.random() * 0.55 + 0.4,
            color: palette[Math.floor(Math.random() * palette.length)],
            pulseOffset: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.024 + 0.05,
            flareStrength: Math.random() * 0.2 + 0.18,
            shimmerOffset: Math.random() * Math.PI * 2,
            shimmerSpeed: Math.random() * 0.09 + 0.12
          };
        });
      };

      const resizeCanvas = () => {
        if (!context) {
          return;
        }

        width = window.innerWidth;
        height = window.innerHeight;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        buildParticles();
      };

      const drawFourPointStar = (x, y, outerRadius, innerPull) => {
        context.beginPath();
        context.moveTo(x, y - outerRadius);
        context.bezierCurveTo(
          x + innerPull * 0.28,
          y - innerPull,
          x + innerPull,
          y - innerPull * 0.28,
          x + outerRadius,
          y
        );
        context.bezierCurveTo(
          x + innerPull,
          y + innerPull * 0.28,
          x + innerPull * 0.28,
          y + innerPull,
          x,
          y + outerRadius
        );
        context.bezierCurveTo(
          x - innerPull * 0.28,
          y + innerPull,
          x - innerPull,
          y + innerPull * 0.28,
          x - outerRadius,
          y
        );
        context.bezierCurveTo(
          x - innerPull,
          y - innerPull * 0.28,
          x - innerPull * 0.28,
          y - innerPull,
          x,
          y - outerRadius
        );
        context.closePath();
      };

      const draw = () => {
        if (!context) {
          return;
        }

        frame += 1;
        context.clearRect(0, 0, width, height);
        const mobileLinkScale =
          width <= 520 ? 0.12 :
          width <= 760 ? 0.2 :
          width <= 1050 ? 0.48 :
          1;

        particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;

          if (pointer.x !== null && pointer.y !== null) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 140) {
              particle.x -= dx * 0.002;
              particle.y -= dy * 0.002;
            }
          }

          const pulse = (Math.sin(frame * particle.pulseSpeed + particle.pulseOffset) + 1) / 2;
          const shimmer = (Math.sin(frame * particle.shimmerSpeed + particle.shimmerOffset) + 1) / 2;
          const twinklePulse = Math.pow(pulse, 2.2);
          const twinkleShimmer = Math.pow(shimmer, 3.4);
          particle.twinkleMix = Math.min(1, twinklePulse + twinkleShimmer * 0.45);
        });

        particles.forEach((particle, index) => {
          const twinkleMix = particle.twinkleMix ?? 0;

          for (let j = index + 1; j < particles.length; j += 1) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 130) {
              const otherMix = other.twinkleMix ?? 0;
              const linkPulse = (twinkleMix + otherMix) / 2;
              context.beginPath();
              context.strokeStyle = `rgba(216, 180, 255, ${(0.1 - distance / 1200 + linkPulse * 0.035) * mobileLinkScale})`;
              context.lineWidth = (0.8 + linkPulse * 0.1) * Math.max(0.38, mobileLinkScale);
              context.moveTo(particle.x, particle.y);
              context.lineTo(other.x, other.y);
              context.stroke();
            }
          }
        });

        particles.forEach((particle) => {
          const twinkleMix = particle.twinkleMix ?? 0;
          const drawSize = particle.baseSize + twinkleMix * (particle.flareStrength + 0.34);
          const glowBlur = 8 + twinkleMix * 34;
          const glowAlpha = Math.min(1, particle.alpha + twinkleMix * 0.72);
          const fillColor = particle.color.replace(/[\d.]+\)$/, `${glowAlpha})`);
          const auraColor = particle.color.replace(/[\d.]+\)$/, `${Math.min(1, 0.34 + twinkleMix * 0.5)})`);
          const baseInnerPull = drawSize * 0.22;

          context.fillStyle = fillColor;
          context.shadowBlur = glowBlur;
          context.shadowColor = auraColor;
          drawFourPointStar(particle.x, particle.y, drawSize, baseInnerPull);
          context.fill();
          context.shadowBlur = 0;

          if (twinkleMix > 0.42) {
            const flareMix = (twinkleMix - 0.42) / 0.58;
            const sparkleHaloColor = particle.color.replace(/[\d.]+\)$/, `${Math.min(1, 0.14 + flareMix * 0.14)})`);
            const sparkleCoreColor = particle.color.replace(/[\d.]+\)$/, `${Math.min(1, 0.52 + flareMix * 0.24)})`);
            const outerRadius = drawSize * (1.08 + flareMix * 0.82);
            const innerPull = outerRadius * 0.22;
            const coreRadius = drawSize * (0.12 + flareMix * 0.025);

            context.fillStyle = sparkleCoreColor;
            context.shadowBlur = 10 + flareMix * 14;
            context.shadowColor = sparkleHaloColor;
            drawFourPointStar(particle.x, particle.y, outerRadius, innerPull);
            context.fill();
            context.shadowBlur = 0;

            context.beginPath();
            context.fillStyle = particle.color.replace(/[\d.]+\)$/, `${Math.min(1, 0.72 + flareMix * 0.16)})`);
            context.arc(particle.x, particle.y, coreRadius, 0, Math.PI * 2);
            context.fill();
          }
        });

        animationFrameId = window.requestAnimationFrame(draw);
      };

      resizeCanvas();
      draw();

      window.addEventListener("resize", resizeCanvas);

      window.addEventListener("mousemove", (event) => {
        const bounds = canvas.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
      });

      window.addEventListener("mouseleave", () => {
        pointer.x = null;
        pointer.y = null;
      });

      reducedMotionQuery.addEventListener("change", (event) => {
        if (event.matches) {
          window.cancelAnimationFrame(animationFrameId);
          if (context) {
            context.clearRect(0, 0, width, height);
          }
        }
      });
    }
