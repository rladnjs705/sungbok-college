import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
const responseNotice = await fetch("/api/admin/board/notice");
const responseQuestion = await fetch("/api/admin/board/best/questions");
const responseFree = await fetch("/api/admin/board/best/free");
const responseLecture = await fetch("/api/admin/board/best/lecture");

const noticeList = await responseNotice.json();
const questionList = await responseQuestion.json();
const freeList = await responseFree.json();
const lectureList = await responseLecture.json();

return {
  freeList,
  questionList,
  noticeList,
  lectureList
};
  
}) satisfies PageLoad;