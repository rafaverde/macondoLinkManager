import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const authError = searchParams.get("error");

  const isLoginRoute = pathname === "/";

  // Sempre permite login com erro
  if (isLoginRoute && authError) {
    return NextResponse.next();
  }

  /**
   * 🔴 NÃO checar cookie aqui
   * 🔴 NÃO redirecionar baseado em token
   */

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
