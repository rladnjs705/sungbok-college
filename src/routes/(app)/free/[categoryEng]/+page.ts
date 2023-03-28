import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const categoryEng = params.categoryEng;

  const response = await fetch("/api/user/board/free/"+categoryEng);
  const response2 = await fetch("/api/user/board/category/free");

  const list = await response.json();
  const categories = await response2.json();

return {
  list,
  categories,
};
  
}) satisfies PageLoad;