import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
//const response = await fetch("/api/admin/board/best/notice");
const response2 = await fetch("/api/admin/board/notice");
//const bestList = await response.json();
const list = await response2.json();
return {
  //bestList,
  list
};
  
}) satisfies PageLoad;