'use client';

export function shareToTelegram(text: string) {
  try {
    const encodedText = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=https://xmatch.pro&text=${encodedText}`, '_blank');
  } catch (error) {
    console.error('Failed to share to Telegram:', error);
  }
}

export function shareToWhatsApp(text: string) {
  try {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  } catch (error) {
    console.error('Failed to share to WhatsApp:', error);
  }
}