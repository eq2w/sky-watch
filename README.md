# Sky Watch

Веб-дашборд мониторинга воздушного движения: карта Яндекс, рейсы OpenSky Network, фильтры, список и карточки объектов.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8)

## Возможности

- Интерактивная карта (Yandex Maps API v3) с кластеризацией самолётов и аэропортов
- Живые состояния рейсов через OpenSky Network (BFF на Next.js API Routes)
- Фильтры: высота, скорость, страна, на земле / в воздухе, видимость слоёв
- Список рейсов (таблица на desktop, карточки на mobile) с поиском и сортировкой
- Детали самолёта и аэропорта (прибытия / отправления)
- Поиск по карте (геокодер Яндекса)
- Адаптивный UI: на мобиле — табы «Карта / Фильтры / Детали / Список»

## Стек

| Слой | Технологии |
|------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Data | TanStack Query, Zustand |
| Maps | Yandex Maps JS API 3 + `@yandex/ymaps3-clusterer` |
| UI | Tailwind CSS 4 |
| APIs | OpenSky Network, Yandex Geocoder |

Архитектура ориентирована на Feature-Sliced Design: `app` / `widgets` / `features` / `entities` / `shared`.

## Требования

- Node.js 20+
- Аккаунты и ключи:
  - [OpenSky Network](https://opensky-network.org/) — Client ID / Secret (OAuth2)
  - [Yandex Maps](https://developer.tech.yandex.ru/) — ключ JS API
  - [Yandex Geocoder](https://developer.tech.yandex.ru/) — ключ HTTP Геокодера

## Быстрый старт

```bash
git clone <your-repo-url>
cd flyradar_next
npm install