import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const categoryEng = params.categoryEng;

  const response = await fetch("/api/admin/board/free/"+categoryEng);
  const response2 = await fetch("/api/admin/board/category/free");

  const list = await response.json();
  const categories = await response2.json();

return {
  list,
  categories,
};
  
}) satisfies PageLoad;