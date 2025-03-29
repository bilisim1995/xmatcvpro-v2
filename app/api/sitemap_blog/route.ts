import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { BlogModel } from '@/lib/mongodb/blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connect();

    const posts = await BlogModel
      .find({})
      .select('title slug updated_at')
      .sort({ publish_date: -1 })
      .lean()
      .exec();

    const baseUrl = 'https://xmatch.pro';
    const currentDate = new Date().toISOString();

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map(post => {
    const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${post.updated_at?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  } finally {
    await disconnect();
  }
}