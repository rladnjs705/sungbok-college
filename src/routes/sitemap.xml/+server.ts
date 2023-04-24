export const prerender = false;

export const GET = async (event:any) => {
    const response = await event.fetch("/api/user/board");
	const posts  = await response.json();
	const links = posts.response.map(
		(p:any) => {
        const updatedDate = p.updatedDate;
        const date = new Date(updatedDate[0], updatedDate[1] - 1, updatedDate[2], updatedDate[3], updatedDate[4], updatedDate[5], updatedDate[6]);
        return `
    <url>
      <loc>https://www.sungbok-college.site/articles/${p.id}</loc>
      <lastmod>${date.toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>
  `}
	);
	const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
        <url>
            <loc>https://www.sungbok-college.site/</loc>
            <priority>1.0</priority>
        </url>
        
        <url>
            <loc>https://www.sungbok-college.site/notice</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/attendance</loc>
            <priority>1.0</priority>
        </url>
        
        <url>
            <loc>https://www.sungbok-college.site/free</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/lecture</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/profile</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/questions</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/report</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/reportCard</loc>
            <priority>1.0</priority>
        </url>

        <url>
            <loc>https://www.sungbok-college.site/tagged</loc>
            <priority>1.0</priority>
        </url>

    ${links.join('')}
    </urlset>
  `.trim();
	return new Response(xml, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
};