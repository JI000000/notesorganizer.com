import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  // The paths should be like [{ slug: 'pkm-ultimate-guide' }, ...]
  return paths.map(path => ({
    slug: path.params.id
  }));
}

export default async function Post({ params }: Params) {
  const { slug } = params;
  
  try {
    const postData = await getPostData(slug);
    return (
      <article className="container mx-auto px-6 py-24 pt-48 max-w-4xl">
        <h1 className="text-5xl font-bold text-white mb-4">{postData.title}</h1>
        <div className="text-gray-400 mb-8">
          {postData.date}
        </div>
        <div 
          className="prose prose-invert prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
      </article>
    );
  } catch (error) {
    notFound();
  }
} 