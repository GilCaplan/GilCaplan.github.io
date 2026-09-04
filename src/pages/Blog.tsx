import { Link } from 'react-router-dom';
import { formatPostDate, sortedPosts } from '../data/blog';

// A plain-text excerpt from a post's first paragraph, for the feed card.
function excerpt(content: string, max = 220): string {
  const first = content.split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');
  return first.length > max ? first.slice(0, max).trimEnd() + '…' : first;
}

export default function Blog() {
  const items = sortedPosts();

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[50vh] animate-fade-up flex-col items-center justify-center py-20 text-center">
        <span className="pill">Coming soon</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Writing, soon.</h1>
        <p className="mt-3 max-w-md text-muted">
          I'm planning to write about the things I build — agents, RAG, visualization, and the
          odd Rust rabbit hole. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="container-x animate-fade-up py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
      <p className="mt-2 max-w-2xl text-muted">Notes on what I'm building, logged as I go.</p>

      <div className="mx-auto mt-10 max-w-2xl space-y-5">
        {items.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
            }}
            className="card card-glow group block p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_12px_40px_-16px_rgba(20,184,166,0.45)]"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              {formatPostDate(post.date)}
            </span>
            <h2 className="mt-2 text-xl font-semibold text-ink2 group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{excerpt(post.content)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
