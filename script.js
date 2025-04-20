document.addEventListener("DOMContentLoaded", () => {

  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: false,
    mirror: false,
  })

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // Custom cursor
  const cursor = document.querySelector(".cursor-dot")
  const cursorOutline = document.querySelector(".cursor-outline")

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"

    // Add a slight delay to the outline for a trailing effect
    setTimeout(() => {
      cursorOutline.style.left = e.clientX + "px"
      cursorOutline.style.top = e.clientY + "px"
    }, 50)
  })

  // Make cursor bigger when hovering over links and buttons
  const links = document.querySelectorAll("a, button, .project-card, .education-card, .certification-card")
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorOutline.style.borderColor = "#6366f1"
    })

    link.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)"
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
      cursorOutline.style.borderColor = "rgba(99, 102, 241, 0.5)"
    })
  })
  

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

  // Close mobile menu when clicking a link
  const mobileLinks = mobileMenu.querySelectorAll("a")
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden")
    })
  })

  // Navbar scroll effect
  const navbar = document.getElementById("navbar")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("bg-white", "shadow-md")
      navbar.classList.remove("bg-transparent")
    } else {
      navbar.classList.remove("bg-white", "shadow-md")
      navbar.classList.add("bg-transparent")
    }
  })

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("active")
    } else {
      backToTopButton.classList.remove("active")
    }
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })


  // Project filtering
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectItems = document.querySelectorAll(".project-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Get filter value
      const filterValue = button.getAttribute("data-filter")

      // Filter projects
      projectItems.forEach((item) => {
        if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Contact form submission
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields")
        return
      }

      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalText = submitButton.innerHTML

      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'

      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!'
        contactForm.reset()

        setTimeout(() => {
          submitButton.disabled = false
          submitButton.innerHTML = originalText
        }, 3000)
      }, 2000)
    })
  }

  // Initialize 3D background
  initThreeBackground()

  // Animate skill bars when they come into view
  const skillSections = document.querySelectorAll(".skill-item")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector(".skill-progress")
          const width = progressBar.style.width
          progressBar.style.width = "0"
          setTimeout(() => {
            progressBar.style.width = width
          }, 100)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  skillSections.forEach((section) => {
    observer.observe(section)
  })

  // 3D tilt effect for cards
  const cards = document.querySelectorAll(".education-card, .project-card, .certification-card")

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xPercent = x / rect.width
      const yPercent = y / rect.height

      const rotateX = (0.5 - yPercent) * 10
      const rotateY = (xPercent - 0.5) * 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    })
  })
})

// Three.js background
function initThreeBackground() {
  const canvas = document.getElementById("bg-canvas")

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 2000

  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.8,
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  camera.position.z = 3

  // Mouse movement effect
  let mouseX = 0
  let mouseY = 0

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100
    mouseY = (event.clientY - window.innerHeight / 2) / 100
  }

  document.addEventListener("mousemove", onDocumentMouseMove)

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    particlesMesh.rotation.x += 0.0003
    particlesMesh.rotation.y += 0.0005

    // Respond to mouse movement
    particlesMesh.rotation.x += mouseY * 0.0003
    particlesMesh.rotation.y += mouseX * 0.0003

    renderer.render(scene, camera)
  }

  animate()
}

