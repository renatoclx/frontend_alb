interface JwtPayload {
  sub: string;
  email: string;
}

// Só decodifica o payload (não valida assinatura) — a API já validou o token
// antes de emiti-lo; aqui só precisamos ler o "sub" pra buscar o perfil.
export function decodeJwtPayload(token: string): JwtPayload {
  const payload = token.split(".")[1];
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as JwtPayload;
}
