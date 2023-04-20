import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
const response2 = await fetch("/api/user/board/report");
const response3 = await fetch("/api/user/board/category/report");
const list = await response2.json();
const categories = await response3.json();
return {
  list,
  categories
};
  
}) satisfies PageLoad;