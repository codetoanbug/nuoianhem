// Game State
let gameState = {
    hunger: 100,
    money: 1000,
    happiness: 50
};

// DOM Elements
const hungerBar = document.getElementById('hungerBar');
const hungerText = document.getElementById('hungerText');
const moneyDisplay = document.getElementById('money');
const happinessDisplay = document.getElementById('happiness');
const speechBubble = document.getElementById('speechBubble');
const character = document.getElementById('character');
const mouth = document.getElementById('mouth');
const notifications = document.getElementById('notifications');

// Funny Messages
const messages = {
    hungry: [
        "Đói quá... cho ăn đi anh em ơi! 🥺",
        "Bụng kêu ọc ọc rồi! 😭",
        "Anh em đâu rồi? Em đói lắm! 🍚",
        "Sao không cho em ăn vậy? 😢",
        "Em muốn ăn... bất cứ thứ gì! 🤤",
        "Đói đến mức muốn ăn cả màn hình luôn! 😤",
        "Nhìn cái menu mà nuốt nước bọt! 🤤"
    ],
    satisfied: [
        "Ơ, có vẻ ổn rồi đó! 😊",
        "Cảm ơn anh em nhé! 😁",
        "Ngon quá đi mất! 😋",
        "Hơi no rồi nè! 🙂",
        "Vẫn còn ăn được nữa! 😄"
    ],
    full: [
        "No căng bụng luôn! 🤰",
        "Ăn no rồi, nghỉ tý! 😴",
        "Sướng quá đi mất! 🥰",
        "Cảm ơn anh em đã nuôi! ❤️",
        "No nê rồi, có thể chiến game! 🎮",
        "배불러! (Bụng no quá!) 😂"
    ],
    veryHungry: [
        "ĐÓIIIIII! CHO ĂN ĐI! 😭😭😭",
        "Sắp chết đói rồi anh em ơi! ☠️",
        "Cứu em với! Đói lắm rồi! 🆘",
        "Em sắp ngất đói mất! 😵",
        "Nhanh lên đi! Bụng em kêu ầm ầm! 🔊"
    ],
    noMoney: [
        "Hết tiền rồi! Đi làm thêm đi! 💸",
        "Nghèo quá! Phải kiếm tiền thôi! 😢",
        "Ví trống rỗng! Lương đâu? 💰",
        "Làm việc đi anh em! Hết tiền rồi! 😭"
    ],
    afterEating: [
        "Ngon lành cành đào! 😋",
        "Cảm ơn meal! 🙏",
        "Đã đời! 🤩",
        "Trời ơi, ngon quá! 😍",
        "5 sao cho món này! ⭐⭐⭐⭐⭐"
    ]
};

// Initialize Game
function init() {
    updateUI();
    startHungerTimer();
}

// Update UI
function updateUI() {
    // Update hunger bar
    hungerBar.style.width = gameState.hunger + '%';
    hungerText.textContent = gameState.hunger + '%';

    // Update money
    moneyDisplay.textContent = gameState.money + 'đ';

    // Update happiness emoji
    if (gameState.hunger < 20) {
        happinessDisplay.textContent = '😭';
        mouth.className = 'mouth sad';
    } else if (gameState.hunger < 50) {
        happinessDisplay.textContent = '😟';
        mouth.className = 'mouth';
    } else if (gameState.hunger < 80) {
        happinessDisplay.textContent = '😊';
        mouth.className = 'mouth';
    } else {
        happinessDisplay.textContent = '🤩';
        mouth.className = 'mouth happy';
    }

    // Update speech bubble
    updateSpeechBubble();
}

// Update Speech Bubble
function updateSpeechBubble() {
    let messageArray;

    if (gameState.hunger < 15) {
        messageArray = messages.veryHungry;
    } else if (gameState.hunger < 40) {
        messageArray = messages.hungry;
    } else if (gameState.hunger < 80) {
        messageArray = messages.satisfied;
    } else {
        messageArray = messages.full;
    }

    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    speechBubble.textContent = randomMessage;
}

// Hunger Timer
function startHungerTimer() {
    setInterval(() => {
        if (gameState.hunger > 0) {
            gameState.hunger = Math.max(0, gameState.hunger - 1);
            updateUI();

            // Warning notification when very hungry
            if (gameState.hunger === 10) {
                showNotification('⚠️ Anh em sắp chết đói rồi!', 'error');
            }
        } else {
            showNotification('💀 Game Over! Anh em đói chết rồi!', 'error');
        }
    }, 3000); // Decrease hunger every 3 seconds
}

