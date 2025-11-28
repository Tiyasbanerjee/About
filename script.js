document.addEventListener('DOMContentLoaded', () => {
    const bgStarry = document.getElementById('bg-starry');
    const bgSocrates = document.getElementById('bg-socrates');
    const bgAlchemist = document.getElementById('bg-alchemist');
    const readerSection = document.getElementById('reader-section');
    const blocks = document.querySelectorAll('.philosophy-block');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // --- Transition 1: Starry -> Socrates ---
        // Start transitioning halfway down the first page
        const transitionPoint1 = windowHeight * 0.5;
        let socratesOpacity = (scrollY - transitionPoint1) / (windowHeight * 0.5);

        // Clamp between 0 and 1
        if (socratesOpacity < 0) socratesOpacity = 0;
        if (socratesOpacity > 1) socratesOpacity = 1;

        // --- Transition 2: Socrates -> Alchemist ---
        // Fade in Alchemist as Reader Section enters the viewport
        let alchemistOpacity = 0;
        if (readerSection) {
            const readerTop = readerSection.getBoundingClientRect().top;
            // readerTop is distance from top of viewport.
            // When readerTop is windowHeight, it's just starting to enter (opacity 0)
            // When readerTop is 0, it's fully covering the screen (opacity 1)

            if (readerTop < windowHeight) {
                alchemistOpacity = 1 - (readerTop / windowHeight);
                // Accelerate the fade slightly so it's fully visible before the top hits 0
                alchemistOpacity = alchemistOpacity * 1.5;
            }
            if (alchemistOpacity < 0) alchemistOpacity = 0;
            if (alchemistOpacity > 1) alchemistOpacity = 1;
        }

        // Apply Opacities
        // Socrates should fade out as Alchemist fades in
        if (socratesOpacity > 1 - alchemistOpacity) {
            socratesOpacity = 1 - alchemistOpacity;
        }

        bgSocrates.style.opacity = socratesOpacity;
        bgAlchemist.style.opacity = alchemistOpacity;

        // Optional: Fade out Starry Night
        // bgStarry.style.opacity = 1 - socratesOpacity; 

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
                setTimeout(typeLine, 50); // Typing speed
            } else {
                terminalContent.innerHTML += "<br>";
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 300); // Pause between lines
            }
        } else {
            // Loop animation or stop
            // setTimeout(() => { terminalContent.innerHTML = ""; lineIndex = 0; typeLine(); }, 5000);
        }
    }

    typeLine();

    // --- Reader Feature Logic ---
    const bookContent = document.getElementById('book-content');
    const bookContainer = document.getElementById('book-container');
    const pageNumberDisplay = document.getElementById('page-number');
    let fullText = "";
    let pages = [];
    let currentPageIndex = 0;

    // Fetch the markdown content
    fetch('thought.md')
        .then(response => response.text())
        .then(text => {
            fullText = parseMarkdown(text);
            paginateText();
            renderPage(0);
        })
        .catch(err => {
            bookContent.innerHTML = "<p>Error loading thought. Please try again later.</p>";
            console.error(err);
        });

    // Simple Markdown Parser (Headers, Paragraphs, Emphasis)
    function parseMarkdown(markdown) {
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            // Italic
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            // Blockquotes
            .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Paragraphs (double newlines)
            .replace(/\n\n/gim, '</p><p>')
            // Clean up
            .trim();

        return `<p>${html}</p>`;
    }

    // Pagination Logic
    function paginateText() {
        // Create a temporary invisible container to measure text
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.width = bookContent.clientWidth + 'px';
        tempDiv.style.height = 'auto';
        tempDiv.style.fontFamily = getComputedStyle(bookContent).fontFamily;
        tempDiv.style.fontSize = getComputedStyle(bookContent).fontSize;
        tempDiv.style.lineHeight = getComputedStyle(bookContent).lineHeight;
        tempDiv.className = 'book-content'; // Inherit styles
        document.body.appendChild(tempDiv);

        // Split text into potential chunks (e.g., by paragraphs or tags)
        // For simplicity, we'll split by closing tags to keep HTML structure intact
        // This is a basic approach; robust pagination is complex
        const rawChunks = fullText.split(/(<\/p>|<\/h1>|<\/h2>|<\/h3>|<\/blockquote>)/g);

        pages = [];
        let currentPage = "";

        for (let i = 0; i < rawChunks.length; i++) {
            const chunk = rawChunks[i];
            if (!chunk.trim()) continue;

            // Try adding chunk to current page
            tempDiv.innerHTML = currentPage + chunk;

            // Check if it fits
            if (tempDiv.clientHeight <= bookContent.clientHeight) {
                currentPage += chunk;
            } else {
                // If current page is empty but chunk is too big, we must force it (or handle overflow)
                if (currentPage === "") {
                    pages.push(chunk); // Force it, will overflow
                } else {
                    pages.push(currentPage);
                    currentPage = chunk;
                }
            }
        }

        if (currentPage) {
            pages.push(currentPage);
        }

        document.body.removeChild(tempDiv);
    }

    function renderPage(index) {
        if (index >= 0 && index < pages.length) {
            // Fade out effect
            bookContent.style.opacity = 0;
            setTimeout(() => {
                bookContent.innerHTML = pages[index];
                pageNumberDisplay.innerText = `Page ${index + 1} of ${pages.length}`;
                bookContent.style.opacity = 1;
            }, 200);
            currentPageIndex = index;
        }
    }

    // Page Turn Interaction
    bookContainer.addEventListener('click', () => {
        let nextIndex = currentPageIndex + 1;
        if (nextIndex >= pages.length) {
            nextIndex = 0; // Loop back to start
        }
        renderPage(nextIndex);
    });

    // Handle Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            paginateText();
            renderPage(0); // Reset to page 1 on resize for simplicity
        }, 300);
    });

});
