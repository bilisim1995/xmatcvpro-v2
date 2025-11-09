'use client';

import { useLanguage } from '@/components/contexts/LanguageContext';
import { BlogPost } from './blog-post';

type PostConfig = {
  titleKey: string;
  excerptKey: string;
  contentKey?: string;
  tags: string[];
};

const posts: PostConfig[] = [
  { titleKey: 'blog.post0.title', excerptKey: 'blog.post0.excerpt', contentKey: 'blog.post0.content', tags: ["Face Recognition", "AI Technology", "Similarity Application", "Face Recognition", "Porn Star Search", "Biometric", "Face Matching", "OnlyFans Model", "Deep Learning", "Digital Identity"] },
  { titleKey: 'blog.post1.title', excerptKey: 'blog.post1.excerpt', tags: ["Facial Recognition Technologies", "Biometric Identification", "pornstar", "search pornstar by face"] },
  { titleKey: 'blog.post2.title', excerptKey: 'blog.post2.excerpt', tags: ["Facial Recognition Trends", "porn models", "sexy models"] },
  { titleKey: 'blog.post3.title', excerptKey: 'blog.post3.excerpt', tags: ["Facial Recognition Research", "search porn models", "Facial Recognition Updates"] },
  { titleKey: 'blog.post4.title', excerptKey: 'blog.post4.excerpt', tags: ["Facial Recognition", "Face Matching", "Biometric Identification", "Celebrity Look-Alike", "Photo Analysis", "AI Face Match", "Look-Alike Finder", "Image Comparison", "Face Similarity", "Photo Matching App"] },
  { titleKey: 'blog.post5.title', excerptKey: 'blog.post5.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars"] },
  { titleKey: 'blog.post6.title', excerptKey: 'blog.post6.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars", "OnlyFans models", "find beke"] },
  { titleKey: 'blog.post7.title', excerptKey: 'blog.post7.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars"] },
  { titleKey: 'blog.post8.title', excerptKey: 'blog.post8.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars"] },
  { titleKey: 'blog.post9.title', excerptKey: 'blog.post9.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars", "OnlyFans models", "find beke"] },
  { titleKey: 'blog.post10.title', excerptKey: 'blog.post10.excerpt', tags: ["Facial Recognition Systems", "Facial Recognition Services", "Facial Recognition Apps", "porn stars", "find pornstar", "find pornstars"] }
];

export function BlogSection() {
  const { t } = useLanguage();

  return (
    <section className="mt-16 space-y-8">
      <header className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
          {t('blog.section_title')}
        </h2>
        <p className="text-muted-foreground">
          {t('blog.section_description')}
        </p>
      </header>
      <div className="grid gap-6 divide-y">
        {posts.map((post, index) => {
          const content = post.contentKey ? t(post.contentKey) : undefined;
          return (
            <BlogPost
              key={`post-${index}-${post.titleKey}`}
              title={t(post.titleKey)}
              excerpt={t(post.excerptKey)}
              content={content}
              tags={post.tags}
            />
          );
        })}
      </div>
    </section>
  );
}