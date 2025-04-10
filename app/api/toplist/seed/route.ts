import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { TopListCategoryModel } from '@/lib/mongodb/toplist';

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

export async function GET() {
  try {
    console.log('Seeding process started...');
    await connect();

    // Insert initial categories
    await TopListCategoryModel.insertMany(
      initialCategories.map(cat => ({
        ...cat,
        created_at: new Date(),
        updated_at: new Date()
      }))
    );

    console.log('Seeding process completed.');
    return NextResponse.json({ message: 'Categories seeded successfully, no demo sites added.' });

  } catch (error) {
    console.error('Error seeding categories:', error);
    console.log('Seeding process failed.');
    return NextResponse.json(
      { message: 'Failed to seed categories' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}