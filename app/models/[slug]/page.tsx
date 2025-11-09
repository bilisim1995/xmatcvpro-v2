import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModelDetailPage } from '@/components/search-by-face/model-detail/page';
import { SearchResult } from '@/lib/api/types';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { AdultModel } from '@/lib/mongodb/db';
import { Document, Types } from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

interface ModelDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  about?: string;
  profile_image: string;
  link?: string;
  age?: number;
  height?: { value: number };
  weight?: { value: number };
  cup_size?: string;
  measurements?: string;
  nationality?: string[];
  ethnicity?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: { has_tattoos: boolean };
  piercings?: { has_piercings: boolean };
  social_media?: {
    www?: string;
    instagram?: string;
    twitter?: string;
    onlyfans?: string;
    onlyfansfree?: string;
    imdb?: string;
    x?: string;
  };
  stats?: {
    views: number;
    likes: number;
    rating: number;
  };
  slug?: string;
}

async function getModel(slug: string): Promise<SearchResult | null> {
  try {
    await connect();

    const searchSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/\s+/g, '-');
    
    let model = await AdultModel.findOne<ModelDocument>({
      slug: searchSlug
    }).lean();

    if (!model) {
      const searchName = searchSlug.replace(/-/g, ' ');
      model = await AdultModel.findOne<ModelDocument>({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      }).lean();
    }

    if (!model) {
      return null;
    }

    return {
      id: model._id?.toString() || '',
      name: model.name,
      slug: model.slug || model.name.toLowerCase().replace(/\s+/g, '-'),
      description: model.about || '',
      image: model.profile_image,
      link1: model.link,
      age: model.age,
      height: model.height?.value || null,
      weight: model.weight?.value || null,
      cup_size: model.cup_size,
      measurements: model.measurements,
      nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
      ethnicity: model.ethnicity,
      hair: model.hair_color,
      eyes: model.eye_color,
      tats: model.tattoos?.has_tattoos === true ? 'yes' : 'no',
      piercings: model.piercings?.has_piercings === true ? 'yes' : 'no',
      social_media: {
        www: model.social_media?.www,
        instagram: model.social_media?.instagram, 
        twitter: model.social_media?.twitter,
        onlyfans: model.social_media?.onlyfans,
        onlyfansfree: model.social_media?.onlyfansfree,
        imdb: model.social_media?.imdb,
        x: model.social_media?.x
      },
      stats: {
        views: model.stats?.views ?? 0,
        likes: model.stats?.likes ?? 0,
        rating: Number((model.stats?.rating ?? 0).toFixed(1))
      }
    };
  } catch (error) {
    console.error('Error fetching model:', error);
    return null;
  } finally {
    await disconnect();
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const model = await getModel(params.slug);

  if (!model) {
    return {
      title: 'Model Not Found | xmatch.pro',
      description: 'The requested model could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${model.name} - Model Profile | xmatch.pro`;
  // Description should be 150-160 characters for optimal SEO
  const description = model.description 
    ? (model.description.length > 160 ? `${model.description.substring(0, 157)}...` : model.description)
    : `Discover ${model.name}'s profile on xmatch.pro. View photos, videos, and details about this model. Find similar models with our AI-powered search.`;
  
  // Ensure image URL is absolute
  const imageUrl = model.image 
    ? (model.image.startsWith('http') ? model.image : `https://xmatch.pro${model.image}`)
    : 'https://xmatch.pro/m1.png';
  const canonicalUrl = `https://xmatch.pro/models/${model.slug}`;

  // Generate keywords
  const keywords = [
    model.name,
    'model profile',
    'adult model',
    'pornstar',
    ...(model.ethnicity ? [model.ethnicity] : []),
    ...(model.nationality ? [model.nationality] : []),
    ...(model.age ? [`${model.age} years old`] : []),
    'xmatch.pro',
    'AI face recognition',
    'model search',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'profile',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'xmatch.pro',
      title: `${model.name} - Model Profile`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: `${model.name} - Model Profile on xmatch.pro`,
        },
      ],
      ...(model.social_media?.instagram && {
        profile: {
          firstName: model.name.split(' ')[0] || model.name,
          username: model.slug,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.name} - Model Profile`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'og:type': 'profile',
    },
  };
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const model = await getModel(params.slug);

  if (!model) {
    notFound();
  }

  // Structured Data (JSON-LD) for SEO
  // Ensure image URL is absolute for structured data
  const structuredImageUrl = model.image 
    ? (model.image.startsWith('http') ? model.image : `https://xmatch.pro${model.image}`)
    : 'https://xmatch.pro/m1.png';

  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: model.name,
    description: model.description || `Profile of ${model.name}`,
    image: structuredImageUrl,
    url: `https://xmatch.pro/models/${model.slug}`,
    ...(model.age && { age: model.age }),
    ...(model.height && { height: {
      '@type': 'QuantitativeValue',
      value: model.height,
      unitCode: 'CMT'
    }}),
    ...(model.weight && { weight: {
      '@type': 'QuantitativeValue',
      value: model.weight,
      unitCode: 'KGM'
    }}),
    ...(model.ethnicity && { ethnicity: model.ethnicity }),
    ...(model.nationality && { nationality: model.nationality }),
    sameAs: [
      ...(model.social_media?.www ? [model.social_media.www] : []),
      ...(model.social_media?.instagram ? [model.social_media.instagram] : []),
      ...(model.social_media?.twitter ? [model.social_media.twitter] : []),
      ...(model.social_media?.x ? [model.social_media.x] : []),
      ...(model.social_media?.onlyfans ? [model.social_media.onlyfans] : []),
    ].filter(Boolean), // Remove empty values
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://xmatch.pro',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Models',
        item: 'https://xmatch.pro/search',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: model.name,
        item: `https://xmatch.pro/models/${model.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <ModelDetailPage model={model} />
    </>
  );
}
