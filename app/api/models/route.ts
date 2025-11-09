import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb/db';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query: Record<string, any> = {};
    const isRandom = searchParams.get('random') === 'true';
    const timestamp = Date.now();
    
    // Only build query if not doing random search
    if (!isRandom) {
      // Build MongoDB query
      for (const [key, value] of searchParams.entries()) {
        if (!value || key === 'random') continue;
  
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
    }

    console.log('MongoDB Query:', query);

    const collection = await getCollection('adultmodels');
    
    let models;
    if (isRandom) {
      try {
        const pipeline = [
          {
            $match: {
              profile_image: { $exists: true },
              ...query
            }
          },
          // Rastgele sıralama
          { 
            $addFields: { 
              random: { 
                $add: [
                  { $multiply: [{ $rand: {} }, 100] },
                  timestamp
                ]
              } 
            } 
          },
          { $sort: { random: 1 } },
          { $limit: 15 }
        ];

        models = await collection.aggregate(pipeline, {
          allowDiskUse: true,
          maxTimeMS: 30000,
          // Önbelleği devre dışı bırak
          hint: { _id: 1 }
        }).toArray();
        
        if (!models.length) {
          throw new Error('No models found in database');
        }

        // JavaScript tarafında ekstra karıştırma
        models = models
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      } catch (error) {
        console.error('Random aggregation error:', error);
        throw error;
      }
    } else {
      // Ensure profile_image exists and is not empty
      query.profile_image = { $exists: true, $ne: null, $ne: '' };
      models = await collection.find(query).limit(20).toArray();
    }

    if (!models.length) {
      // If no results, try a more relaxed search
      const relaxedQuery = Object.entries(query).reduce((acc, [key, value]) => {
        if (key === 'profile_image') {
          // Keep profile_image filter
          acc[key] = value;
        } else if (typeof value === 'object' && value.$regex) {
          // Make text searches more flexible
          acc[key as string] = { $regex: new RegExp(value.$regex.source.replace(/^\^|\$$/g, ''), 'i') };
        } else if (typeof value === 'number') {
          // Add ±10% range for numeric values
          const range = value * 0.1;
          acc[key as string] = { $gte: value - range, $lte: value + range };
        } else {
          acc[key as string] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Ensure profile_image exists in relaxed query too
      if (!relaxedQuery.profile_image) {
        relaxedQuery.profile_image = { $exists: true, $ne: null, $ne: '' };
      }
      models = await collection.find(relaxedQuery).limit(20).toArray();
    }

    const results = models
      .filter(model => model.profile_image && model.profile_image.trim() !== '')
      .map(model => ({
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