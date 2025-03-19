import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { AdultModel } from '@/lib/mongodb/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connect();

    const models = await AdultModel
      .find({})
      .select('name slug profile_image updated_at')
      .lean()
      .exec();

    const baseUrl = 'https://xmatch.pro';
    const currentDate = new Date().toISOString();

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://xmatch.pro</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://xmatch.pro/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${models.map(model => {
    const slug = model.slug || model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `
  <url>
    <loc>https://xmatch.pro/models/${slug}</loc>
    <lastmod>${model.updated_at?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  } finally {
    await disconnect();
  }
}