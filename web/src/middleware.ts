import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pega url para tratar erros de login
  const { pathname, searchParams } = request.nextUrl;

  // Constate se há erro no url
  const authError = searchParams.get("error");

  // Define quais rotas são protegidas
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = request.nextUrl.pathname === "/";

  // Sempre permite a home quando houver erro de auth
  if (isLoginRoute && authError) {
    return NextResponse.next();
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
