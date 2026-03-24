document.addEventListener('DOMContentLoaded', () => {
    // Create floating decorations in the background
    const container = document.getElementById('decorations');
    const emojis = ['🌸', '✨', '🐾', '🎀', '💖', '⭐', '☁️', '🌈'];
    const numDecorations = 30;

    for (let i = 0; i < numDecorations; i++) {
        createDecoration(emojis[Math.floor(Math.random() * emojis.length)]);
    }

    function createDecoration(emoji) {
        const el = document.createElement('div');
        el.className = 'decoration';
        el.innerText = emoji;
        
        // Random starting position
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = Math.random() * 100 + 'vh';
        
        // Random sizes
        const size = Math.random() * 1.5 + 1;
        el.style.fontSize = size + 'rem';
        el.style.opacity = Math.random() * 0.4 + 0.1;

        if (container) {
            container.appendChild(el);
            animateDecoration(el);
        }
    }

    function animateDecoration(el) {
        const duration = Math.random() * 10000 + 10000; // 10-20s
        const xOffset = (Math.random() - 0.5) * 200;
        const yOffset = (Math.random() - 0.5) * 200;

        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${xOffset}px, ${yOffset}px) rotate(${Math.random() * 360}deg)` },
            { transform: 'translate(0, 0) rotate(0deg)' }
        ], {
            duration: duration,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    }

    // --- Dynamic Content Loading --- //

    // 1. Load Staff from Google Sheet (Published to Web as CSV)
    // Replace this URL with your actual Google Sheet CSV URL
    const STAFF_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_placeholder_url_here/pub?output=csv';
    
    async function loadStaff() {
        try {
            // For demonstration, we'll simulate the data if the URL is a placeholder
            let data = [];
            if (STAFF_CSV_URL.includes('placeholder_url_here')) {
                data = [
                    { name: 'Owner Name', role: 'Server Owner', avatar: 'https://cdn.discordapp.com/embed/avatars/0.png', bio: 'Founder of Femboy Hangout. I love ensuring everyone has a safe and cute place to hang out!' },
                    { name: 'Head Admin Name', role: 'Head Admin', avatar: 'https://cdn.discordapp.com/embed/avatars/1.png', bio: 'Oversees the staff team and manages events. Always here to help if you have any serious issues.' },
                    { name: 'Admin Name', role: 'Admin', avatar: 'https://cdn.discordapp.com/embed/avatars/2.png', bio: 'Keeps the chat clean and friendly. Feel free to ping me if you need immediate assistance.' },
                    { name: 'Senior Mod Name', role: 'Senior Moderator', avatar: 'https://cdn.discordapp.com/embed/avatars/3.png', bio: 'Helps out with daily moderation and guiding new members around the server.' },
                    { name: 'Mod Name', role: 'Moderator', avatar: 'https://cdn.discordapp.com/embed/avatars/4.png', bio: 'Friendly neighborhood mod! I love chatting in general and playing games with the community.' }
                ];
            } else {
                const response = await fetch(STAFF_CSV_URL);
                if (!response.ok) throw new Error('Failed to fetch staff data');
                const csvText = await response.text();
                
                // Very simple CSV parser (Assumes format: Name,Role,AvatarURL,Bio)
                const rows = csvText.split('\n').slice(1); // Skip header row
                data = rows.filter(row => row.trim() !== '').map(row => {
                    // Match commas not inside quotes (simple regex for CSV)
                    const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
                    const cleanCol = (col) => col ? col.replace(/^"|"$/g, '').trim() : '';
                    
                    return {
                        name: cleanCol(cols[0]) || 'Unknown',
                        role: cleanCol(cols[1]) || 'Staff',
                        avatar: cleanCol(cols[2]) || 'https://cdn.discordapp.com/embed/avatars/0.png',
                        bio: cleanCol(cols[3]) || 'A wonderful member of our staff team.'
                    };
                });
            }

            const container = document.getElementById('staff-container');
            const loading = document.getElementById('staff-loading');

            container.innerHTML = ''; // Clear container
            
            // Group staff by their role
            const groupedStaff = {};
            // Keep track of the order of roles as they appear in the CSV
            const roleOrder = []; 
            
            data.forEach(member => {
                if (!groupedStaff[member.role]) {
                    groupedStaff[member.role] = [];
                    roleOrder.push(member.role);
                }
                groupedStaff[member.role].push(member);
            });

            roleOrder.forEach((role, index) => {
                // Determine if this folder should be open initially (let's say the first one is)
                const isOpen = index === 0;

                // Create Folder Container
                const folder = document.createElement('div');
                folder.className = 'folder-container';
                
                // Create Folder Header
                const folderHeader = document.createElement('div');
                folderHeader.className = `folder-header ${isOpen ? 'open' : ''}`;
                folderHeader.innerHTML = `
                    <span><i class="fas fa-folder-open" style="margin-right: 0.8rem;"></i> ${role}s</span>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                `;

                // Create Folder Content
                const folderContent = document.createElement('div');
                folderContent.className = `folder-content ${isOpen ? 'open' : ''}`;

                // Toggle functionality
                folderHeader.addEventListener('click', () => {
                    folderHeader.classList.toggle('open');
                    folderContent.classList.toggle('open');
                });

                // Add all staff members under this role to the folder content
                groupedStaff[role].forEach(member => {
                    const card = document.createElement('div');
                    card.className = 'staff-card';
                    card.innerHTML = `
                        <img src="${member.avatar}" alt="${member.name}" class="staff-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                        <div class="staff-info">
                            <h3 class="staff-name">${member.name}</h3>
                            <p class="staff-role">${member.role}</p>
                            <p class="staff-bio">${member.bio}</p>
                        </div>
                    `;
                    folderContent.appendChild(card);
                });

                folder.appendChild(folderHeader);
                folder.appendChild(folderContent);
                container.appendChild(folder);
            });

            loading.style.display = 'none';
            container.style.display = 'flex'; // Use flex since we changed it to flex-direction column
            
        } catch (error) {
            console.error('Error loading staff:', error);
            document.getElementById('staff-loading').innerText = 'Failed to load staff list.';
        }
    }

    // 2. Load Rules from a Markdown file (e.g. GitHub raw URL)
    // Replace these URLs with your raw markdown file URLs
    const DISCORD_RULES_URL = 'https://raw.githubusercontent.com/placeholder/rules/main/discord-rules.md';
    const MC_RULES_URL = 'https://raw.githubusercontent.com/placeholder/rules/main/mc-rules.md';

    let currentRules = 'discord';

    window.switchRules = function(type) {
        currentRules = type;
        
        // Update button styles
        document.getElementById('btn-discord-rules').style.opacity = type === 'discord' ? '1' : '0.6';
        document.getElementById('btn-mc-rules').style.opacity = type === 'minecraft' ? '1' : '0.6';
        
        loadRules();
    };

    async function loadRules() {
        const container = document.getElementById('rules-container');
        const loading = document.getElementById('rules-loading');
        
        loading.style.display = 'block';
        container.style.display = 'none';

        try {
            let markdownText = '';
            const urlToFetch = currentRules === 'discord' ? DISCORD_RULES_URL : MC_RULES_URL;

            if (urlToFetch.includes('placeholder')) {
                if (currentRules === 'discord') {
                    markdownText = `
## 1. Respect Everyone 💖
Treat all members with kindness and respect. No harassment, hate speech, or discrimination.

## 2. Keep it SFW 🌸
This is a safe space! Absolutely no NSFW content, discussions, or suggestive profiles.

## 3. No Spamming 🛑
Please avoid spamming the chat and keep self-promotion to the designated channels.

*(Replace this placeholder by changing \`DISCORD_RULES_URL\` in \`index.js\`!)*`;
                } else {
                    markdownText = `
## 1. No Griefing or Stealing ⛏️
Respect other players' builds. Do not destroy or take items that don't belong to you.

## 2. No Hacked Clients 🚫
Using x-ray, fly hacks, or any unfair advantages will result in an immediate permanent ban.

## 3. Be Kind in Chat 💬
Keep global chat friendly and welcoming. No toxicity or extreme profanity.

*(Replace this placeholder by changing \`MC_RULES_URL\` in \`index.js\`!)*`;
                }
            } else {
                const response = await fetch(urlToFetch);
                if (!response.ok) throw new Error('Failed to fetch rules');
                markdownText = await response.text();
            }

            // Render Markdown using Marked.js (imported in HTML)
            container.innerHTML = marked.parse(markdownText);
            
            loading.style.display = 'none';
            container.style.display = 'block';

        } catch (error) {
            console.error('Error loading rules:', error);
            document.getElementById('rules-loading').innerText = 'Failed to load community rules.';
        }
    }

    // Initialize the dynamic fetching
    loadStaff();
    switchRules('discord'); // This also calls loadRules()
});
