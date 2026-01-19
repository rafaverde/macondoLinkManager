import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Tenta pegar o token de autenticação
  const token = request.cookies.get("macondo.token")?.value;
  // Pega url para tratar erros de login
  const { pathname, searchParams } = request.nextUrl;

  // Constate se há erro no url
  const authError = searchParams.get("error");

  // Define quais rotas são protegidas
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = request.nextUrl.pathname === "/";
  const isAuthCallbackRoute = pathname.startsWith("/auth/callback");

  //Sempre libera o callback de auth (token ainda NÃO existe aqui)
  if (isAuthCallbackRoute) {
    return NextResponse.next();
  }

  // Sempre permite a home quando houver erro de auth
  if (isLoginRoute && authError) {
    return NextResponse.next();
  }

  // Caso tente acessar Dashboard sem token > Redireciona para login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Caso tente acessar login COM token > Redireciona para Dashboard
  if (isLoginRoute && token && !authError) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se nada disse acontecer, passa.
  return NextResponse.next();
}

// Configura as rotas em que o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto:
     * - api (rotas de API internas do Next)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (ícone do navegador)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
