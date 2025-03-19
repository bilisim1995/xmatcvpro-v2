import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb/db';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query: Record<string, any> = {};

    // Build MongoDB query
    for (const [key, value] of searchParams.entries()) {
      if (!value) continue;

      switch (key) {
        case 'age':
          query.age = Number(value);
          break;
        case 'height':
          query['height.value'] = Number(value);
          break;
        case 'weight':
          query['weight.value'] = Number(value);
          break;
        case 'cup_size':
          query.cup_size = { $regex: new RegExp(`^${value}$`, 'i') };
          break;
        case 'nationality':
          query.nationality = { $regex: new RegExp(value, 'i') };
          break;
        case 'ethnicity':
          query.ethnicity = { $regex: new RegExp(value, 'i') };
          break;
        case 'hair_color':
          query.hair_color = { $regex: new RegExp(value, 'i') };
          break;
        case 'eye_color':
          query.eye_color = { $regex: new RegExp(value, 'i') };
          break;
        case 'tattoos':
          query['tattoos.has_tattoos'] = value === 'yes';
          break;
        case 'piercings':
          query['piercings.has_piercings'] = value === 'yes';
          break;
      }
    }


    const collection = await getCollection('adultmodels');
    let models = await collection.find(query).limit(20).toArray();

    if (!models.length) {
      // If no results, try a more relaxed search
      const relaxedQuery = Object.entries(query).reduce((acc: Record<string, any>, [key, value]) => {
        if (typeof value === 'object' && value.$regex) {
          // Make text searches more flexible
          acc[key] = { $regex: new RegExp(value.$regex.source.replace(/^\^|\$$/g, ''), 'i') };
        } else if (typeof value === 'number') {
          // Add ±10% range for numeric values
          const range = value * 0.1;
          acc[key] = { $gte: value - range, $lte: value + range };
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      models = await collection.find(relaxedQuery).limit(20).toArray();
    }

    const results = models.map(model => ({
      id: model._id.toString(),
      name: model.name,
      slug: model.slug || model.name.toLowerCase().replace(/\s+/g, '-'),
      image: model.profile_image,
      profile_image: model.profile_image,
      link1: model.link1,
      age: model.age,
      height: model.height?.value,
      weight: model.weight?.value,
      cup_size: model.cup_size,
      nationality: model.nationality,
      ethnicity: model.ethnicity,
      hair: model.hair_color,
      eyes: model.eye_color,
      tats: model.tattoos?.has_tattoos ? 'yes' : 'no',
      piercings: model.piercings?.has_piercings ? 'yes' : 'no'
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}