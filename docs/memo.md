# Next.js プロジェクト作成
https://nextjs.org/docs/app/getting-started/installation

```bash
pnpm create next-app@latest app --yes
cd app
pnpm dev
```

# shadcnインストール

https://ui.shadcn.com/docs/installation/next

```bash
cd app
pnpm dlx shadcn@latest init
```

コンポーネントの追加

```bash
pnpm dlx shadcn@latest add button
```

`app/page.tsx` を編集して動作確認してください。

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```


### shadcn/ui の設定ファイル `components.json` 

https://ui.shadcn.com/docs/components-json


- 主な設定項目
  - `$schema`: スキーマ定義のURL（shadcn/ui公式のスキーマ）
  - `style`: コンポーネントのスタイルバリアント（"new-york" または "default"）
  - `rsc`: React Server Components を使用するかどうか
  - `tsx`: TypeScript を使用するかどうか
- Tailwind CSS 設定
  - `config`: Tailwind設定ファイルのパス
  - `css`: グローバルCSSファイルのパス
  - `baseColor`: ベースカラー（"neutral"）
  - `cssVariables`: CSS変数を使用するかどうか
  - `prefix`: クラス名のプレフィックス
- その他
  - `iconLibrary`: 使用するアイコンライブラリ（"lucide"）
  - `aliases`: パスエイリアスの定義（@/components, @/libなど）
  - `registries`: カスタムコンポーネントレジストリの設定

# DBマイグレーション


```bash
# Prisma & Client
pnpm add -D prisma
pnpm add @prisma/client
# プロジェクトルートの .env を読み込むため (Next.js は自動的に読み込むが、Prisma は読み込まない)
npm add -D dotenv

# 初期化（datasource を postgresql に）
npx prisma init --datasource-provider postgresql
```

モデルの実装

`app/prisma/schema.prisma` を編集してモデルを定義します。

環境変数にDATABASE_URLを設定します。

`app/.env` ファイルに以下を追加します。


```bash
DATABASE_URL="postgresql://app:root1234@fast-note-sample-postgresql:5432/sample?schema=public"
```

`app/prisma.config.ts` を編集して環境変数を読み込みます。

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// ...
```

マイグレーションの実行

```bash
# マイグレーションファイルの作成
#   --name: マイグレーション名
pnpm prisma migrate dev --name init --create-only

# マイグレーションの適用
pnpm prisma migrate deploy

# マイグレーションのリセット
pnpm prisma migrate reset
```

# DBのseedデータ投入

https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

## TypeScriptのランタイムとして `tsx` をインストールします。

```bash
pnpm add -D tsx
```

### サンプル

`tmp/hello.ts`

```ts
let hello: string = "Hello, Fast Note!";
console.log(hello);
```
```bash
pnpm tsx ${PROJECT_DIR}/tmp/hello.ts
# Hello, Fast Note!
```

## コマンドの設定

`package.json` に以下を追加します。

```json
{
  "scripts": {
    // pnpm seed でシードを実行する
    "seed": "prisma db seed",
  },
  "prisma": {
    // prisma db seed コマンドで実行されるスクリプトを指定する
    "seed": "tsx prisma/seed.ts"
  }
}

```

