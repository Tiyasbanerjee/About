document.addEventListener('DOMContentLoaded', () => {
    const bgStarry = document.getElementById('bg-starry');
    const bgSocrates = document.getElementById('bg-socrates');
    const blocks = document.querySelectorAll('.philosophy-block');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Background Transition Logic
        // As we scroll down 1 screen height, fade out starry and fade in socrates
        const transitionPoint = windowHeight * 0.5; // Start transitioning halfway down the first page
        let opacity = (scrollY - transitionPoint) / (windowHeight * 0.5);

        // Clamp opacity between 0 and 1
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        bgSocrates.style.opacity = opacity;
        // bgStarry.style.opacity = 1 - opacity; // Optional: fade out starry night if desired, or keep it behind

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
});
