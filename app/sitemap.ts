import { MetadataRoute } from 'next';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { AdultModel } from '@/lib/mongodb/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connect();

    const baseUrl = 'https://xmatch.pro';

    const models = await AdultModel
      .find({})
      .select('name slug profile_image updated_at')
      .lean()
      .exec();

    const currentDate = new Date().toISOString();

    // Base static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1
      },
      {
        url: `${baseUrl}/search`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/sensual-vibes`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.7
      },
      {
        url: `${baseUrl}/legal/privacy`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/legal/terms`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/legal/disclaimer`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/legal/dmca`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/legal/2257`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/legal/rta`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3
      }
    ];

    // Generate model routes
    const modelRoutes = models.map(model => {
      const slug = model.slug || model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      return {
        url: `${baseUrl}/models/${slug}`,
        lastModified: model.updated_at?.toISOString() || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8
      };
    });

    return [...staticRoutes, ...modelRoutes];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      { 
        url: 'https://xmatch.pro',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1
      }
    ];
  } finally {
    await disconnect();
  }
}