// Feed Character
function feedCharacter(foodName, price, hungerRestore) {
    if (gameState.money < price) {
        showNotification('❌ Không đủ tiền! Đi làm thêm đi!', 'error');
        const randomMessage = messages.noMoney[Math.floor(Math.random() * messages.noMoney.length)];
        speechBubble.textContent = randomMessage;
        return;
    }

    // Deduct money and restore hunger
    gameState.money -= price;
    gameState.hunger = Math.min(100, gameState.hunger + hungerRestore);

    // Play eating animation
    character.classList.add('eating');
    setTimeout(() => {
        character.classList.remove('eating');
    }, 1500);

    // Show notification
    const randomAfterEating = messages.afterEating[Math.floor(Math.random() * messages.afterEating.length)];
    showNotification(`🍴 Đã ăn ${foodName}! ${randomAfterEating}`, 'success');

    // Update speech bubble with random message
    setTimeout(() => {
        const messageArray = gameState.hunger > 80 ? messages.full : messages.satisfied;
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
        speechBubble.textContent = randomMessage;
    }, 1000);

    updateUI();
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notifications.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notifications.removeChild(notification);
        }, 300);
    }, 3000);
}

// Earn Money
function earnMoney() {
    const earnings = Math.floor(Math.random() * 100) + 50;
    gameState.money += earnings;

    const funnyEarnMessages = [
        `💰 Kiếm được ${earnings}đ! Giàu vcl! 💸`,
        `🤑 +${earnings}đ! Streamer à? 🎮`,
        `💵 Nhận ${earnings}đ! Đi làm thêm giỏi đấy! 💪`,
        `💴 Lương ${earnings}đ đây! Mua đồ ăn đi! 🍕`,
        `💷 Được ${earnings}đ! Sugar daddy đó à? 😏`
    ];

    const randomEarnMessage = funnyEarnMessages[Math.floor(Math.random() * funnyEarnMessages.length)];
    showNotification(randomEarnMessage, 'success');

    speechBubble.textContent = "Wow! Giàu rồi! Mua đồ ăn cho em đi! 🤩";

    updateUI();
}

// Reset Game
function resetGame() {
    if (confirm('Chơi lại từ đầu? Tất cả tiến trình sẽ mất! 🔄')) {
        gameState = {
            hunger: 100,
            money: 1000,
            happiness: 50
        };
        updateUI();
        showNotification('🎮 Đã reset game! Chơi lại nào!', 'success');
        speechBubble.textContent = 'Xin chào! Nuôi em đi anh em ơi! 😊';
    }
}

// Event Listeners
document.querySelectorAll('.food-item').forEach(button => {
    button.addEventListener('click', (e) => {
        const foodName = button.dataset.food;
        const price = parseInt(button.dataset.price);
        const hungerRestore = parseInt(button.dataset.hunger);

        feedCharacter(foodName, price, hungerRestore);
    });
});

document.getElementById('earnMoney').addEventListener('click', earnMoney);
document.getElementById('resetGame').addEventListener('click', resetGame);

// Easter Eggs
let clickCount = 0;
character.addEventListener('click', () => {
    clickCount++;

    const easterEggMessages = [
        "Đừng bấm vào mặt em! 😤",
        "Gì zậy trời? 🤨",
        "Ngứa à? 😏",
        "Đừng có bấm nữa! 😠",
        "Anh em thích chọc em à? 🙄",
        "Đau đó nha! 😭",
        "Chơi khăm à? 😤"
    ];

    if (clickCount % 3 === 0) {
        const randomEgg = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
        speechBubble.textContent = randomEgg;
    }
});

// Konami Code Easter Egg (↑↑↓↓←→←→BA)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        gameState.money += 9999;
        updateUI();
        showNotification('🎮 CHEAT CODE ACTIVATED! +9999đ! You are a legend! 🏆', 'success');
        speechBubble.textContent = 'Hack à? Được đó, giờ mua hết đồ ăn đi! 😎';
    }
});

// Random funny messages every 30 seconds
setInterval(() => {
    if (Math.random() > 0.7) {
        const allMessages = [...messages.hungry, ...messages.satisfied, ...messages.full];
        const randomMsg = allMessages[Math.floor(Math.random() * allMessages.length)];
        speechBubble.textContent = randomMsg;
    }
}, 30000);

// Initialize the game
init();

// Welcome message
setTimeout(() => {
    showNotification('🎮 Chào mừng đến với Nuôi Anh Em! Đừng để anh em đói nhé! 😊', 'success');
}, 500);
