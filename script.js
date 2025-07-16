const profilesKey = 'packProfiles';
const fkey = 'tofItems';
const profileSelect = document.getElementById('profileSelect');
const itemsContainer = document.getElementById('itemsContainer');
const addItemBtn = document.getElementById('addItem');
const addProfileBtn = document.getElementById('addProfile');
const resetBtn = document.getElementById('resetProfile');
const currentProfileLabel = document.getElementById('currentProfile');

let profiles = JSON.parse(localStorage.getItem(profilesKey)) || {};
let tofItems = JSON.parse(localStorage.getItem(fkey)) || {};
let currentProfile = Object.keys(profiles)[0] || 'Weekend';

// Save all profiles
function saveProfiles() {
    localStorage.setItem(profilesKey, JSON.stringify(profiles));
}

// Save items left unchecked
function saveLeftItems() {
    localStorage.setItem(fkey, JSON.stringify(tofItems));
}

// Update current profile label
function updateCurrentProfileLabel() {
    currentProfileLabel.textContent = `Profile: ${currentProfile}`;
}

// Render the profile dropdown
function renderProfiles() {
    profileSelect.innerHTML = '';
    Object.keys(profiles).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        profileSelect.appendChild(opt);
    });
    profileSelect.value = currentProfile;
}

// Render items for the current profile
function renderItems() {
    itemsContainer.innerHTML = '';
    const items = profiles[currentProfile] || [];

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        if (tofItems[currentProfile]?.includes(item.text)) {
            div.classList.add('left');
        }

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.onchange = () => {
            item.checked = checkbox.checked;
            saveProfiles();
        };

        const span = document.createElement('span');
        span.textContent = item.text;
        label.appendChild(checkbox);
        label.appendChild(span);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => {
            profiles[currentProfile].splice(index, 1);
            saveProfiles();
            renderItems();
        };

        div.appendChild(label);
        div.appendChild(removeBtn);
        itemsContainer.appendChild(div);
    });
}

// Handle profile selection
profileSelect.onchange = () => {
    currentProfile = profileSelect.value;
    renderItems();
    updateCurrentProfileLabel();
};

// Add new item
addItemBtn.onclick = () => {
    const itemText = prompt('Enter item');
    if (!itemText) return;
    profiles[currentProfile] = profiles[currentProfile] || [];
    profiles[currentProfile].push({ text: itemText, checked: false });
    saveProfiles();
    renderItems();
};

// Add new profile
addProfileBtn.onclick = () => {
    const name = prompt('Enter Profile Name');
    if (!name || profiles[name]) return;
    profiles[name] = [];
    currentProfile = name;
    saveProfiles();
    renderProfiles();
    renderItems();
    updateCurrentProfileLabel();
};

// Reset all data
resetBtn.onclick = () => {
    const confirmReset = confirm('Are you sure you want to reset all profiles and items?');
    if (confirmReset) {
        profiles = {};
        tofItems = {};
        currentProfile = 'Weekend';
        profiles[currentProfile] = [];
        saveProfiles();
        saveLeftItems();
        renderProfiles();
        renderItems();
        updateCurrentProfileLabel();
    }
};

// Save remaining items before unloading
window.addEventListener('beforeunload', () => {
    const items = profiles[currentProfile];
    tofItems[currentProfile] = items.filter(i => !i.checked).map(i => i.text);
    saveLeftItems();
});

// Initialize if missing
if (!profiles[currentProfile]) profiles[currentProfile] = [];

renderProfiles();
renderItems();
updateCurrentProfileLabel();