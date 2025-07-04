import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import clsx from 'clsx';

// Структура данных для карточек разделов
const featureSections = [
  {
    title: 'Структура документации',
    items: [
      {
        title: 'User Journeys',
        description: 'Ролевые инструкции для разработчиков, QA и архитекторов.',
        link: '/docs/00-user-journeys/01-for-new-developer',
      },
      {
        title: 'Getting Started',
        description: 'Все для начала работы: установка, настройка, ключи.',
        link: '/docs/01-getting-started/01-developer-onboarding',
      },
      {
        title: 'How-to Guides',
        description: 'Практические руководства по решению конкретных задач.',
        link: '/docs/02-how-to-guides/01-troubleshooting-common-issues',
      },
      {
        title: 'Core Concepts',
        description: 'Самый важный раздел, описывающий ядро системы.',
        link: '/docs/03-core-concepts/1-architecture-patterns/01-system-overview',
      },
       {
        title: 'Reference',
        description: 'Справочные материалы и API-документация.',
        link: '/docs/04-reference/02-openrouter-integration',
      },
       {
        title: 'Contributing',
        description: 'Правила разработки, стандарты кода и процессы.',
        link: '/docs/05-contributing/01-golden-principles',
      },
    ],
  },
];

const ArchitectureLinks = () => (
    <div className={styles.linkSection}>
        <h3 className={styles.linkSectionTitle}>Архитектура системы</h3>
        <div className={styles.linkGrid}>
            <div>
                <h4>Системный обзор</h4>
                <ul>
                    <li><Link to="/docs/03-core-concepts/1-architecture-patterns/01-system-overview">Обзор архитектуры</Link></li>
                    <li><Link to="/docs/03-core-concepts/1-architecture-patterns/04-manager-architecture">Архитектура менеджеров</Link></li>
                    <li><Link to="/docs/03-core-concepts/1-architecture-patterns/03-code-organization">Организация кода</Link></li>
                </ul>
            </div>
            <div>
                <h4>AI и чат</h4>
                <ul>
                    <li><Link to="/docs/03-core-concepts/3-ui-layer/01-chat-architecture">Архитектура и жизненный цикл чата</Link></li>
                    <li><Link to="/docs/03-core-concepts/2-shell-core/05-api-management">Управление API (APIManager)</Link></li>
                    <li><Link to="/docs/03-core-concepts/4-ai-engine/16-proxy-ai-server">Прокси-сервер для AI</Link></li>
                </ul>
            </div>
        </div>
    </div>
);

const HowToGuidesLinks = () => (
    <div className={styles.linkSection}>
        <h3 className={styles.linkSectionTitle}>Практические руководства</h3>
        <div className={styles.linkGrid}>
            <ul>
                <li><Link to="/docs/02-how-to-guides/01-troubleshooting-common-issues">Устранение неполадок</Link></li>
                <li><Link to="/docs/02-how-to-guides/02-debug-mcp-integration">Отладка интеграции MCP</Link></li>
                <li><Link to="/docs/02-how-to-guides/04-build-and-deploy">Сборка и развертывание</Link></li>
            </ul>
        </div>
    </div>
);


function FeatureCard({ title, description, link }) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <Link to={link} className={styles.cardLink}>
        <div className="card">
          <div className="card__header">
            <h3>{title}</h3>
          </div>
          <div className="card__body">
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        {featureSections.map((section, idx) => (
          <div key={idx} className={styles.featureSection}>
            <h2>{section.title}</h2>
            <div className="row">
              {section.items.map((props, itemIdx) => (
                <FeatureCard key={itemIdx} {...props} />
              ))}
            </div>
          </div>
        ))}
        <ArchitectureLinks />
        <HowToGuidesLinks />
      </div>
    </section>
  );
}
