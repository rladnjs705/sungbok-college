import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
//const response = await fetch("/api/admin/board/best/questions");
const response2 = await fetch("/api/admin/board/questions");
const response3 = await fetch("/api/admin/board/category/questions");
//const bestList = await response.json();
const list = await response2.json();
const categories = await response3.json();
return {
  //bestList,
  list,
  categories
};
  
}) satisfies PageLoad;