import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { AdultModel } from '@/lib/mongodb/db';

const BATCH_SIZE = 500; // Reduced batch size for better memory usage
const REQUEST_TIMEOUT = 60000; // 60 seconds
const CACHE_DURATION = 3600; // 1 hour

export const dynamic = 'force-dynamic';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  let connection = null;

  try {
    connection = await connect();

    // Get total count first
    const totalModels = await AdultModel.countDocuments();
    const baseUrl = 'https://xmatch.pro';
    const currentDate = new Date().toISOString();

    // Start XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Process models in batches
    for (let skip = 0; skip < totalModels; skip += BATCH_SIZE) {
      const models = await AdultModel
        .find({}, null, { lean: true })
        .select('name slug updated_at')
        .skip(skip)
        .limit(BATCH_SIZE)
        .lean()
        .exec();
      // Add model URLs
      models.forEach(model => {
        const slug = model.slug || model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        xml += `
  <url>
    <loc>${baseUrl}/models/${slug}</loc>
    <lastmod>${model.updated_at?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    // Close XML
    xml += '\n</urlset>';

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION * 2}, stale-while-revalidate=${CACHE_DURATION * 24}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  } finally {
    clearTimeout(timeoutId);
    if (connection) {
      await disconnect();
    }
  }
}