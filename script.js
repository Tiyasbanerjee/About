document.addEventListener('DOMContentLoaded', () => {
    // --- Loader Logic ---
    const orbs = [
        { el: document.getElementById('orb-1'), speed: 6 },
        { el: document.getElementById('orb-2'), speed: 8 },
        { el: document.getElementById('orb-3'), speed: 5 }
    ];
    const core = document.getElementById('core');
    const textBox = document.getElementById('text-box');
    const mainText = document.getElementById('main-text');
    const subText = document.getElementById('sub-text');
    const loaderContainer = document.getElementById('container');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const mainSiteContent = document.getElementById('main-site-content');

    // State
    let globalSpeedMultiplier = 1.0;
    let isImploding = false;

    // Apply initial animation styles
    if (orbs[0].el) { // Check if loader elements exist
        orbs.forEach(o => {
            o.el.style.animationName = 'spin-orbit';
            o.el.style.animationDuration = `${o.speed}s`;
            o.el.style.animationTimingFunction = 'linear';
            o.el.style.animationIterationCount = 'infinite';
        });

        // Start accelerating after 2 seconds
        setTimeout(accelerate, 2000);
    } else {
        // Fallback if loader is missing
        initSite();
    }

    // 1. Acceleration Loop
    function accelerate() {
        if (isImploding) return;

        // Increase speed multiplier (decrease duration)
        if (globalSpeedMultiplier > 0.1) {
            globalSpeedMultiplier *= 0.99; // Gradual acceleration
        } else {
            triggerSingularity();
            return;
        }

        // Apply new speeds
        orbs.forEach(o => {
            o.el.style.animationDuration = `${o.speed * globalSpeedMultiplier}s`;
        });

        // Text Logic based on speed
        if (globalSpeedMultiplier < 0.6 && mainText.innerText === "BECOMING") {
            mainText.innerText = "ACCELERATING";
            subText.innerText = "momentum building...";
        }
        if (globalSpeedMultiplier < 0.3 && mainText.innerText === "ACCELERATING") {
            mainText.innerText = "TRANSCENDING";
            subText.innerText = "critical mass...";
            subText.style.color = "#ffaa00";
        }

        // Core Pulse gets faster/intense
        const pulseSpeed = 4 * globalSpeedMultiplier;
        core.style.animation = `pulse-core ${pulseSpeed}s ease-in-out infinite`;

        requestAnimationFrame(accelerate);
    }

    // 2. The Ending (Physics Implosion)
    function triggerSingularity() {
        if (isImploding) return;
        isImploding = true;

        // Update text
        textBox.style.opacity = 0; // Hide text for clean ending

        // Step A: Suck in the outer orbs
        orbs.forEach(o => {
            // Remove orbit animation
            o.el.style.animation = 'none';

            // Trigger CSS transition to center
            setTimeout(() => {
                o.el.style.transition = "all 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045)"; // "Suction" easing
                o.el.style.transform = "translate(-50%, -50%) scale(0.1)"; // Shrink into center
                o.el.style.opacity = "0";
            }, 50);
        });

        // Step B: Implode Core
        setTimeout(() => {
            core.style.animation = "implode-core 1.5s ease-in forwards";
        }, 500); // Wait for suction to finish slightly

        // Step C: Flash and Reveal Main Site
        setTimeout(() => {
            // Hide loader visuals
            loaderWrapper.style.opacity = 0;

            // Show main site content
            mainSiteContent.style.display = 'block';
            // Trigger reflow
            void mainSiteContent.offsetWidth;
            mainSiteContent.style.opacity = 1;

            // Remove loader from DOM after fade out
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
                // Initialize the rest of the site
                initSite();
            }, 1500);

        }, 1400); // Match implosion timing
    }

    // --- Main Site Initialization ---
    function initSite() {
        const bgStarry = document.getElementById('bg-starry');
        const bgSocrates = document.getElementById('bg-socrates');
        const bgAlchemist = document.getElementById('bg-alchemist');
        const blocks = document.querySelectorAll('.philosophy-block');
        const sections = document.querySelectorAll('section');

        // --- Background Transition Logic ---
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // 1. Starry Night (Bottom Layer)
            const starryOp = 1;

            // 2. Socrates (Middle Layer)
            let socratesOp = 0;
            if (scrollY > windowHeight * 0.2) {
                socratesOp = (scrollY - (windowHeight * 0.2)) / (windowHeight * 0.5);
            }
            if (socratesOp > 1) socratesOp = 1;

            // 3. Alchemist (Top Layer)
            let maxReaderCoverage = 0;

            sections.forEach(section => {
                if (section.classList.contains('reader-section')) {
                    const rect = section.getBoundingClientRect();
                    const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
                    const coverage = visibleHeight / windowHeight;
                    if (coverage > maxReaderCoverage) {
                        maxReaderCoverage = coverage;
                    }
                }
            });

            let alchemistOp = maxReaderCoverage * 1.5;
            if (alchemistOp > 1) alchemistOp = 1;

            // Apply Opacities
            bgStarry.style.opacity = starryOp;
            bgSocrates.style.opacity = socratesOp;
            bgAlchemist.style.opacity = alchemistOp;


            // Reveal Blocks on Scroll
            blocks.forEach(block => {
                const blockTop = block.getBoundingClientRect().top;
                const triggerPoint = windowHeight * 0.8;

                if (blockTop < triggerPoint) {
                    block.classList.add('visible');
                }
            });
        });

        // Terminal Animation
        const terminalContent = document.getElementById('terminal-content');
        if (terminalContent) {
            const lines = [
                "> initializing_human_thought.exe...",
                "> loading_creativity_modules...",
                "> status: imperfect",
                "> status: curious",
                "> connecting_to_universe...",
                "> access_granted.",
                "> welcome_user."
            ];

            let lineIndex = 0;
            let charIndex = 0;

            function typeLine() {
                if (lineIndex < lines.length) {
                    if (charIndex < lines[lineIndex].length) {
                        terminalContent.innerHTML += lines[lineIndex].charAt(charIndex);
                        charIndex++;
                        setTimeout(typeLine, 50);
                    } else {
                        terminalContent.innerHTML += "<br>";
                        lineIndex++;
                        charIndex = 0;
                        setTimeout(typeLine, 300);
                    }
                }
            }

            typeLine();
        }

        // --- Reader Feature Logic (Multiple Instances) ---
        const readerSections = document.querySelectorAll('.reader-section');
        let fullText = "";

        // Fetch the markdown content once
        fetch('thought.md')
            .then(response => {
                if (!response.ok) throw new Error("Failed to load thought.md");
                return response.text();
            })
            .then(text => {
                fullText = parseMarkdown(text);
                // Initialize all readers
                readerSections.forEach((section, index) => {
                    initReader(section, index);
                });
            })
            .catch(err => {
                console.error(err);
                readerSections.forEach(section => {
                    const content = section.querySelector('.book-content');
                    if (content) content.innerHTML = "<p>Error loading content.</p>";
                });
            });

        // Simple Markdown Parser
        function parseMarkdown(markdown) {
            if (!markdown) return "";
            let html = markdown
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                .replace(/\*(.*)\*/gim, '<i>$1</i>')
                .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/\n\n/gim, '</p><p>')
                .trim();
            return `<p>${html}</p>`;
        }

        function initReader(section, readerIndex) {
            const bookContent = section.querySelector('.book-content');
            const bookContainer = section.querySelector('.book-container');
            const pageNumberDisplay = section.querySelector('.page-number');

            if (!bookContent || !bookContainer) return;

            let pages = [];
            let currentPageIndex = 0;

            // Pagination Logic (Scoped to this reader)
            function paginateText() {
                if (!bookContent.clientWidth) return; // Safety check

                // Create temp div
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                tempDiv.style.width = bookContent.clientWidth + 'px';
                tempDiv.style.height = 'auto';
                tempDiv.style.fontFamily = getComputedStyle(bookContent).fontFamily;
                tempDiv.style.fontSize = getComputedStyle(bookContent).fontSize;
                tempDiv.style.lineHeight = getComputedStyle(bookContent).lineHeight;
                tempDiv.className = 'book-content';
                document.body.appendChild(tempDiv);

                const rawChunks = fullText.split(/(<\/p>|<\/h1>|<\/h2>|<\/h3>|<\/blockquote>)/g);
                pages = [];
                let currentPage = "";

                for (let i = 0; i < rawChunks.length; i++) {
                    const chunk = rawChunks[i];
                    if (!chunk.trim()) continue;

                    tempDiv.innerHTML = currentPage + chunk;

                    if (tempDiv.clientHeight <= bookContent.clientHeight) {
                        currentPage += chunk;
                    } else {
                        if (currentPage === "") {
                            pages.push(chunk);
                        } else {
                            pages.push(currentPage);
                            currentPage = chunk;
                        }
                    }
                }
                if (currentPage) pages.push(currentPage);
                document.body.removeChild(tempDiv);
            }

            function renderPage(index) {
                if (index >= 0 && index < pages.length) {
                    // Fade out effect
                    bookContent.style.opacity = 0;
                    setTimeout(() => {
                        bookContent.innerHTML = pages[index];
                        if (pageNumberDisplay) {
                            pageNumberDisplay.innerText = `Page ${index + 1} of ${pages.length}`;
                        }
                        bookContent.style.opacity = 1;
                    }, 400); // Match CSS transition duration
                    currentPageIndex = index;
                }
            }

            // Initial Pagination
            // Wait a moment for layout to settle
            setTimeout(() => {
                paginateText();
                renderPage(0);
            }, 100);

            // Click Interaction
            bookContainer.addEventListener('click', () => {
                let nextIndex = currentPageIndex + 1;
                if (nextIndex >= pages.length) nextIndex = 0;
                renderPage(nextIndex);
            });

            // Resize Handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    paginateText();
                    renderPage(0);
                }, 300);
            });
        }
    }
});
