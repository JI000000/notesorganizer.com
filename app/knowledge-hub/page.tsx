import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function KnowledgeHubIndex() {
  const allPostsData = getSortedPostsData();
  return (
    <section className="container mx-auto px-6 py-24 pt-48">
      <h1 className="text-5xl font-bold text-white mb-12">The Knowledge Hub</h1>
      <ul className="space-y-8">
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/knowledge-hub/${id}`} className="block p-6 bg-gray-900 rounded-lg border border-gray-700 hover:border-brand-blue transition-colors">
              <h2 className="text-3xl font-bold text-brand-blue">{title}</h2>
              <small className="text-gray-400 mt-2 block">
                {date}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
} 