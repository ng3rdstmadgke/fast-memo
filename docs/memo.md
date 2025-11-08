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