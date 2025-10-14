// Chrome Storage API ラッパー
const Storage = {
  // データ保存
  async save(data) {
    return chrome.storage.local.set({ formData: data });
  },
  
  // データ読み込み
  async load() {
    const result = await chrome.storage.local.get('formData');
    return result.formData || this.getDefaultData();
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

