# Jundo SPEC.md

## Overview

Jundo は「順位」で整理する Todo アプリ。

一般的な Todo アプリのように、

- 重要度: 5
- 緊急度: 3
- 優先度: 8

のような絶対値スコアを入力するのではなく、

> 「どちらをより先にやりたいか」

という相対比較・順位付けによってタスクを管理する。

複数の軸で順位を管理し、その結果を二次元グラフとして可視化することで、
「今何をやるべきか」を直感的に判断できることを目的とする。

---

# Concept

## Core Philosophy

人間は絶対評価より相対評価が得意である。

Jundo は、

- 点数を付ける
- 数値化する
- KPI化する

のではなく、

- 並び替える
- 比較する
- 優先順位を決める

ことでタスクを整理する。

---

# Target Users

- Todo が肥大化して困っている人
- 優先順位付けが苦手な人
- 「やりたいこと」と「やるべきこと」の整理をしたい人
- GTD やタスク管理に疲れた人
- 視覚的にタスクを整理したい人
- 思考整理をしたい人

---

# Core Features

## 1. Task Management

ユーザーはタスクを登録できる。

### Task Fields

```ts
type Task = {
  id: string
  title: string
  description?: string

  status:
    | "active"
    | "completed"
    | "archived"

  createdAt: string
  updatedAt: string
}
```

---

# Ranking Axes

Jundo の基本軸は3つ。

| Axis | Meaning |
|---|---|
| want | やりたい順 |
| must | やるべき順 |
| urgency | 急ぎ順 |

---

# Rank-based Management

数値入力は禁止。

順位のみ管理する。

## Example

```text
Want Ranking

1. Todoアプリを作る
2. 温泉旅行
3. 英語学習
4. ジム
```

順位はドラッグ＆ドロップで変更する。

---

# Matrix Visualization

任意の2軸を選択し、
タスクを二次元グラフとして表示する。

## Example

```text
X: Want
Y: Urgency
```

---

# Matrix Examples

## Want × Urgency

| Area | Meaning |
|---|---|
| Want High / Urgency High | 今すぐやる |
| Want High / Urgency Low | 長期的に育てる |
| Want Low / Urgency High | 片付ける |
| Want Low / Urgency Low | 後回し |

---

## Must × Want

| Area | Meaning |
|---|---|
| Must High / Want High | 最優先 |
| Must High / Want Low | 義務タスク |
| Must Low / Want High | 趣味・探求 |
| Must Low / Want Low | 保留候補 |

---

# UI Structure

```text
/
├── Inbox
├── Rankings
│   ├── Want
│   ├── Must
│   └── Urgency
├── Matrix
├── Archive
└── Settings
```

---

# Tech Stack

Jundo はサーバー上で動作する Web アプリとして構築する。

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- PWA 対応

## Backend

- Fastify
- TypeScript
- REST API

## Database

- PostgreSQL
- Prisma ORM

## Infrastructure

- Docker
- Docker Compose
- VPS または Cloud Run / Render / Fly.io 等にデプロイ可能な構成

---

# System Architecture

```text
Browser / PWA
  ↓
Next.js Frontend
  ↓
Fastify API
  ↓
PostgreSQL
```

---

# Docker Services

```text
jundo-web      Next.js frontend
jundo-api      Fastify backend
jundo-db       PostgreSQL
```

---

# Data Model

## users

```ts
type User = {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}
```

## tasks

```ts
type Task = {
  id: string
  userId: string
  title: string
  description?: string
  status: "active" | "completed" | "archived"
  createdAt: string
  updatedAt: string
}
```

## rankings

```ts
type Ranking = {
  id: string
  userId: string
  axis: "want" | "must" | "urgency"
  orderedTaskIds: string[]
  createdAt: string
  updatedAt: string
}
```

---

# Sync

PC とモバイルは同じサーバー API を通じて同期する。

## Behavior

- タスク作成時に API 経由で保存
- 並び替え時に ranking を保存
- 画面表示時に最新データを取得
- MVPではリアルタイム同期は必須にしない
- 競合解決は Last Write Wins とする

---

# API

## Tasks

```http
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/:id
DELETE /api/tasks/:id
```

## Rankings

```http
GET /api/rankings
PUT /api/rankings/:axis
```

## Matrix

```http
GET /api/matrix?x=want&y=urgency
```

---

# Matrix Calculation

順位を座標に変換する。

```ts
score = 1 - ((rank - 1) / (total - 1))
```

例:

| Rank | Score |
|---|---|
| 1 | 1.0 |
| middle | 0.5 |
| last | 0.0 |

---

# MVP Scope

## Included

- タスク作成
- タスク編集
- 完了・アーカイブ
- Want / Must / Urgency の3軸順位管理
- ドラッグ&ドロップ並び替え
- 2軸マトリクス表示
- PC / モバイル同期
- Docker Compose によるローカル起動

## Excluded

- AI機能
- チーム共有
- 通知
- カレンダー連携
- リアルタイム共同編集
- モバイルネイティブアプリ

---

# Branding

## Name

Jundo

Derived from:

- 順 (Jun)
- Do

Meaning:

> やる順を決める

---

# Taglines

## Japanese

- タスクを、順番で考える。
- やる順を決める。
- 順位で整理するTodo。

## English

- Rank your tasks.
- Think less. Rank first.
- A relative-priority todo app.
