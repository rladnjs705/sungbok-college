import { Feed } from 'feed'

import type { RequestHandler } from './$types'

export const prerender = false

export const GET: RequestHandler = async (event) => {
    const response = await event.fetch("/api/user/board");
	const posts  = await response.json();
  const feed = new Feed({
    title: "새벽이슬",
    description: "새벽이슬 청년들의 커뮤니티 사이트 입니다.",
    link: "https://www.sungbok-college.site",
    id: "https://www.sungbok-college.site/",
    language: 'ko',
    copyright: "Copyright ©2023",
    author: {
      name: "김재원",
      email: "rladnjs705@naver.com",
      link: "rladnjs705",
    },
  })
  posts.response.forEach((p:any) => {
    const updatedDate = p.updatedDate;
    const date = new Date(updatedDate[0], updatedDate[1] - 1, updatedDate[2], updatedDate[3], updatedDate[4], updatedDate[5], updatedDate[6]);
    feed.addItem({
      title: p.title,
      id: p.id,
      link: `https://www.sungbok-college.site/articles/${p.id}`,
      description: p.content,
      date: date,
    })
  })

  return new Response(feed.rss2(), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } })
}