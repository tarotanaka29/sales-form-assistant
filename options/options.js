// 設定画面スクリプト
document.addEventListener('DOMContentLoaded', async () => {
  // 保存済みデータの読み込み
  await loadFormData();
  
  // 文字数カウンターの初期化
  setupCharCounters();
  
  // フォーム送信イベント
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveFormData();
  });
  
  // リセットボタン
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (confirm('すべての設定をリセットしますか?')) {
      await resetFormData();
    }
  });
});

// 文字数カウンターの設定
function setupCharCounters() {
  const message300 = document.getElementById('message300');
  const message800 = document.getElementById('message800');
  const count300 = document.getElementById('count-300');
  const count800 = document.getElementById('count-800');
  
  message300.addEventListener('input', () => {
    const length = message300.value.length;
    count300.textContent = `${length} / 300文字`;
    if (length > 300) {
      count300.style.color = '#f44336';
    } else {
      count300.style.color = '#888';
    }
  });
  
  message800.addEventListener('input', () => {
    const length = message800.value.length;
    count800.textContent = `${length} / 800文字`;
    if (length > 800) {
      count800.style.color = '#f44336';
    } else {
      count800.style.color = '#888';
    }
  });
}

// フォームデータの読み込み
async function loadFormData() {
  const result = await chrome.storage.local.get('formData');
  const formData = result.formData || {};
  
  // 各フィールドに値を設定
  const fields = [
    'lastName', 'firstName', 'fullName', 'kanaLastName', 'kanaFirstName', 'kanaFullName',
    'katakanaFullName', 'katakanaLastName', 'katakanaFirstName',
    'zipcode', 'zipcode1', 'zipcode2', 'fullAddress', 'prefecture',
    'city', 'street', 'building', 'phone', 'phone1', 'phone2', 'phone3',
    'fax', 'email', 'companyName', 'companyKana', 'department', 'position', 
    'url', 'subject', 'message300', 'message800'
  ];
  
  fields.forEach(field => {
    const element = document.getElementById(field);
    if (element && formData[field]) {
      element.value = formData[field];
    }
  });
  
  // 文字数カウンターを更新
  updateCharCount('message300', 'count-300', 300);
  updateCharCount('message800', 'count-800', 800);
}

// 文字数カウンターの更新
function updateCharCount(textareaId, countId, maxLength) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(countId);
  if (textarea && counter) {
    const length = textarea.value.length;
    counter.textContent = `${length} / ${maxLength}文字`;
  }
}

// フォームデータの保存
async function saveFormData() {
  const formData = {
    lastName: document.getElementById('lastName').value,
    firstName: document.getElementById('firstName').value,
    fullName: document.getElementById('fullName').value,
    kanaLastName: document.getElementById('kanaLastName').value,
    kanaFirstName: document.getElementById('kanaFirstName').value,
    kanaFullName: document.getElementById('kanaFullName').value,
    katakanaFullName: document.getElementById('katakanaFullName').value,
    katakanaLastName: document.getElementById('katakanaLastName').value,
    katakanaFirstName: document.getElementById('katakanaFirstName').value,
    zipcode: document.getElementById('zipcode').value,
    zipcode1: document.getElementById('zipcode1').value,
    zipcode2: document.getElementById('zipcode2').value,
    fullAddress: document.getElementById('fullAddress').value,
    prefecture: document.getElementById('prefecture').value,
    city: document.getElementById('city').value,
    street: document.getElementById('street').value,
    building: document.getElementById('building').value,
    phone: document.getElementById('phone').value,
    phone1: document.getElementById('phone1').value,
    phone2: document.getElementById('phone2').value,
    phone3: document.getElementById('phone3').value,
    fax: document.getElementById('fax').value,
    email: document.getElementById('email').value,
    companyName: document.getElementById('companyName').value,
    companyKana: document.getElementById('companyKana').value,
    department: document.getElementById('department').value,
    position: document.getElementById('position').value,
    url: document.getElementById('url').value,
    subject: document.getElementById('subject').value,
    message300: document.getElementById('message300').value,
    message800: document.getElementById('message800').value
  };
  
  try {
    await chrome.storage.local.set({ formData });
    showMessage('設定を保存しました!', 'success');
  } catch (error) {
    showMessage('保存に失敗しました', 'error');
  }
}

// フォームデータのリセット
async function resetFormData() {
  try {
    await chrome.storage.local.remove('formData');
    
    // すべてのフィールドをクリア
    document.getElementById('settings-form').reset();
    
    // 文字数カウンターをリセット
    document.getElementById('count-300').textContent = '0 / 300文字';
    document.getElementById('count-800').textContent = '0 / 800文字';
    
    showMessage('設定をリセットしました', 'success');
  } catch (error) {
    showMessage('リセットに失敗しました', 'error');
  }
}

// メッセージ表示
function showMessage(message, type) {
  const messageElement = document.getElementById('save-message');
  messageElement.textContent = message;
  messageElement.className = `save-message ${type}`;
  
  setTimeout(() => {
    messageElement.className = 'save-message';
  }, 3000);
}

