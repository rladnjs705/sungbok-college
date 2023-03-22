import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
//const response = await fetch("/api/admin/board/best/notice");
const response2 = await fetch("/api/admin/board/notice");
const response3 = await fetch("/api/admin/board/category/notice");
//const bestList = await response.json();
const list = await response2.json();
const categories = await response3.json();
return {
  //bestList,
  list,
  categories
};
  
}) satisfies PageLoad;