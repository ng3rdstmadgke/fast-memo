import { auth } from "@/auth"
import { NextResponse } from "next/server"

// ミドルウェアで認証を強制する
// auth: https://authjs.dev/reference/nextjs#auth-1
export default auth((req) => {
  // ユーザーがログインしているかどうか
  const isLoggedIn = !!req.auth

  const { pathname } = req.nextUrl

  // 公開ページリスト
  const publicPages = ["/", "/login"]
  const isPlublicPage = publicPages.includes(pathname)

  // 未ログインで、公開ページ以外にアクセスしようとした場合
  if (!isLoggedIn && !isPlublicPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ログイン済みで、ログインページにアクセスしようとした場合
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/notes", req.url))
  }

  // それ以外はそのまま通す
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}