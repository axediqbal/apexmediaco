/**
 * Human-readable labels for product variant option keys.
 * Raw keys (e.g. "vault_accent") are internal identifiers and should
 * never be shown to customers.
 */
const VARIANT_LABELS: Record<string, string> = {
  vault_accent: 'Vault Accent',
  frame_finish: 'Frame Finish',
  size_format: 'Size Format',
  tech_package: 'Tech Package',
  color: 'Color',
  size: 'Size',
  material: 'Material',
  finish: 'Finish',
};

export function variantLabel(key: string): string {
  if (VARIANT_LABELS[key]) return VARIANT_LABELS[key];
  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
