import { writable } from 'svelte/store';
import { ALL } from '$utils/constans';

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

export const itemFooterSelected = setItemFooterSelected();
export const sidebarOpen = writable(0);