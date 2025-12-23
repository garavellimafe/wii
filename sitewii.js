// Retorna o nome da categoria em português
function getCategoryName(category) {
    const categories = {
        'action': 'Ação',
        'sports': 'Esportes',
        'adventure': 'Aventura',
        'racing': 'Corrida'
    };
    return categories[category] || category;
}
// Barra de letras do alfabeto
let selectedLetter = null;

function renderAlphabetBar() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const bar = document.getElementById('alphabetBar');
    bar.innerHTML = '';
    alphabet.forEach(letter => {
        const btn = document.createElement('span');
        btn.className = 'alphabet-letter' + (selectedLetter === letter ? ' selected' : '');
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.addEventListener('click', () => {
            if (selectedLetter === letter) {
                selectedLetter = null;
            } else {
                selectedLetter = letter;
            }
            renderAlphabetBar();
            filterGames();
        });
        bar.appendChild(btn);
    });
}

// Lista de jogos
const games = [
    {
        id: 1,
        title: "Wii Sports",
        category: "sports",
        description: "Coletânea de cinco esportes simulados: tênis, beisebol, boliche, golfe e boxe.",
        rating: "9.0",
        size: 0.4,
        image: "img/wiisports.avif"
    },
    {
        id: 2,
        title: "Super Mario Galaxy",
        category: "adventure",
        description: "Mario viaja pelo espaço para resgatar a Princesa Peach do malvado Bowser.",
        rating: "9.7",
        size: 3.3,
        image: "img/spmg1.avif"
    },
    {
        id: 3,
        title: "Mario Kart Wii",
        category: "racing",
        description: "Corridas emocionantes com personagens da Nintendo em pistas criativas.",
        rating: "9.2",
        size: 2.6,
        image: "img/mk.avif"
    },
    {
        id: 4,
        title: "The Legend of Zelda: Twilight Princess",
        category: "adventure",
        description: "Link deve salvar Hyrule mergulhada em um crepúsculo maligno.",
        rating: "9.5",
        size: 1.1,
        image: "img/zeldatwilight.avif"
    },
    {
        id: 5,
        title: "Super Smash Bros. Brawl",
        category: "action",
        description: "Luta multiplayer com personagens icônicos da Nintendo e convidados especiais.",
        rating: "9.3",
        size: 6.8,
        image: "img/ssb.avif"
    },
    {
        id: 6,
        title: "Wii Sports Resort",
        category: "sports",
        description: "Sequência de Wii Sports com 12 novos esportes na ilha Wuhu.",
        rating: "8.8",
        size: 0.7,
        image: "img/wiisportsresort.avif"
    },
    {
        id: 7,
        title: "New Super Mario Bros. Wii",
        category: "adventure",
        description: "Aventura clássica 2D de Mario com modo cooperativo para 4 jogadores.",
        rating: "8.9",
        size: 0.4,
        image: "img/newssb.avif"
    },
    {
        id: 8,
        title: "Donkey Kong Country Returns",
        category: "adventure",
        description: "Donkey Kong e Diddy Kong em uma jornada de plataforma desafiadora.",
        rating: "8.7",
        size: 3.4,
        image: "img/dkcountryreturns.avif"
    },
    {
        id: 9,
        title: "Metroid Prime 3: Corruption",
        category: "action",
        description: "Samus Aran enfrenta uma corrupção espacial em FPS de ação.",
        rating: "9.0",
        size: 4.2,
        image: "img/metroidprime3.avif"
    },
    {
        id: 10,
        title: "Mario Party 8",
        category: "action",
        description: "Jogos de festa com mini-jogos divertidos para toda a família.",
        rating: "7.5",
        size: 1.4,
        image: "img/marioparty8.avif"
    },
    {
        id: 11,
        title: "Wii Fit",
        category: "sports",
        description: "Exercícios físicos e yoga com a Wii Balance Board.",
        rating: "8.0",
        size: 0.9,
        image: "img/wiifit.avif"
    },
    {
        id: 12,
        title: "Sonic Colors",
        category: "racing",
        description: "Sonic em alta velocidade para salvar alienígenas coloridos.",
        rating: "8.5",
        size: 4.2,
        image: "img/soniccolors.avif"
    }
];

let selectedGames = new Set();
let totalUsbSize = 16; // GB;
let isAlphaSorted = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderAlphabetBar();
    displayGames(games);
    setupEventListeners();
    setupFormListener();
    setupStorageListener();
    updateStorageDisplay();
});

// Adiciona listeners para busca, filtro e ordenação
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortAlphaBtn = document.getElementById('sortAlphaBtn');

    if (searchInput) searchInput.addEventListener('input', filterGames);
    if (categoryFilter) categoryFilter.addEventListener('change', filterGames);
    if (sortAlphaBtn) sortAlphaBtn.addEventListener('click', () => {
        isAlphaSorted = !isAlphaSorted;
        sortAlphaBtn.textContent = isAlphaSorted ? 'Ordenar Original' : 'Ordenar A-Z';
        filterGames();
    });
}

// Adiciona listener para o formulário de pedido
function setupFormListener() {
    const form = document.getElementById('userForm');
    const message = document.getElementById('formMessage');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const usbSize = document.getElementById('usbSize').value;
        if (!name || !email || !usbSize) {
            message.textContent = 'Preencha todos os campos obrigatórios.';
            message.className = 'form-message error';
            return;
        }
        if (selectedGames.size === 0) {
            message.textContent = 'Selecione pelo menos um jogo.';
            message.className = 'form-message error';
            return;
        }
        generateOrderFile(name, email, usbSize);
        message.textContent = `Pedido gerado para ${name}!`;
        message.className = 'form-message success';
        setTimeout(() => {
            form.reset();
            message.textContent = '';
            selectedGames.clear();
            displayGames(games);
            updateStorageDisplay();
        }, 5000);
    });
}

