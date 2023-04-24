import { writable, derived } from 'svelte/store';
import { ALL, ADMIN, REPORT } from '$utils/constans';
import { browser } from '$app/environment';
import axios from 'axios';
import { goto } from '$app/navigation';

function setItemCategorySelected() {
  const { subscribe, update, set } = writable(ALL);

  const selectCategory = (_id:any) => {
    set(_id)
  }

  const resetCategory = () => {
    update(data => {return ALL;})
  }

  return {
    subscribe,
    selectCategory,
    set,
    resetCategory,
  }
}

function setAuthToken() {
  const defaultValue = '';
  const isLoginToken = browser ? window.localStorage.getItem('token') ?? defaultValue : defaultValue;
  
  const { subscribe, update, set } = writable(isLoginToken);

  const saveAuthToken = (data:any) => {
    try {
      localStorage.setItem('token', data.token);
      set(data.token);
      return true;
    }
    catch(error) {
      console.log(error);
    }
  }

  const removeAuthToken = () => set('');

  const checkToken = () => {
    const defaultValue = '';
    const isToken = browser ? window.localStorage.getItem('token') ?? defaultValue : defaultValue;
    if(!isToken) set('');
  }

  return {
    subscribe,
    saveAuthToken,
    removeAuthToken,
    checkToken,
  }
}

function setAuth() {
  let initValues = {
    _id: '',
    email: '',
    role: '',
    nickName: '',
    userName: '',
    profileUrl: '',
  }

  let data = { 
    params: {
      authToken : ''
    }
  }

  const { subscribe, set } = writable({...initValues});

  const createAuth = async () => {
    try {
      const defaultValue = '';
      const isLoginToken = browser ? window.localStorage.getItem('token') ?? defaultValue : defaultValue;
      data.params.authToken = isLoginToken;
      const response = await axios.get("/api/user/login/info",data);
      const userInfo = response.data.data.user;
      const _id = userInfo.userId;
      const email = userInfo.email;
      const role = userInfo.role;
      const nickName = userInfo.nickName;
      const userName = userInfo.userName;
      const profileUrl = userInfo.profileUrl;

      set({_id, email, role, nickName, userName, profileUrl});
      return;
    }
    catch(error) {
      authToken.removeAuthToken();
      set({...initValues});
      return;
    }
  }

  const resetAuth = () => {
    authToken.removeAuthToken();
    if(browser){
      window.localStorage.removeItem('token');
    }
    set({...initValues});
    return;
  }

  return {
    subscribe,
    createAuth,
    resetAuth
  }
}

function setIsAdmin() {
  const checkRole = derived(auth, $auth => $auth.role === ADMIN ? true : false);
  return checkRole;
}

function setItemFooterSelected() {
  const { subscribe, set } = writable(ALL);

  const selectFooter = (_id:string) => {
    set(_id)
  }

  return {
    subscribe,
    selectFooter,
  }
}

function setBoardDetailList() :any {
  const { subscribe, update, set } = writable();
  const getBoardDetailList = async (boardType:string,categoryEng:string) => {
    if(boardType == ALL){
      goto("/")
    } else if (boardType == REPORT) {
      try {
        const response = await fetch("/api/user/board/"+boardType);
        const item = await response.json();
        set(item);
      } catch (error) {
        console.log(error);
      }
    } else { 
      if(categoryEng == ALL){
        try {
          const response = await fetch("/api/user/board/"+boardType);
          const item = await response.json();
          set(item);
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          const response = await fetch("/api/user/board/"+boardType+"/"+categoryEng);
          const item = await response.json();
          set(item);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
    return {
      subscribe,
      update,
      set,
      getBoardDetailList,
    }
}

function setAttendanceList() :any {
  const { subscribe, update, set } = writable();
  const getAttendanceList = async () => {
    try {
      const response = await fetch("/api/user/attendance");
      const item = await response.json();
      console.log(item.response);
      set(item.response);
    } catch (error) {
      console.log(error);
    }
  }
    return {
      subscribe,
      update,
      set,
      getAttendanceList,
    }
}


export const authToken = setAuthToken();
export const auth = setAuth();
export const isAdmin = setIsAdmin();
export const itemFooterSelected = setItemFooterSelected();
export const sidebarOpen = writable(0);
export const itemCategorySelected = setItemCategorySelected();
export const pageNumber = writable(1);
export const boardDetailList = setBoardDetailList();
export const isDark = writable(false);
export const isProfileOpen = writable(false);
export const attendanceList = setAttendanceList();