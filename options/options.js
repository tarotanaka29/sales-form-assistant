// 設定画面スクリプト
document.addEventListener('DOMContentLoaded', async () => {
  // プロファイル一覧を読み込み
  await loadProfileList();
  
  // 現在のプロファイルのデータを読み込み
  await loadFormData();
  
  // フォーム送信イベント
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveFormData();
  });
  
  // プロファイル選択イベント
  document.getElementById('profile-select').addEventListener('change', async (e) => {
    const profileId = e.target.value;
    if (profileId) {
      await Storage.setCurrentProfileId(profileId);
      await loadFormData();
      showMessage('プロファイルを切り替えました', 'success');
    }
  });
  
  // 新規作成ボタン
  document.getElementById('new-profile-btn').addEventListener('click', async () => {
    const name = prompt('新しいプロファイル名を入力してください:', `プロファイル ${await getProfileCount() + 1}`);
    if (name) {
      try {
        const profileId = await Storage.createNewProfile(name);
        await Storage.setCurrentProfileId(profileId);
        await loadProfileList();
        await loadFormData();
        showMessage(`プロファイル「${name}」を作成しました`, 'success');
      } catch (error) {
        showMessage(error.message, 'error');
      }
    }
  });
  
  // 名前変更ボタン
  document.getElementById('rename-profile-btn').addEventListener('click', async () => {
    const profileId = await Storage.getCurrentProfileId();
    const profiles = await Storage.getAllProfiles();
    const currentProfile = profiles[profileId];
    
    if (currentProfile) {
      const newName = prompt('新しいプロファイル名を入力してください:', currentProfile.name);
      if (newName && newName !== currentProfile.name) {
        await Storage.renameProfile(profileId, newName);
        await loadProfileList();
        showMessage(`プロファイル名を「${newName}」に変更しました`, 'success');
      }
    }
  });
  
  // 削除ボタン
  document.getElementById('delete-profile-btn').addEventListener('click', async () => {
    const profileId = await Storage.getCurrentProfileId();
    const profiles = await Storage.getAllProfiles();
    const currentProfile = profiles[profileId];
    
    if (currentProfile) {
      const profileCount = Object.keys(profiles).length;
      if (profileCount === 1) {
        showMessage('最後のプロファイルは削除できません', 'error');
        return;
      }
      
      if (confirm(`プロファイル「${currentProfile.name}」を削除しますか?`)) {
        await Storage.deleteProfile(profileId);
        await loadProfileList();
        await loadFormData();
        showMessage(`プロファイル「${currentProfile.name}」を削除しました`, 'success');
      }
    }
  });
  
  // 文字数カウンター
  setupCharacterCounter('message300', 300);
  setupCharacterCounter('message800', 800);
});

// プロファイル一覧を読み込み
async function loadProfileList() {
  const profileList = await Storage.getProfileList();
  const currentProfileId = await Storage.getCurrentProfileId();
  const select = document.getElementById('profile-select');
  
  select.innerHTML = '';
  
  profileList.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    if (profile.id === currentProfileId) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  
  // 削除ボタンの有効/無効を切り替え
  const deleteBtn = document.getElementById('delete-profile-btn');
  deleteBtn.disabled = profileList.length === 1;
}

// プロファイル数を取得
async function getProfileCount() {
  const profiles = await Storage.getAllProfiles();
  return Object.keys(profiles).length;
}

// フォームデータを読み込み
async function loadFormData() {
  const data = await Storage.load();
  
  // 各フィールドに値を設定
  Object.keys(data).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.value = data[key] || '';
    }
  });
  
  // 文字数カウンターを更新（データ読み込み後）
  setTimeout(() => {
    updateCharacterCounter('message300', 300);
    updateCharacterCounter('message800', 800);
  }, 100);
}

// フォームデータを保存
async function saveFormData() {
  const form = document.getElementById('settings-form');
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  // 自動分割処理
  // ふりがな
  if (data.kanaFullName) {
    const [lastName, firstName] = AutoSplit.splitKana(data.kanaFullName);
    data.kanaLastName = lastName;
    data.kanaFirstName = firstName;
  }
  
  // フリガナ
  if (data.katakanaFullName) {
    const [lastName, firstName] = AutoSplit.splitKatakana(data.katakanaFullName);
    data.katakanaLastName = lastName;
    data.katakanaFirstName = firstName;
  }
  
  // 郵便番号
  if (data.zipcode) {
    const [zip1, zip2] = AutoSplit.splitZipCode(data.zipcode);
    data.zipcode1 = zip1;
    data.zipcode2 = zip2;
  }
  
  // 電話番号
  if (data.phone) {
    const [phone1, phone2, phone3] = AutoSplit.splitPhone(data.phone);
    data.phone1 = phone1;
    data.phone2 = phone2;
    data.phone3 = phone3;
  }
  
  // メール確認
  data.emailConfirm = data.email;
  
  await Storage.save(data);
  showMessage('設定を保存しました', 'success');
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