// Display games
function displayGames(gamesToDisplay) {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = '';

    gamesToDisplay.forEach(game => {
        const gameCard = createGameCard(game);
        container.appendChild(gameCard);
    });
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;
    
    if (selectedGames.has(game.id)) {
        card.classList.add('selected');
    }

    card.innerHTML = `
        ${game.image ? `<img src="${game.image}" alt="${game.title}" class="game-image">` : ''}
        <h3>${game.title}</h3>
        <span class="category">${getCategoryName(game.category)}</span>
        <p class="description">${game.description}</p>
        <div class="rating">⭐ ${game.rating}/10</div>
        <div class="game-size">💾 ${game.size} GB</div>
    `;

    card.addEventListener('click', () => toggleGameSelection(game.id, card));

    return card;
}

// Generate order file
function generateOrderFile(name, email, usbSize) {
    const usedStorage = calculateUsedStorage();
    const selectedGamesList = [];
    
    selectedGames.forEach(gameId => {
        const game = games.find(g => g.id === gameId);
        if (game) {
            selectedGamesList.push(game);
        }
    });

    // Sort games by name
    selectedGamesList.sort((a, b) => a.title.localeCompare(b.title));

    // Create file content
    let content = '═══════════════════════════════════════════════════════════\n';
    content += '            PEDIDO DE JOGOS WII\n';
    content += '═══════════════════════════════════════════════════════════\n\n';
    content += `Data: ${new Date().toLocaleString('pt-BR')}\n\n`;
    content += '───────────────────────────────────────────────────────────\n';
    content += '  DADOS DO CLIENTE\n';
    content += '───────────────────────────────────────────────────────────\n\n';
    content += `Nome:     ${name}\n`;
    content += `E-mail:   ${email}\n\n`;
    content += '───────────────────────────────────────────────────────────\n';
    content += '  INFORMAÇÕES DO PEN DRIVE\n';
    content += '───────────────────────────────────────────────────────────\n\n';
    content += `Tamanho Total:      ${usbSize} GB\n`;
    content += `Espaço Utilizado:   ${usedStorage.toFixed(1)} GB\n`;
    content += `Espaço Disponível:  ${(usbSize - usedStorage).toFixed(1)} GB\n`;
    content += `Percentual Usado:   ${((usedStorage / usbSize) * 100).toFixed(1)}%\n\n`;
    content += '───────────────────────────────────────────────────────────\n';
    content += `  JOGOS SELECIONADOS (${selectedGamesList.length})\n`;
    content += '───────────────────────────────────────────────────────────\n\n';
    
    selectedGamesList.forEach((game, index) => {
        content += `${index + 1}. ${game.title}\n`;
        content += `   Categoria: ${getCategoryName(game.category)}\n`;
        content += `   Tamanho:   ${game.size} GB\n`;
        content += `   Avaliação: ${game.rating}/10\n`;
        content += `   ${game.description}\n\n`;
    });
    
    content += '═══════════════════════════════════════════════════════════\n';
    content += `TOTAL: ${selectedGamesList.length} jogos | ${usedStorage.toFixed(1)} GB\n`;
    content += '═══════════════════════════════════════════════════════════\n';

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido_wii_${name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Filter games based on search and category
function filterGames() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let filteredGames = games;

    // Filter by category
    if (category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === category);
    }

    // Filter by alphabet letter
    if (selectedLetter) {
        filteredGames = filteredGames.filter(game => game.title[0].toUpperCase() === selectedLetter);
    }

    // Filter by search term
    if (searchTerm) {
        filteredGames = filteredGames.filter(game =>
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm)
        );
    }

    // Sort alphabetically if enabled
    if (isAlphaSorted) {
        filteredGames = filteredGames.slice().sort((a, b) => a.title.localeCompare(b.title));
    }

    displayGames(filteredGames);
}

// Setup storage listener
function setupStorageListener() {
    const usbSelector = document.getElementById('usbSize');
    usbSelector.addEventListener('change', (e) => {
        const newSize = parseFloat(e.target.value);
        const currentUsed = calculateUsedStorage();
        
        if (currentUsed > newSize) {
            alert(`Você já tem ${currentUsed.toFixed(1)} GB de jogos selecionados. Escolha um pen drive maior ou remova alguns jogos.`);
            e.target.value = totalUsbSize;
        } else {
            totalUsbSize = newSize;
            updateStorageDisplay();
        }
    });
}

// Calculate used storage
function calculateUsedStorage() {
    let total = 0;
    selectedGames.forEach(gameId => {
        const game = games.find(g => g.id === gameId);
        if (game) {
            total += game.size;
        }
    });
    return total;
}

// Update storage display
function updateStorageDisplay() {
    const usedStorage = calculateUsedStorage();
    const remainingStorage = totalUsbSize - usedStorage;
    const percentage = (usedStorage / totalUsbSize) * 100;

    document.getElementById('usedStorage').textContent = usedStorage.toFixed(1);
    document.getElementById('totalStorage').textContent = totalUsbSize;
    document.getElementById('remainingStorage').textContent = remainingStorage.toFixed(1);

    const storageFill = document.getElementById('storageFill');
    storageFill.style.width = percentage + '%';

    // Update colors based on usage
    const remainingText = document.querySelector('.storage-remaining');
    storageFill.classList.remove('warning', 'danger');
    remainingText.classList.remove('warning', 'danger');

    if (percentage >= 90) {
        storageFill.classList.add('danger');
        remainingText.classList.add('danger');
    } else if (percentage >= 70) {
        storageFill.classList.add('warning');
        remainingText.classList.add('warning');
    }
}
// ...fim do arquivo
