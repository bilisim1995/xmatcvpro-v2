import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb/client'; // MongoDB bağlantınızın yolu

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  // MongoDB ObjectId validasyonu
  if (!ObjectId.isValid(videoId)) {
    return NextResponse.json({ error: 'Invalid Video ID format' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    // Veritabanı adını doğrudan kullanıyoruz: xmatchpro
    const db = client.db('xmatchpro'); // <--- Veritabanı adı güncellendi
    const collection = db.collection('videos'); // <--- Koleksiyon adı güncellendi

    const objectId = new ObjectId(videoId);

    // Videonun beğeni sayısını bir artırma ve güncellenmiş dokümanı döndürme
    const updatedDocumentResult = await collection.findOneAndUpdate(
      { _id: objectId },
      { $inc: { likes: 1 } },
      { returnDocument: 'after' } // Güncelleme sonrası dokümanı döndür
    );

    // Video bulunamazsa hata döndür
    // updatedDocumentResult null olabilir VEYA updatedDocumentResult.value null olabilir
    if (!updatedDocumentResult || !updatedDocumentResult.value) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Başarılı yanıt olarak güncellenmiş videoyu döndür
    const updatedVideo = updatedDocumentResult.value;
    return NextResponse.json(updatedVideo, { status: 200 });

  } catch (error) {
    console.error('Error liking video:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