[Prisma Client Reference - PrismaClient](https://www.prisma.io/docs/orm/reference/prisma-client-reference)


`app/prisma/seed.ts`

```ts
import { PrismaClient } from "@/lib/generated/prisma/client";

// https://www.prisma.io/docs/orm/reference/prisma-client-reference
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main () {
  console.log("Seeding database...");

  // createMany: https://www.prisma.io/docs/orm/reference/prisma-client-reference#prismaclient
  await prisma.user.createMany({
    data: [
      {
        id: "keita.midorikawa",
        email: "keita.midorikawa@example.com",
        name: "Keita Midorikawa",
      },
      {
        id: "taro.yamada",
        email: "taro.yamada@example.com",
        name: "Taro Yamada"
      },
    ],
    skipDuplicates: true, // 既に同じID/uniqueキーがあればスキップ
  })

  console.log("Creating tags and notes...");

  // Keita Midorikawa のデータ
  const keitaTags = await Promise.all([
    prisma.tag.create({
      data: { userId: "keita.midorikawa", name: "作業記録" },
    }),
    prisma.tag.create({
      data: { userId: "keita.midorikawa", name: "バグ修正" },
    }),
    prisma.tag.create({
      data: { userId: "keita.midorikawa", name: "機能開発" },
    }),
    prisma.tag.create({
      data: { userId: "keita.midorikawa", name: "会議メモ" },
    }),
  ]);

  const keitaNotes = await Promise.all([
    prisma.note.create({
      data: {
        userId: "keita.midorikawa",
        title: "fast-noteプロジェクト立ち上げ",
        content: "# プロジェクト立ち上げ"
      },
    }),
    prisma.note.create({
      data: {
        userId: "keita.midorikawa",
        title: "データベーススキーマ設計",
        content: "# データベーススキーマ設計",
      },
    }),
    prisma.note.create({
      data: {
        userId: "keita.midorikawa",
        title: "認証実装方針",
        content: "# 認証実装方針"
      },
    }),
    prisma.note.create({
      data: {
        userId: "keita.midorikawa",
        title: "UI/UXデザイン方針",
        content: "# UI/UXデザイン方針"
      },
    }),
    prisma.note.create({
      data: {
        userId: "keita.midorikawa",
        title: "バグ: PostgreSQL接続エラー",
        content: "# バグ: PostgreSQL接続エラー"
      },
    }),
  ]);

  // Keita のメモにタグを関連付け
  await prisma.noteTag.createMany({
    data: [
      { noteId: keitaNotes[0].id, tagId: keitaTags[0].id }, // 立ち上げ -> 作業記録
      { noteId: keitaNotes[1].id, tagId: keitaTags[0].id }, // スキーマ設計 -> 作業記録
      { noteId: keitaNotes[1].id, tagId: keitaTags[2].id }, // スキーマ設計 -> 機能開発
      { noteId: keitaNotes[2].id, tagId: keitaTags[2].id }, // 認証 -> 機能開発
      { noteId: keitaNotes[3].id, tagId: keitaTags[0].id }, // UI/UX -> 作業記録
      { noteId: keitaNotes[4].id, tagId: keitaTags[1].id }, // バグ -> バグ修正
    ],
  });

  console.log("Seed data created successfully!");
  console.log(`- Created ${keitaTags.length} tags`);
  console.log(`- Created ${keitaNotes.length} notes`);
}

main()
  .then(async () => {
    console.log('Seeding done');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```


```bash
pnpm seed
```


# Debounce導入

```bash
pnpm i use-debounce
```

## サンプル

`app/components/note/note-detail.tsx`

```tsx
"use client";
//...
import { useDebouncedCallback } from "use-debounce";

export function NoteDetail({ note, refreshSidebar, onDelete }: NoteDetailProps) {

  //...

  const handleUpdate = useDebouncedCallback((value) => {
    if (!note) return;
    updateNote(note.id, title, tags, content);
    // サイドバーの情報も更新
    refreshSidebar();
  }, 1000);

  // ...

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="flex flex-col h-full p-6 space-y-4">
        {/* Title and Delete Button */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-16">
            タイトル
          </label>
          <Input
            type="text"
            placeholder="タイトルを入力..."
            className="flex-1 text-lg font-medium border-gray-200 focus:border-gray-300"
            value={title}
            onChange={
              (e) => {
                setTitle(e.target.value);
                handleUpdate(e.target.value);
              }
            }
            //onBlur={handleUpdate}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => note && onDelete?.(note.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-16">
            タグ
          </label>
          <Input
            type="text"
            placeholder="タグをカンマ区切りで入力 (例: 仕事, アイデア)"
            className="flex-1 border-gray-200 focus:border-gray-300"
            value={tags}
            onChange={
              (e) => {
                setTags(e.target.value);
                handleUpdate(e.target.value);
              }
            }
            //onBlur={handleUpdate}
          />
        </div>

        {/* Content */}
        <Textarea
          placeholder="ノートの内容を入力..."
          className="flex-1 resize-none border-gray-200 focus:border-gray-300 min-h-0"
          value={content}
          onChange={
            (e) => {
              setContent(e.target.value);
              handleUpdate(e.target.value);
            }
          }
          //onBlur={handleUpdate}
        />

        {/* Created Date */}
        <div className="text-xs text-gray-400">
          作成日時: {new Date(note.createdAt).toLocaleString("ja-JP")}
        </div>
      </div>
    </div>
  );
}
```



# Prisma のクエリメモ

### 多対多の関連付けをすべて切断

https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-all-related-records

```ts
const result = await prisma.user.update({
  where: {
    id: 16,
  },
  data: {
    posts: {
      set: [], // すべての関連付けを切断
    },
  },
  include: {
    posts: true,
  },
})
```

### 多対多のの関連付けを接続または作成

https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-or-create-a-record


```ts
const result = await prisma.post.create({
  data: {
    title: 'How to make croissants',
    author: {
      connectOrCreate: {
        where: { email: 'viola@prisma.io' }, // 関連付け対象の一意キー
        create: { // 存在しない場合に作成するデータ
          email: 'viola@prisma.io',
          name: 'Viola',
        },
      },
    },
  },
  include: {
    author: true,
  },
})
```

### 関連付けのないレコードをフィルタリング

https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#filter-on-absence-of--to-many-records

```ts
const usersWithZeroPosts = await prisma.user.findMany({
  where: {
    posts: { // 投稿が存在しないユーザーを取得
      none: {},
    },
  },
  include: {
    posts: true,
  },
})
```

# 認証・認可

- [Auth.js](https://authjs.dev/reference/nextjs)

## Auth.js インストール

```bash
pnpm i next-auth@beta

touch auth.config.ts
```

## 環境変数設定

`.env`

```
AUTH_SECRET=your-generated-secret-key
AUTH_KEYCLOAK_ID=your-client-id
AUTH_KEYCLOAK_SECRET=your-client-secret
AUTH_KEYCLOAK_ISSUER=https://keycloak.prd.baseport.net/realms/<REALM_NAME>
```

`AUTH_SECRET` は以下で生成できます。

```bash
openssl rand -base64 32
```

## Auth.js 設定ファイル

`auth.ts`

```ts
import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],
  pages: {
    signIn: '/login',  // カスタムログインページ
  },
})
```

## APIルートハンドラーの作成

`app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

## カスタムログインページの作成

`app/login/page.tsx`

```tsx
// ...
import { signIn } from "@/auth";

export default async function Home() {
  return (
    <>
      {/* ... */}
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          {/* ... */}
          <form
            action={async () => {
              "use server";
              await signIn("keycloak", {redirectTo: "/notes"});
            }}
          >
            <Button 
              type="submit"
              className="bg-gray-900 hover:bg-gray-800">
              ログインして始める
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
```

## セッション管理用ミドルウェアの作成

`app/middleware.ts`

```ts
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

##  保護されたページでのセッション使用例

```tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>保護されたページ</h1>
      <p>ようこそ、{session.user?.name}さん</p>
    </div>
  )
}
```

## ログアウト処理の例

`app/components/layout/header.tsx`

```tsx
// ...
import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();

  // ...

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-2.5">
            {/* ... */}

        {session && (
          <DropdownMenu>

            {/* ... */}

            <DropdownMenuContent align="end" className="w-56">
            
              {/* ... */}

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
              >
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <Button type="submit" variant="ghost" className="w-full p-0 m-0 text-left">
                    <span>ログアウト</span>
                  </Button>
                </form>

              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

```