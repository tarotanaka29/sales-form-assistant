// 2つのプロファイル管理
document.addEventListener('DOMContentLoaded', async () => {
  // 現在のプロファイルを読み込み
  await loadFormData();
  
  // プロファイル名を読み込み
  await loadProfileNames();
  
  // タブ切り替えイベント
  document.querySelectorAll('.profile-tab').forEach(tab => {
    const tabBtn = tab.querySelector('.tab-btn');
    if (tabBtn) {
      tabBtn.addEventListener('click', async (e) => {
        const profileNumber = parseInt(tab.getAttribute('data-profile'));
        
        // タブのアクティブ状態を切り替え
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // プロファイルを切り替え
        await Storage.setCurrentProfile(profileNumber);
        await loadFormData();
        
        // ラベル更新
        const profileName = await Storage.getProfileName(profileNumber);
        document.getElementById('current-profile-label').textContent = profileName;
        
        showMessage(`${profileName}に切り替えました`, 'success');
      });
    }
  });
  
  // プロファイル名編集ボタン
  document.querySelectorAll('.edit-name-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const profileNumber = parseInt(btn.getAttribute('data-profile'));
      const currentName = await Storage.getProfileName(profileNumber);
      
      const newName = prompt(`プロファイル${profileNumber}の名前を入力してください:`, currentName);
      if (newName && newName.trim()) {
        await Storage.setProfileName(profileNumber, newName.trim());
        document.getElementById(`profile-name-${profileNumber}`).textContent = newName.trim();
        
        // 現在のプロファイルの場合はラベルも更新
        const currentProfile = await Storage.getCurrentProfile();
        if (currentProfile === profileNumber) {
          document.getElementById('current-profile-label').textContent = newName.trim();
        }
        
        showMessage('プロファイル名を変更しました', 'success');
      }
    });
  });
  
  // フォーム送信イベント
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveFormData();
  });
  
  // リセットボタン
  document.getElementById('reset-btn').addEventListener('click', async () => {
    const currentProfile = await Storage.getCurrentProfile();
    const profileName = await Storage.getProfileName(currentProfile);
    if (confirm(`${profileName}をリセットしますか?`)) {
      await Storage.reset();
      await loadFormData();
      showMessage(`${profileName}をリセットしました`, 'success');
    }
  });
  
  // 文字数カウンター
  setupCharacterCounter('message300', 300);
  setupCharacterCounter('message800', 800);
});

// プロファイル名を読み込み
async function loadProfileNames() {
  for (let i = 1; i <= 2; i++) {
    const profileName = await Storage.getProfileName(i);
    const nameElement = document.getElementById(`profile-name-${i}`);
    if (nameElement) {
      nameElement.textContent = profileName;
    }
  }
}

// フォームデータの読み込み
async function loadFormData() {
  const currentProfile = await Storage.getCurrentProfile();
  const data = await Storage.load();
  
  // フォームの全フィールドに値を設定
  Object.keys(data).forEach(key => {
    const field = document.getElementById(key);
    if (field) {
      field.value = data[key] || '';
    }
  });
  
  // 現在のプロファイル名を表示
  const profileName = await Storage.getProfileName(currentProfile);
  document.getElementById('current-profile-label').textContent = profileName;
  
  // タブのアクティブ状態を更新
  document.querySelectorAll('.profile-tab').forEach(tab => {
    const profileNumber = parseInt(tab.getAttribute('data-profile'));
    if (profileNumber === currentProfile) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // 文字数カウンターを更新（データ読み込み後）
  setTimeout(() => {
    updateCharacterCounter('message300', 300);
    updateCharacterCounter('message800', 800);
  }, 100);
}

// フォームデータの保存
async function saveFormData() {
  const form = document.getElementById('settings-form');
  const formData = new FormData(form);
  
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  // メールアドレス確認用
  data.emailConfirm = data.email;
  
  await Storage.save(data);
  
  const currentProfile = await Storage.getCurrentProfile();
  const profileName = await Storage.getProfileName(currentProfile);
  showMessage(`${profileName}を保存しました`, 'success');
}

// 文字数カウンターのセットアップ
function setupCharacterCounter(fieldId, maxLength) {
  const field = document.getElementById(fieldId);
  if (field) {
    // 初期表示時にカウントを更新
    updateCharacterCounter(fieldId, maxLength);
    
    // 入力時にカウントを更新
    field.addEventListener('input', () => {
      updateCharacterCounter(fieldId, maxLength);
    });
  } else {
    console.warn(`Field not found: ${fieldId}`);
  }
}

// 文字数カウンターの更新
function updateCharacterCounter(fieldId, maxLength) {
  const field = document.getElementById(fieldId);
  const counter = document.getElementById(`${fieldId}-counter`);
  
  if (field && counter) {
    const length = field.value.length;
    counter.textContent = `${length} / ${maxLength}文字`;
    
    if (length > maxLength) {
      counter.style.color = '#ef4444';
      counter.style.fontWeight = '600';
    } else {
      counter.style.color = '#6b7280';
      counter.style.fontWeight = '500';
    }
  } else {
    console.warn(`Counter not found for field: ${fieldId}`);
  }
}

// メッセージ表示
function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  
  if (type === 'success') {
    messageDiv.style.background = '#10b981';
  } else if (type === 'error') {
    messageDiv.style.background = '#ef4444';
  }
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(messageDiv);
    }, 300);
  }, 3000);
}
