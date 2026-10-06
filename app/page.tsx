export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main>
      <header className="hero">
        <h1>James Knowd</h1>
        <p className="tagline">a freshman at UH Manoa studying business</p>
      </header>

      <section>
        <h2>About</h2>
        <p>
          Hi, I&apos;m James. I&apos;m a freshman at the University of Hawaiʻi
          at Mānoa, where I&apos;m studying business. I&apos;m still early in
          my college journey and excited to learn how organizations work, meet
          new people, and figure out where my interests take me.
        </p>
      </section>

      <section>
        <h2>This semester</h2>
        <ul>
          <li>Taking an introductory business course and learning the fundamentals.</li>
          <li>Settling into campus life at UH Mānoa.</li>
          <li>Building this personal website.</li>
        </ul>
      </section>

      <footer>
        <p>
          &copy; {year} James Knowd
        </p>
      </footer>
    </main>
  );
}
