// Fragrance Notes Visualizer
(function() {
    // Add styles
    const styles = `
        html[data-theme='dark'] {
            --note-top-bg: #1a2234;
            --note-middle-bg: #2a2020; 
            --note-base-bg: #1a2a1a;
            --note-title-color: rgba(255, 255, 255, 0.92);
            --note-text-color: rgba(255, 255, 255, 0.75);
            --note-item-bg: #2a2a2a;
            --accord-text-color: rgba(255, 255, 255, 0.92);
        }
        html[data-theme='light'] {
            --note-top-bg: #e5f0fc;
            --note-middle-bg: #fcedee;
            --note-base-bg: #eaf8ea;
            --note-title-color: #222;
            --note-text-color: #444;
            --note-item-bg: white;
            --accord-text-color: #222;
        }
        .fragrance-visualizer {
            display: flex;
            justify-content: space-between;
            gap: 40px;
        }
        .notes-and-accords {
            margin: 20px auto;
            font-family: Arial, sans-serif;
            max-width: 800px;
        }
        .notes-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 60%;
        }
        .accords-container {
            width: 40%;
            padding: 20px;
        }
        .accords-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: var(--note-title-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .accord-bar {
            margin-bottom: 15px;
            border-radius: 4px;
            overflow: hidden;
        }
        .accord-content {
            padding: 8px 12px;
            color: var(--accord-text-color);
            font-weight: 500;
            font-size: 14px;
            text-transform: capitalize;
            transition: width 0.3s ease;
            white-space: nowrap;
        }
        .note-section {
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border: 1px solid rgba(128,128,128,0.12);
            margin-bottom: 5px;
        }
        .note-section.top {
            background-color: var(--note-top-bg);
        }
        .note-section.middle {
            background-color: var(--note-middle-bg);
        }
        .note-section.base {
            background-color: var(--note-base-bg);
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: var(--note-title-color, #222);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .notes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 20px;
        }
        .note-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            background: var(--note-item-bg, white);
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .note-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }
        .note-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .note-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.2s ease;
            filter: var(--note-icon-filter, none);
        }
        html[data-theme='dark'] {
            --note-icon-filter: brightness(0.9);
        }
        .note-item:hover .note-icon img {
            transform: scale(1.1);
        }
        .note-name {
            font-size: 13px;
            color: var(--note-text-color, #444);
            font-weight: 500;
            text-transform: capitalize;
        }
    `;

    // Add stylesheet to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Accord colors mapping
    const accordColors = {
        // Woody & Earthy
        woody: '#8B4513',
        earthy: '#6B4423',
        mossy: '#4A5D23',
        
        // Floral
        rose: '#FF69B4',
        floral: '#FFB6C1',
        powdery: '#FFF0F5',
        
        // Fresh & Clean
        fresh: '#00FFFF',
        marine: '#4682B4',
        ozonic: '#87CEEB',
        
        // Green & Natural
        green: '#228B22',
        herbal: '#90EE90',
        conifer: '#006400',
        grassy: '#32CD32',
        
        // Fruity & Sweet
        fruity: '#FF6347',
        sweet: '#FFB6C1',
        citrus: '#FFA500',
        tropical: '#FF4500',
        
        // Spicy & Aromatic
        aromatic: '#9ACD32',
        spicy: '#FF4500',
        peppery: '#DC143C',
        
        // Miscellaneous
        camphor: '#87CEEB',
        aldehydic: '#F5F5F5',
        leather: '#8B4513',
        animalic: '#8B4513',
        gourmand: '#DEB887',
        vanilla: '#FFEFD5',
        musky: '#DDA0DD',
        oriental: '#DDA0DD',
        balsamic: '#8B4513'
    };

    // Note to accord mapping
    const noteToAccordMapping = {
        // Woods
        'sandalwood': ['woody', 'earthy'],
        'cedar': ['woody', 'conifer'],
        'patchouli': ['woody', 'earthy'],
        'vetiver': ['woody', 'earthy'],
        'oud': ['woody', 'oriental'],

        // Flowers
        'rose': ['rose', 'floral'],
        'jasmine': ['floral', 'sweet'],
        'lavender': ['aromatic', 'herbal'],
        'orange blossom': ['floral', 'fresh'],
        'osmanthus': ['floral', 'fruity'],
        'iris': ['floral', 'powdery'],
        'orris': ['floral', 'powdery'],

        // Citrus
        'bergamot': ['citrus', 'fresh'],
        'lemon': ['citrus', 'fresh'],
        'orange': ['citrus', 'fruity'],

        // Spices and Aromatics
        'vanilla': ['sweet', 'gourmand'],
        'cinnamon': ['spicy', 'sweet'],
        'nutmeg': ['spicy', 'aromatic'],
        'benzoin': ['sweet', 'balsamic'],
        'ambrofix': ['woody', 'musky'],
        'pimento': ['spicy', 'aromatic']
    };

    // Icon mapping with CDN URLs
    const noteIcons = {
        // Citrus Notes
        'bergamot': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/citrus/bergamot.png',
        'lemon': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/citrus/lemon.png',
        'orange': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/citrus/orange.png',
        
        // Floral Notes
        'rose': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/floral/rose.png',
        'jasmine': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/floral/jasmine.png',
        'lavender': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/floral/lavender.png',
        
        // Woody Notes
        'sandalwood': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/woody/sandalwood.png',
        'cedar': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/woody/cedar.png',
        
        // Spicy Notes
        'vanilla': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/spicy/vanilla.png',
        'cinnamon': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/spicy/cinnamon.png',
        
        // Default fallback icon for other notes
        'default': 'https://cdn.jsdelivr.net/gh/NSAjay2279/fragrance-icons@v1.0.0/note-icons/misc/generic-note.png'
    };

    // Helper function to decode HTML entities
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Function to extract notes from content
    function extractFragranceNotes(htmlContent) {
        const extractNotesFromText = (text) => {
            const div = document.createElement('div');
            div.innerHTML = text;
            let cleanText = div.textContent || div.innerText;
            cleanText = cleanText
                .replace(/^[N][a-z];\s*/gm, '')
                .replace(/^\s+/gm, '')
                .replace(/^[A-Za-z]+;\s*/gm, '')
                .replace(/&nbsp;/g, ' ');
            
            return cleanText
                .split(',')
                .map(note => {
                    note = note.trim();
                    if (note.includes(':')) {
                        note = note.split(':')[1].trim();
                    }
                    return decodeHTMLEntities(note);
                })
                .filter(note => note)
                .map(note => note.toLowerCase());
        };

        const topIndex = htmlContent.indexOf('Top Notes:');
        const middleIndex = htmlContent.indexOf('Middle Notes:');
        const baseIndex = htmlContent.indexOf('Base Notes:');
        
        const cleanupNote = (note) => {
            return decodeHTMLEntities(note)
                .replace(/^(freshly cut|fresh|dried) /, '')
                .replace(/^[A-Za-z]+;\s*/, '')
                .replace(/&nbsp;/g, ' ');
        };
        
        return {
            top: topIndex > -1 ? extractNotesFromText(htmlContent.slice(
                topIndex + 10, 
                middleIndex > -1 ? middleIndex : htmlContent.length
            )).map(cleanupNote) : [],
            middle: middleIndex > -1 ? extractNotesFromText(htmlContent.slice(
                middleIndex + 13, 
                baseIndex > -1 ? baseIndex : htmlContent.length
            )).map(cleanupNote) : [],
            base: baseIndex > -1 ? extractNotesFromText(htmlContent.slice(
                baseIndex + 11
            )).map(cleanupNote) : []
        };
    }

    // Function to process notes and determine accords
    function processAccords(notes) {
        // Combine all notes
        const allNotes = [...notes.top, ...notes.middle, ...notes.base];
        
        // Track accord frequencies
        const accordCounts = {};
        
        // Process each note
        allNotes.forEach(note => {
            const noteAccords = noteToAccordMapping[note.toLowerCase()] || [];
            noteAccords.forEach(accord => {
                accordCounts[accord] = (accordCounts[accord] || 0) + 1;
            });
        });

        // Convert to array and sort by frequency
        const accords = Object.entries(accordCounts)
            .map(([name, count]) => ({
                name,
                percentage: Math.min(100, Math.round((count / allNotes.length) * 100 + Math.random() * 20))
            }))
            .sort((a, b) => b.percentage - a.percentage);

        return accords;
    }

    // Function to create accord element
    function createAccordElement(accord) {
        const accordDiv = document.createElement('div');
        accordDiv.className = 'accord-bar';
        
        const content = document.createElement('div');
        content.className = 'accord-content';
        content.textContent = accord.name;
        content.style.width = `${accord.percentage}%`;
        content.style.backgroundColor = accordColors[accord.name] || '#gray';
        
        accordDiv.appendChild(content);
        return accordDiv;
    }

    // Function to create accords section
    function createAccordsVisualization(accords) {
        const container = document.createElement('div');
        container.className = 'accords-container';

        const title = document.createElement('div');
        title.className = 'accords-title';
        title.textContent = 'Main Accords';
        container.appendChild(title);

        accords.forEach(accord => {
            container.appendChild(createAccordElement(accord));
        });

        return container;
    }

    function createNoteElement(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'note-icon';
        
        const img = document.createElement('img');
        const noteKey = note.toLowerCase();
        img.src = noteIcons[noteKey] || noteIcons.default;
        img.alt = note;
        img.loading = 'lazy';
        
        iconContainer.appendChild(img);
        
        const name = document.createElement('div');
        name.className = 'note-name';
        name.textContent = decodeHTMLEntities(note).trim();
        
        noteDiv.appendChild(iconContainer);
        noteDiv.appendChild(name);
        return noteDiv;
    }

    function createVisualization(notes) {
        const container = document.createElement('div');
        container.className = 'fragrance-visualizer';

        const notesContainer = document.createElement('div');
        notesContainer.className = 'notes-container';

        const sections = [
            { type: 'top', title: 'Top Notes', notes: notes.top },
            { type: 'middle', title: 'Middle Notes', notes: notes.middle },
            { type: 'base', title: 'Base Notes', notes: notes.base }
        ];

        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = `note-section ${section.type}`;

            const titleDiv = document.createElement('div');
            titleDiv.className = 'section-title';
            titleDiv.textContent = section.title;
            sectionDiv.appendChild(titleDiv);

            const gridDiv = document.createElement('div');
            gridDiv.className = 'notes-grid';

            section.notes.forEach(note => {
                if (note.trim()) {
                    gridDiv.appendChild(createNoteElement(note));
                }
            });

            sectionDiv.appendChild(gridDiv);
            notesContainer.appendChild(sectionDiv);
        });

        // Process and add accords
        const accords = processAccords(notes);
        const accordsContainer = createAccordsVisualization(accords);

        container.appendChild(notesContainer);
        container.appendChild(accordsContainer);

        return container;
    }

    // Enhanced processFragranceNotes with retries
    function processFragranceNotes() {
        const heading = document.querySelector('h2[id="fragrance-notes"]');
        if (!heading) {
            console.log('Waiting for heading...');
            return false;
        }

        let block = heading.nextElementSibling;
        while (block && block.tagName !== 'BLOCKQUOTE') {
            block = block.nextElementSibling;
        }
        
        if (!block) {
            console.log('Waiting for blockquote...');
            return false;
        }

        // Check if content is actually loaded
        if (!block.innerHTML.includes('Notes:')) {
            console.log('Waiting for content...');
            return false;
        }

        // Check if visualizer already exists
        if (document.querySelector('.notes-and-accords')) {
            return true;
        }

        const notes = extractFragranceNotes(block.innerHTML);
        if (!notes) {
            console.log('Waiting for notes...');
            return false;
        }

        const container = document.createElement('div');
        container.className = 'notes-and-accords';
        container.appendChild(createVisualization(notes));

        heading.parentNode.insertBefore(container, heading);
        return true;
    }

    // Cleanup function to remove existing visualizations
    function cleanup() {
        const existingVisualizations = document.querySelectorAll('.notes-and-accords');
        existingVisualizations.forEach(vis => vis.remove());
    }

    // Initialize with retries and observers
    function initialize() {
        // Add stylesheet if not already present
        if (!document.querySelector('style#fragrance-visualizer-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'fragrance-visualizer-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        // Clean up any existing visualizations
        cleanup();

        // Set up mutation observer to watch for content changes
        const observer = new MutationObserver((mutations, obs) => {
            const success = processFragranceNotes();
            if (success) {
                console.log('Visualization created successfully');
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial attempt
        if (!processFragranceNotes()) {
            // If initial attempt fails, try again after a short delay
            setTimeout(() => {
                if (!processFragranceNotes()) {
                    console.log('Initial attempts completed, waiting for content changes...');
                }
            }, 1000);
        }

        return observer;
    }

    // Handle route changes
    let currentObserver = null;

    function handleRouteChange() {
        // Disconnect existing observer
        if (currentObserver) {
            currentObserver.disconnect();
        }
        // Initialize new observer
        currentObserver = initialize();
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            currentObserver = initialize();
        });
    } else {
        currentObserver = initialize();
    }

    // Handle client-side navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleRouteChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleRouteChange();
    };
})();