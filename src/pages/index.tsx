import React, { ReactElement } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          📚 NEIRA Super App — Центр документации
        </Heading>
        <p className="hero__subtitle">Ваша отправная точка для изучения архитектуры, гайдов и принципов разработки проекта.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/README">
            Начать знакомство
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Документация ${siteConfig.title}`}
      description="Центр документации NEIRA Super App: архитектура, гайды и принципы разработки.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
