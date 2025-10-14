// シンプルなストレージ管理（2つの設定のみ）
const Storage = {
  // デフォルトデータ
  getDefaultData() {
    return {
      // 会社情報
      companyName: '',
      companyKana: '',
      department: '',
      position: '',
      url: '',
      
      // 担当者情報
      lastName: '',
      firstName: '',
      fullName: '',
      kanaLastName: '',
      kanaFirstName: '',
      kanaFullName: '',
      katakanaLastName: '',
      katakanaFirstName: '',
      katakanaFullName: '',
      
      // 所在地
      zipcode: '',
      zipcode1: '',
      zipcode2: '',
      fullAddress: '',
      prefecture: '',
      city: '',
      street: '',
      building: '',
      
      // 連絡先
      phone: '',
      phone1: '',
      phone2: '',
      phone3: '',
      fax: '',
      email: '',
      emailConfirm: '',
      
      // 問い合わせ情報
      subject: '',
      message300: '',
      message800: ''
    };
  },

  // 現在のアクティブな設定番号を取得 (1 or 2)
  async getCurrentSetting() {
    const result = await chrome.storage.local.get('currentSetting');
    return result.currentSetting || 1;
  },

  // 現在のアクティブな設定番号を設定
  async setCurrentSetting(settingNumber) {
    if (settingNumber !== 1 && settingNumber !== 2) {
      throw new Error('設定番号は1または2である必要があります');
    }
    await chrome.storage.local.set({ currentSetting: settingNumber });
  },

  // 設定データを読み込み
  async load(settingNumber = null) {
    if (settingNumber === null) {
      settingNumber = await this.getCurrentSetting();
    }
    
    const key = `setting${settingNumber}`;
    const result = await chrome.storage.local.get(key);
    
    if (result[key]) {
      return result[key];
    } else {
      return this.getDefaultData();
    }
  },

  // 設定データを保存
  async save(data, settingNumber = null) {
    if (settingNumber === null) {
      settingNumber = await this.getCurrentSetting();
    }
    
    const key = `setting${settingNumber}`;
    await chrome.storage.local.set({ [key]: data });
  },

  // 両方の設定を取得
  async loadBothSettings() {
    const result = await chrome.storage.local.get(['setting1', 'setting2']);
    return {
      setting1: result.setting1 || this.getDefaultData(),
      setting2: result.setting2 || this.getDefaultData()
    };
  },

  // 設定をリセット
  async reset(settingNumber = null) {
    if (settingNumber === null) {
      settingNumber = await this.getCurrentSetting();
    }
    
    const key = `setting${settingNumber}`;
    await chrome.storage.local.set({ [key]: this.getDefaultData() });
  }
};
