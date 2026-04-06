import React from 'react';
import { Header } from '../../molecules/Header';

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <article aria-label="Storybook introduction page">
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <section aria-label="Page content"
        style={{
          margin: '0 auto',
          padding: '48px 20px',
          maxWidth: 600,
          color: '#333',
          fontSize: 14,
          lineHeight: '24px',
          fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 32, lineHeight: 1, margin: '0 0 4px' }}>
          Pages in Storybook
        </h2>
        <p>
          We recommend building UIs with a{' '}
          <a href="https://componentdriven.org" target="_blank" rel="noopener noreferrer">
            <strong>component-driven</strong>
          </a>{' '}
          process starting with atomic components and ending with pages.
        </p>
        <p>
          Render pages with mock data. This makes it easy to build and review page states without
          needing to navigate to them in your app.
        </p>
      </section>
    </article>
  );
};
