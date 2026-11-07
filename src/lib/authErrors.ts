// Traduce los codigos de error de Firebase Auth a mensajes claros
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "El correo o la contraseña no son correctos.",
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
  "auth/network-request-failed": "No hay conexión. Revisa tu red e inténtalo de nuevo.",
}

export function authErrorMessage(error: unknown, fallback: string) {
  const code = (error as { code?: string })?.code
  if (code && MESSAGES[code]) return MESSAGES[code]
  return fallback
}
