import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const response = await fetch("/api/user/board/category/report");
  const item = await response.json();
  return {
    item
  };
  
}) satisfies PageLoad;