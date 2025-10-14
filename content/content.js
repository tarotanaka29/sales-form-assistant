// メインの自動入力処理
class FormAutoFiller {
  constructor() {
    this.isEnabled = true;
    this.init();
  }
  
  async init() {
    // メッセージリスナー
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'auto-fill') {
        this.executeAutoFill();
      } else if (message.action === 'fill-single-field') {
        this.fillSingleFieldByType(message.fieldName, message.value);
      }
    });
  }
  
  // 自動入力実行
  async executeAutoFill() {
    try {
      const formData = await this.loadFormData();
      const fields = FieldDetector.getAllInputFields();
      
      let fillCount = 0;
      
      fields.forEach(field => {
        const fieldType = FieldDetector.detectFieldType(field);
        
        if (fieldType && this.fillField(field, fieldType, formData)) {
          fillCount++;
        }
      });
      
      this.showNotification(`${fillCount}個の項目を入力しました`);
      
    } catch (error) {
      console.error('Auto-fill error:', error);
      this.showNotification('入力エラーが発生しました', 'error');
    }
  }
  
// 個別フィールドタイプによる入力
  async fillSingleFieldByType(fieldName, value) {
    try {
      const fields = FieldDetector.getAllInputFields();
      let filled = false;
      let filledCount = 0;
      
      console.log(`Attempting to fill field: ${fieldName} with value: ${value}`);
      
      // フィールドタイプに一致するフィールドを探す
      fields.forEach(field => {
        const detectedType = FieldDetector.detectFieldType(field);
        
        console.log(`Field detected as: ${detectedType}, looking for: ${fieldName}`);
        
        if (detectedType === fieldName) {
          // 値を設定
          field.value = value;
          field.focus();
          
          // React/Vue等のフレームワーク対応
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          ).set;
          nativeInputValueSetter.call(field, value);
          
          // 各種イベントをトリガー
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          field.dispatchEvent(new Event('blur', { bubbles: true }));
          field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
          field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
          
          filled = true;
          filledCount++;
          
          console.log(`Successfully filled field: ${field.name || field.id}`);
        }
      });
      
      if (filled) {
        this.showNotification(`「${fieldName}」を${filledCount}個のフィールドに入力しました`, 'success');
      } else {
        console.warn(`No field found for: ${fieldName}`);
        this.showNotification(`「${fieldName}」フィールドが見つかりません`, 'warning');
      }
      
    } catch (error) {
      console.error('Fill single field error:', error);
      this.showNotification('入力エラーが発生しました', 'error');
    }
  }
  
  // フォームデータを読み込む
  async loadFormData() {
    return new Promise((resolve) => {
      chrome.storage.local.get('formData', (result) => {
        resolve(result.formData || {});
      });
    });
  }
  
  // 個別フィールドに値を入力
  fillField(field, fieldType, formData) {
    let value = '';
    
    // 分割フィールドの処理
    if (fieldType === 'phone1' && formData.phone) {
      value = AutoSplit.splitPhone(formData.phone)[0];
    } else if (fieldType === 'phone2' && formData.phone) {
      value = AutoSplit.splitPhone(formData.phone)[1]; 
    } else if (fieldType === 'phone3' && formData.phone) {
      value = AutoSplit.splitPhone(formData.phone)[2];
    } else if (fieldType === 'zipcode1' && formData.zipcode) {
      value = AutoSplit.splitZipCode(formData.zipcode)[0];
    } else if (fieldType === 'zipcode2' && formData.zipcode) {
      value = AutoSplit.splitZipCode(formData.zipcode)[1];
    } else if (fieldType === 'katakanaLastName' && formData.katakanaFullName) {
      value = AutoSplit.splitKatakana(formData.katakanaFullName)[0];
    } else if (fieldType === 'katakanaFirstName' && formData.katakanaFullName) {
      value = AutoSplit.splitKatakana(formData.katakanaFullName)[1];
    } else if (fieldType === 'emailConfirm') {
      value = formData.email;
    } else if (formData[fieldType]) {
      value = formData[fieldType];
    }
    
    if (value) {
      field.value = value;
      field.focus();
      
      // React等のフレームワーク対応
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('blur', { bubbles: true }));
      
      return true;
    }
    
    return false;
  }
  
  // 通知表示
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    let bgColor = '#4caf50'; // success
    if (type === 'error') bgColor = '#f44336';
    if (type === 'warning') bgColor = '#ff9800';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// 初期化
new FormAutoFiller();

