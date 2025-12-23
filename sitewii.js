// Wii Games Data
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
let totalUsbSize = 16; // GB

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayGames(games);
    setupEventListeners();
    setupFormListener();
    setupStorageListener();
    updateStorageDisplay();
});

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

// Toggle game selection
function toggleGameSelection(gameId, cardElement) {
    const game = games.find(g => g.id === gameId);
    
    if (selectedGames.has(gameId)) {
        selectedGames.delete(gameId);
        cardElement.classList.remove('selected');
        updateStorageDisplay();
    } else {
        // Check if there's enough space
        const currentUsed = calculateUsedStorage();
        if (currentUsed + game.size <= totalUsbSize) {
            selectedGames.add(gameId);
            cardElement.classList.add('selected');
            updateStorageDisplay();
        } else {
            alert(`Espaço insuficiente! Este jogo precisa de ${game.size} GB, mas você só tem ${(totalUsbSize - currentUsed).toFixed(1)} GB disponível.`);
        }
    }
}

// Get category name in Portuguese
function getCategoryName(category) {
    const categories = {
        'action': 'Ação',
        'sports': 'Esportes',
        'adventure': 'Aventura',
        'racing': 'Corrida'
    };
    return categories[category] || category;
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    searchInput.addEventListener('input', filterGames);
    categoryFilter.addEventListener('change', filterGames);
}

// Setup form listener
function setupFormListener() {
    const form = document.getElementById('userForm');
    const message = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const usbSize = document.getElementById('usbSize').value;

        // Validate all required fields
        if (!name) {
            message.textContent = 'Por favor, preencha seu nome.';
            message.className = 'form-message error';
            return;
        }

        if (!email) {
            message.textContent = 'Por favor, preencha seu e-mail.';
            message.className = 'form-message error';
            return;
        }

        if (!usbSize) {
            message.textContent = 'Por favor, selecione o tamanho do pen drive.';
            message.className = 'form-message error';
            return;
        }

        if (selectedGames.size === 0) {
            message.textContent = 'Por favor, selecione pelo menos um jogo.';
            message.className = 'form-message error';
            return;
        }

        // Monta lista de jogos selecionados
        const selectedGamesList = [];
        selectedGames.forEach(gameId => {
            const game = games.find(g => g.id === gameId);
            if (game) {
                selectedGamesList.push({
                    id: game.id,
                    title: game.title,
                    category: getCategoryName(game.category),
                    size: game.size,
                    rating: game.rating,
                    description: game.description
                });
            }
        });

        // Envia para o backend
        try {
            const response = await fetch('http://localhost:5000/api/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: name,
                    email: email,
                    pendrive: usbSize,
                    jogos: selectedGamesList
                })
            });

            if (response.ok) {
                const data = await response.json();
                message.textContent = `Obrigado, ${name}! Seu pedido foi salvo como ${data.filename}.`;
                message.className = 'form-message success';
            } else {
                const err = await response.json();
                message.textContent = err.error || 'Erro ao salvar pedido no servidor.';
                message.className = 'form-message error';
                return;
            }
        } catch (error) {
            message.textContent = 'Erro de conexão com o servidor.';
            message.className = 'form-message error';
            return;
        }

        // Limpa formulário após 5 segundos
        setTimeout(() => {
            form.reset();
            message.style.display = 'none';
            selectedGames.clear();
            displayGames(games);
            updateStorageDisplay();
        }, 5000);
    });
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

    // Filter by search term
    if (searchTerm) {
        filteredGames = filteredGames.filter(game =>
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm)
        );
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