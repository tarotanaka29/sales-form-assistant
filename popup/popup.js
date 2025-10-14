// ポップアップスクリプト
document.addEventListener('DOMContentLoaded', async () => {
  // 統計情報の読み込み
  loadStats();
  
  // 実行ボタン
  document.getElementById('execute-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'auto-fill' });
    window.close();
  });
  
  // 設定ボタン
  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // 個別入力モードのトグル
  document.getElementById('toggle-manual').addEventListener('click', () => {
    const content = document.getElementById('manual-content');
    const icon = document.querySelector('.toggle-icon');
    
    content.classList.toggle('expanded');
    icon.classList.toggle('rotated');
  });
  
  // 個別フィールドボタンのイベント
  const fieldButtons = document.querySelectorAll('.field-btn');
  fieldButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const fieldName = button.getAttribute('data-field');
      await fillSingleField(fieldName, button);
    });
  });
});

// 統計情報の読み込み
async function loadStats() {
  const stats = await chrome.storage.local.get(['dailyCount', 'successRate']);
  
  document.getElementById('daily-count').textContent = stats.dailyCount || 0;
  document.getElementById('success-rate').textContent = 
    stats.successRate ? `${stats.successRate}%` : '-%';
}

// 個別フィールドの入力
async function fillSingleField(fieldName, button) {
  try {
    // 設定データを読み込む
    const result = await chrome.storage.local.get('formData');
    const formData = result.formData || {};
    
    // フィールドの値を取得
    let value = formData[fieldName] || '';
    
    // 分割フィールドの処理
    if (fieldName === 'phone1' && formData.phone) {
      value = splitPhone(formData.phone)[0];
    } else if (fieldName === 'phone2' && formData.phone) {
      value = splitPhone(formData.phone)[1];
    } else if (fieldName === 'phone3' && formData.phone) {
      value = splitPhone(formData.phone)[2];
    } else if (fieldName === 'zipcode1' && formData.zipcode) {
      value = splitZipCode(formData.zipcode)[0];
    } else if (fieldName === 'zipcode2' && formData.zipcode) {
      value = splitZipCode(formData.zipcode)[1];
    } else if (fieldName === 'katakanaLastName' && formData.katakanaFullName) {
      value = splitKatakana(formData.katakanaFullName)[0];
    } else if (fieldName === 'katakanaFirstName' && formData.katakanaFullName) {
      value = splitKatakana(formData.katakanaFullName)[1];    } else if (fieldName === 'kanaLastName' && formData.kanaFullName) {
      value = splitKana(formData.kanaFullName)[0];
    } else if (fieldName === 'kanaFirstName' && formData.kanaFullName) {
      value = splitKana(formData.kanaFullName)[1];
    } else if (fieldName === 'emailConfirm') {
      value = formData.email;
    }
    
    if (!value) {
      showTemporaryMessage(button, '未設定');
      return;
    }
    
    // アクティブタブにメッセージを送信
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { 
      action: 'fill-single-field',
      fieldName: fieldName,
      value: value
    });
    
    // ボタンのフィードバック
    showTemporaryMessage(button, '✓');
    
  } catch (error) {
    console.error('Fill single field error:', error);
    showTemporaryMessage(button, '✗');
  }
}

// ボタンに一時的なメッセージを表示
function showTemporaryMessage(button, message) {
  const originalText = button.textContent;
  button.textContent = message;
  button.classList.add('copied');
  
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('copied');
  }, 1000);
}

// 電話番号分割
function splitPhone(phoneNumber) {
  if (!phoneNumber) return ['', '', ''];
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  if (cleaned.length === 11) {
    return [
      cleaned.substr(0, 3),
      cleaned.substr(3, 4), 
      cleaned.substr(7, 4)
    ];
  } else if (cleaned.length === 10) {
    return [
      cleaned.substr(0, 3),
      cleaned.substr(3, 3),
      cleaned.substr(6, 4)
    ];
  }
  return [cleaned, '', ''];
}

// 郵便番号分割
function splitZipCode(zipCode) {
  if (!zipCode) return ['', ''];
  const cleaned = zipCode.replace(/[^\d]/g, '');
  if (cleaned.length === 7) {
    return [cleaned.substr(0, 3), cleaned.substr(3, 4)];
  }
  return [cleaned, ''];
}

// フリガナ分割
function splitKatakana(fullKatakana) {
  if (!fullKatakana) return ['', ''];
  
  if (fullKatakana.includes(' ') || fullKatakana.includes('　')) {
    const parts = fullKatakana.split(/[\s　]+/);
    return [parts[0] || '', parts[1] || ''];
  }
  
  if (fullKatakana.length >= 4) {
    const threeCharSurnames = ['サトウ', 'タナカ', 'ワタナベ', 'ヤマモト', 'ナカムラ'];
    const firstThree = fullKatakana.substr(0, 3);
    if (threeCharSurnames.includes(firstThree)) {
      return [firstThree, fullKatakana.substr(3)];
    }
    return [fullKatakana.substr(0, 2), fullKatakana.substr(2)];
  } else if (fullKatakana.length === 2) {
    return [fullKatakana.substr(0, 1), fullKatakana.substr(1)];
  }
  return [fullKatakana, ''];
}

// ふりがな分割
function splitKana(fullKana) {
  if (!fullKana) return ['', ''];
  
  if (fullKana.includes(' ') || fullKana.includes('　')) {
    const parts = fullKana.split(/[\s　]+/);
    return [parts[0] || '', parts[1] || ''];
  }
  
  if (fullKana.length >= 4) {
    const threeCharSurnames = ['さとう', 'たなか', 'わたなべ', 'やまもと', 'なかむら'];
    const firstThree = fullKana.substr(0, 3);
    if (threeCharSurnames.includes(firstThree)) {
      return [firstThree, fullKana.substr(3)];
    }
    return [fullKana.substr(0, 2), fullKana.substr(2)];
  } else if (fullKana.length === 2) {
    return [fullKana.substr(0, 1), fullKana.substr(1)];
  }
  return [fullKana, ''];
}

