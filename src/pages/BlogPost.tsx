import { Link, useParams } from 'react-router-dom';
import { formatPostDate, getPost } from '../data/blog';
import { renderRichText } from '../lib/richText';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-muted">Post not found.</p>
        <Link to="/blog" className="link mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x animate-fade-up py-12">
      <Link to="/blog" className="text-sm text-muted hover:text-accent">
        ← Blog
      </Link>

      <article className="mx-auto mt-4 max-w-2xl">
        <header className="border-b border-line/70 pb-8">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {formatPostDate(post.date)}
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
        </header>

        <div className="mt-8 space-y-4 leading-relaxed text-ink2">
          {renderRichText(post.content)}
        </div>
      </article>
    </div>
  );
}
