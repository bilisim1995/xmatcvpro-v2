import { Card } from '@/components/ui/card';
import { Metadata } from 'next';
import { getLegalContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Terms of Service | xmatch.pro',
  description: 'Terms and conditions for using xmatch.pro',
};

export default function TermsPage() {
  const content = getLegalContent('terms');

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto p-8">
        <article className="prose dark:prose-invert lg:prose-lg mx-auto">
          <div 
            className="mt-8 prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-red-600 hover:prose-a:text-red-500 prose-strong:text-foreground prose-code:text-red-600 prose-pre:bg-muted prose-pre:text-foreground"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </Card>
    </div>
  );
}