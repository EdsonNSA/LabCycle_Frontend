export function passwordMask(value: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (value.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres.");
  }

  if (!/[A-Z]/.test(value)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula.");
  }

  if (!/[a-z]/.test(value)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula.");
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push("A senha deve conter pelo menos um caractere especial.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
