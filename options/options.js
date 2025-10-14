// シンプルな2設定管理
document.addEventListener('DOMContentLoaded', async () => {
  // 現在の設定を読み込み
  await loadFormData();
  
  // タブ切り替えイベント
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const settingNumber = parseInt(e.target.getAttribute('data-setting'));
      
      // タブのアクティブ状態を切り替え
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // 設定を切り替え
      await Storage.setCurrentSetting(settingNumber);
      await loadFormData();
      
      // ラベル更新
      document.getElementById('current-setting-label').textContent = `設定${settingNumber}`;
      
      showMessage(`設定${settingNumber}に切り替えました`, 'success');
    });
  });
  
  // フォーム送信イベント
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveFormData();
  });
  
  // リセットボタン
  document.getElementById('reset-btn').addEventListener('click', async () => {
    const currentSetting = await Storage.getCurrentSetting();
    if (confirm(`設定${currentSetting}をリセットしますか?`)) {
      await Storage.reset();
      await loadFormData();
      showMessage('設定をリセットしました', 'success');
    }
  });
  
  // 文字数カウンター
  setupCharacterCounter('message300', 300);
  setupCharacterCounter('message800', 800);
});

// フォームデータの読み込み
async function loadFormData() {
  const currentSetting = await Storage.getCurrentSetting();
  const data = await Storage.load();
  
  // フォームの全フィールドに値を設定
  Object.keys(data).forEach(key => {
    const field = document.getElementById(key);
    if (field) {
      field.value = data[key] || '';
    }
  });
  
  // 現在の設定番号を表示
  document.getElementById('current-setting-label').textContent = `設定${currentSetting}`;
  
  // タブのアクティブ状態を更新
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const settingNumber = parseInt(btn.getAttribute('data-setting'));
    if (settingNumber === currentSetting) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
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
  
  const currentSetting = await Storage.getCurrentSetting();
  showMessage(`設定${currentSetting}を保存しました`, 'success');
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
    } else {
      counter.style.color = '#6b7280';
    }
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
