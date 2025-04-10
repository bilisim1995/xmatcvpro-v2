import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { TopListCategoryModel, TopListSiteModel } from '@/lib/mongodb/toplist';

const initialCategories = [
  {
    name: 'ALL SITES',
    slug2: 'all',
    icon_name: 'Star',
    description: 'Browse all adult sites in our curated collection across different categories.'
  },
  {
    name: 'FREE PORN TUBE SITES',
    slug2: 'free',
    icon_name: 'Video',
    description: 'Find free porn videos & sex movies on the most popular XXX tubes in the world!'
  },
  {
    name: 'AI PORN SITES',
    slug2: 'ai',
    icon_name: 'Bot',
    description: 'Create your own AI generated porn images of animated & realistic imaginary women!'
  },
  {
    name: 'LIVE SEX CAM SITES',
    slug2: 'live',
    icon_name: 'Camera',
    description: 'Chat live with webcam girls, see them masturbate in free sex shows and tip!'
  },
  {
    name: 'TOP PREMIUM PORN SITES',
    slug2: 'premium',
    icon_name: 'Crown',
    description: 'Enjoy full length 4K HD porn movies with the hottest girls and famous pornstars!'
  }
];

const initialSites = [
  {
    title: "PornHub",
    url: "https://pornhub.com",
    favicon_url: "https://ci.phncdn.com/www-static/favicon.ico",
    description: "The world's largest adult video site with millions of free videos.",
    keywords: "porn,videos,xxx,free porn,hd porn",
    category_id: "free",
    order: 1
  },
  {
    title: "XVideos",
    url: "https://xvideos.com",
    favicon_url: "https://static-ss.xvideos.com/v3/img/skins/default/favicon.ico",
    description: "Free porn videos with advanced search options.",
    keywords: "porn,videos,xxx,free porn",
    category_id: "free",
    order: 2
  }
];

export async function GET() {
  try {
    await connect();

    // Insert initial categories
    const categories = await TopListCategoryModel.insertMany(
      initialCategories.map(cat => ({
        ...cat,
        created_at: new Date(),
        updated_at: new Date()
      }))
    );

    // Insert initial sites with correct category IDs
    const freeCategoryId = categories.find(cat => cat.slug2 === 'free')?._id;
    if (freeCategoryId) {
      await TopListSiteModel.insertMany(
        initialSites.map(site => ({
          ...site,
          category_id: freeCategoryId,
          created_at: new Date(),
          updated_at: new Date()
        }))
      );
    }

    return NextResponse.json({ message: 'Categories seeded successfully' });

  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { message: 'Failed to seed categories' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}