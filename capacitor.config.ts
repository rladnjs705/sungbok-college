import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sungbok.college',
  appName: '새벽이슬',
  webDir: 'build',
  bundledWebRuntime: false,
  server:{
    url : "https://port-0-sungbok-college-1jx7m2gldi7x7be.gksl2.cloudtype.app", //<=이부분은 연결할 주소로 설정
    cleartext : true,
    allowNavigation: ['api']
  }
};

export default config;
