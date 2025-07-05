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
        link: '/docs/user-journeys/for-new-developer',
      },
      {
        title: 'Getting Started',
        description: 'Все для начала работы: установка, настройка, ключи.',
        link: '/docs/getting-started/developer-onboarding',
      },
      {
        title: 'How-to Guides',
        description: 'Практические руководства по решению конкретных задач.',
        link: '/docs/how-to-guides/troubleshooting-common-issues',
      },
      {
        title: 'Core Concepts',
        description: 'Самый важный раздел, описывающий ядро системы.',
        link: '/docs/core-concepts/architecture-patterns/system-overview',
      },
       {
        title: 'Reference',
        description: 'Справочные материалы и API-документация.',
        link: '/docs/reference/openrouter-integration',
      },
       {
        title: 'Contributing',
        description: 'Правила разработки, стандарты кода и процессы.',
        link: '/docs/contributing/golden-principles',
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
                    <li><Link to="/docs/core-concepts/architecture-patterns/system-overview">Обзор архитектуры</Link></li>
                    <li><Link to="/docs/core-concepts/architecture-patterns/manager-architecture">Архитектура менеджеров</Link></li>
                    <li><Link to="/docs/core-concepts/architecture-patterns/code-organization">Организация кода</Link></li>
                </ul>
            </div>
            <div>
                <h4>AI и чат</h4>
                <ul>
                    <li><Link to="/docs/core-concepts/ui-layer/chat-architecture">Архитектура и жизненный цикл чата</Link></li>
                    <li><Link to="/docs/core-concepts/shell-core/api-management">Управление API (APIManager)</Link></li>
                    <li><Link to="/docs/core-concepts/ai-engine/proxy-ai-server">Прокси-сервер для AI</Link></li>
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
                <li><Link to="/docs/how-to-guides/troubleshooting-common-issues">Устранение неполадок</Link></li>
                <li><Link to="/docs/how-to-guides/debug-mcp-integration">Отладка интеграции MCP</Link></li>
                <li><Link to="/docs/how-to-guides/build-and-deploy">Сборка и развертывание</Link></li>
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
