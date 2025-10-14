// 2つのプロファイル管理
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

  // 現在のアクティブなプロファイル番号を取得 (1 or 2)
  async getCurrentProfile() {
    const result = await chrome.storage.local.get('currentProfile');
    return result.currentProfile || 1;
  },

  // 現在のアクティブなプロファイル番号を設定
  async setCurrentProfile(profileNumber) {
    if (profileNumber !== 1 && profileNumber !== 2) {
      throw new Error('プロファイル番号は1または2である必要があります');
    }
    await chrome.storage.local.set({ currentProfile: profileNumber });
  },

  // プロファイル名を取得
  async getProfileName(profileNumber) {
    const key = `profileName${profileNumber}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || `プロファイル${profileNumber}`;
  },

  // プロファイル名を設定
  async setProfileName(profileNumber, name) {
    const key = `profileName${profileNumber}`;
    await chrome.storage.local.set({ [key]: name });
  },

  // プロファイルデータを読み込み
  async load(profileNumber = null) {
    if (profileNumber === null) {
      profileNumber = await this.getCurrentProfile();
    }
    
    const key = `profile${profileNumber}`;
    const result = await chrome.storage.local.get(key);
    
    if (result[key]) {
      return result[key];
    } else {
      return this.getDefaultData();
    }
  },

  // プロファイルデータを保存
  async save(data, profileNumber = null) {
    if (profileNumber === null) {
      profileNumber = await this.getCurrentProfile();
    }
    
    const key = `profile${profileNumber}`;
    await chrome.storage.local.set({ [key]: data });
  },

  // 両方のプロファイルを取得
  async loadBothProfiles() {
    const result = await chrome.storage.local.get(['profile1', 'profile2']);
    return {
      profile1: result.profile1 || this.getDefaultData(),
      profile2: result.profile2 || this.getDefaultData()
    };
  },

  // プロファイルをリセット
  async reset(profileNumber = null) {
    if (profileNumber === null) {
      profileNumber = await this.getCurrentProfile();
    }
    
    const key = `profile${profileNumber}`;
    await chrome.storage.local.set({ [key]: this.getDefaultData() });
  }
};
