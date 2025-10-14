// Chrome Storage API ラッパー
const Storage = {
  MAX_PROFILES: 10,
  
  // データ保存（現在のプロファイルに保存）
  async save(data) {
    const currentProfileId = await this.getCurrentProfileId();
    return this.saveProfile(currentProfileId, data);
  },
  
  // データ読み込み（現在のプロファイルから読み込み）
  async load() {
    const currentProfileId = await this.getCurrentProfileId();
    return this.loadProfile(currentProfileId);
  },
  
  // プロファイル保存
  async saveProfile(profileId, data, profileName = null) {
    const profiles = await this.getAllProfiles();
    
    // プロファイルが存在しない場合は新規作成
    if (!profiles[profileId]) {
      profiles[profileId] = {
        id: profileId,
        name: profileName || `プロファイル ${Object.keys(profiles).length + 1}`,
        data: data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      // 既存プロファイルを更新
      profiles[profileId].data = data;
      profiles[profileId].updatedAt = new Date().toISOString();
      if (profileName) {
        profiles[profileId].name = profileName;
      }
    }
    
    await chrome.storage.local.set({ profiles });
    return profiles[profileId];
  },
  
  // プロファイル読み込み
  async loadProfile(profileId) {
    const profiles = await this.getAllProfiles();
    if (profiles[profileId]) {
      return profiles[profileId].data;
    }
    return this.getDefaultData();
  },
  
  // すべてのプロファイルを取得
  async getAllProfiles() {
    const result = await chrome.storage.local.get('profiles');
    return result.profiles || {};
  },
  
  // プロファイル一覧を取得（配列形式）
  async getProfileList() {
    const profiles = await this.getAllProfiles();
    return Object.values(profiles).sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  },
  
  // プロファイル削除
  async deleteProfile(profileId) {
    const profiles = await this.getAllProfiles();
    delete profiles[profileId];
    await chrome.storage.local.set({ profiles });
    
    // 削除したプロファイルが現在のプロファイルだった場合
    const currentProfileId = await this.getCurrentProfileId();
    if (currentProfileId === profileId) {
      // 最初のプロファイルに切り替え
      const profileList = Object.keys(profiles);
      if (profileList.length > 0) {
        await this.setCurrentProfileId(profileList[0]);
      } else {
        // プロファイルがない場合はデフォルトを作成
        await this.createDefaultProfile();
      }
    }
  },
  
  // 現在のプロファイルIDを取得
  async getCurrentProfileId() {
    const result = await chrome.storage.local.get('currentProfileId');
    if (result.currentProfileId) {
      return result.currentProfileId;
    }
    
    // 現在のプロファイルがない場合はデフォルトを作成
    return await this.createDefaultProfile();
  },
  
  // 現在のプロファイルIDを設定
  async setCurrentProfileId(profileId) {
    await chrome.storage.local.set({ currentProfileId: profileId });
  },
  
  // デフォルトプロファイルを作成
  async createDefaultProfile() {
    const profileId = 'profile_' + Date.now();
    await this.saveProfile(profileId, this.getDefaultData(), 'デフォルト');
    await this.setCurrentProfileId(profileId);
    return profileId;
  },
  
  // 新規プロファイルを作成
  async createNewProfile(name) {
    const profiles = await this.getAllProfiles();
    const profileCount = Object.keys(profiles).length;
    
    if (profileCount >= this.MAX_PROFILES) {
      throw new Error(`最大${this.MAX_PROFILES}個までしか保存できません`);
    }
    
    const profileId = 'profile_' + Date.now();
    await this.saveProfile(profileId, this.getDefaultData(), name);
    return profileId;
  },
  
  // プロファイル名を変更
  async renameProfile(profileId, newName) {
    const profiles = await this.getAllProfiles();
    if (profiles[profileId]) {
      profiles[profileId].name = newName;
      profiles[profileId].updatedAt = new Date().toISOString();
      await chrome.storage.local.set({ profiles });
    }
  },
  
  // デフォルトデータ
  getDefaultData() {
    return {
      lastName: '',
      firstName: '',
      kanaLastName: '',
      kanaFirstName: '',
      kanaFullName: '',
      katakanaFullName: '',
      katakanaLastName: '',
      katakanaFirstName: '',
      fullName: '',
      zipcode: '',
      zipcode1: '',
      zipcode2: '', 
      fullAddress: '',
      prefecture: '',
      city: '',
      street: '',
      building: '',
      phone: '',
      phone1: '',
      phone2: '',
      phone3: '',
      fax: '',
      email: '',
      emailConfirm: '',
      subject: '',
      message300: '',
      message800: '',
      companyName: '',
      companyKana: '',
      department: '',
      position: '',
      url: ''
    };
  }
};

