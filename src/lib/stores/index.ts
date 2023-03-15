import { writable, derived } from 'svelte/store';
import { ALL, ADMIN } from '$utils/constans';
import { browser } from '$app/environment';
import axios from 'axios';

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
      const _id = userInfo.id;
      const email = userInfo.email;
      const role = userInfo.role;
      const nickName = userInfo.nickName;
      const userName = userInfo.userName;

      set({_id, email, role, nickName, userName});
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
    set({...initValues});
    return;
  }

  return {
    subscribe,
    createAuth,
    resetAuth,
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

export const authToken = setAuthToken();
export const auth = setAuth();
export const isAdmin = setIsAdmin();
export const itemFooterSelected = setItemFooterSelected();
export const sidebarOpen = writable(0);