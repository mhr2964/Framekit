import Link from 'next/link';

const trustPoints = [
  'Invite clients into a quieter review flow with one shareable room.',
  'Start with a single link and a short brief instead of a dense setup form.',
  'Keep momentum with a simple handoff from create to review.',
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Framekit</span>
        <h1 className="hero-title">Share creative work in a calmer review room.</h1>
        <p className="hero-copy">
          Set up a room for a link, add a quick note, and send clients into a review flow that
          feels clear, focused, and easy to trust.
        </p>
        <div className="hero-actions">
          <Link className="primary-link-button" href="/create">
            Create a review room
          </Link>
          <a className="secondary-link" href="#how-it-works">
            See how it works
          </a>
        </div>
      </section>

      <section className="info-grid" aria-label="Benefits">
        {trustPoints.map((point) => (
          <article className="info-card" key={point}>
            <div className="info-marker" aria-hidden="true" />
            <p>{point}</p>
          </article>
        ))}
      </section>

      <section className="feature-band" id="how-it-works">
        <div className="feature-copy">
          <span className="section-label">How it works</span>
          <h2>Open a room, share the link, keep feedback moving.</h2>
          <p>
            Sprint one focuses on the essential path: create a room, confirm the destination, and
            hand off a clear review link. The interface stays intentionally light so the work stays
            at the center.
          </p>
        </div>

        <ol className="step-list">
          <li>
            <strong>Add the work link</strong>
            <span>Paste the page, prototype, or hosted asset you want reviewed.</span>
          </li>
          <li>
            <strong>Name the room</strong>
            <span>Give collaborators a simple title so the review context is obvious.</span>
          </li>
          <li>
            <strong>Share confidently</strong>
            <span>Copy the generated room path and invite clients into the review flow.</span>
          </li>
        </ol>
      </section>
    </main>
  );
}