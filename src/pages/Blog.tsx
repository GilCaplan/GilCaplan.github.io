export default function Blog() {
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
