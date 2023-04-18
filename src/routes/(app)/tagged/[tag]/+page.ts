import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
const response = await fetch("/api/user/board/tagged/"+params.tag);
const taggedList = await response.json();
const tagName = params.tag;
return {
  taggedList,
  tagName
};
  
}) satisfies PageLoad;