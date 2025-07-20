export function cpfMask(value: string): string {
  value = value
    .replace(/\D/g, '')   
    .slice(0, 11)             
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d{2})$/, '$1-$2');

  return value;
}
