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
            // Support range format: "18-25" or single value: "22"
            if (typeof value === 'string' && value.includes('-')) {
              const [min, max] = value.split('-').map(Number);
              if (!isNaN(min) && !isNaN(max)) {
                query.age = { $gte: min, $lte: max };
              } else {
                query.age = Number(value);
              }
            } else {
              const ageNum = Number(value);
              if (!isNaN(ageNum)) {
                query.age = ageNum;
              }
            }
            break;
          case 'height':
            // Support range format: "160-170" or single value: "165"
            if (typeof value === 'string' && value.includes('-')) {
              const [min, max] = value.split('-').map(Number);
              if (!isNaN(min) && !isNaN(max)) {
                query['height.value'] = { $gte: min, $lte: max };
              } else {
                const heightNum = Number(value);
                if (!isNaN(heightNum)) {
                  query['height.value'] = heightNum;
                }
              }
            } else {
              const heightNum = Number(value);
              if (!isNaN(heightNum)) {
                query['height.value'] = heightNum;
              }
            }
            break;
          case 'weight':
            // Support range format: "50-60" or single value: "55"
            if (typeof value === 'string' && value.includes('-')) {
              const [min, max] = value.split('-').map(Number);
              if (!isNaN(min) && !isNaN(max)) {
                query['weight.value'] = { $gte: min, $lte: max };
              } else {
                const weightNum = Number(value);
                if (!isNaN(weightNum)) {
                  query['weight.value'] = weightNum;
                }
              }
            } else {
              const weightNum = Number(value);
              if (!isNaN(weightNum)) {
                query['weight.value'] = weightNum;
              }
            }
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
              profile_image: { $exists: true, $nin: [null, ''] },
              slug: { $exists: true, $nin: [null, ''] },
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
      // Ensure profile_image exists and is not empty, and slug exists
      query.profile_image = { $exists: true, $nin: [null, ''] };
      query.slug = { $exists: true, $nin: [null, ''] };
      models = await collection.find(query).limit(30).toArray();
    }

    if (!models.length) {
      // If no results, try a more relaxed search
      const relaxedQuery = Object.entries(query).reduce((acc, [key, value]) => {
        if (key === 'profile_image' || key === 'slug') {
          // Keep profile_image and slug filters
          acc[key] = value;
        } else if (typeof value === 'object' && value.$regex) {
          // Make text searches more flexible (remove exact match anchors)
          acc[key as string] = { $regex: new RegExp(value.$regex.source.replace(/^\^|\$$/g, ''), 'i') };
        } else if (typeof value === 'object' && ('$gte' in value || '$lte' in value)) {
          // Expand existing ranges by ±5%
          if ('$gte' in value && '$lte' in value) {
            const min = value.$gte as number;
            const max = value.$lte as number;
            const range = (max - min) * 0.05;
            acc[key as string] = { $gte: Math.max(0, min - range), $lte: max + range };
          } else if ('$gte' in value) {
            const min = value.$gte as number;
            const range = min * 0.05;
            acc[key as string] = { $gte: Math.max(0, min - range) };
          } else if ('$lte' in value) {
            const max = value.$lte as number;
            const range = max * 0.05;
            acc[key as string] = { $lte: max + range };
          }
        } else if (typeof value === 'number') {
          // Add ±5% range for single numeric values (more conservative than ±10%)
          const range = Math.max(1, Math.floor(value * 0.05));
          acc[key as string] = { $gte: value - range, $lte: value + range };
        } else {
          acc[key as string] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Ensure profile_image and slug exist in relaxed query too
      if (!relaxedQuery.profile_image) {
        relaxedQuery.profile_image = { $exists: true, $nin: [null, ''] };
      }
      if (!relaxedQuery.slug) {
        relaxedQuery.slug = { $exists: true, $nin: [null, ''] };
      }
      models = await collection.find(relaxedQuery).limit(30).toArray();
    }

    const results = models
      .filter(model => {
        // Ensure profile_image exists and is valid
        if (!model.profile_image || model.profile_image.trim() === '') {
          return false;
        }
        // Ensure slug exists or can be generated
        if (!model.slug && !model.name) {
          return false;
        }
        return true;
      })
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
        nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
        ethnicity: model.ethnicity,
        hair: model.hair_color,
        eyes: model.eye_color,
        tats: model.tattoos?.has_tattoos ? 'yes' : 'no',
        piercings: model.piercings?.has_piercings ? 'yes' : 'no'
      }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('Models API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch models';
    return NextResponse.json(
      { 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}