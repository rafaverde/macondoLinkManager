import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Tenta pegar o token de autenticação
  const token = request.cookies.get("macondo.token")?.value;

  // Define quais rotas são protegidas
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRout = request.nextUrl.pathname === "/";

  // Caso tente acessar Dashboard sem token > Redireciona para login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Caso tente acessar login COM token > Redireciona para Dashboard
  if (isLoginRout && token) {
    return NextResponse.redirect(new URL("dashboard", request.url));
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
