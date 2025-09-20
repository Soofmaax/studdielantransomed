// Minimal toast implementation without external deps to keep builds clean.
// In browser, we display a simple transient banner; on server we no-op.
type ToastProps = {
  title: string;
  description: string;
  variant?: 'default' | 'success' | 'destructive';
};

const VARIANT_STYLES: Record<NonNullable<ToastProps['variant']>, { bg: string; color: string; border: string; icon: string }> = {
  default: { bg: '#fff', color: '#374151', border: '#E5E7EB', icon: '🔔' },
  success: { bg: '#B2C2B1', color: '#fff', border: '#B2C2B1', icon: '✅' },
  destructive: { bg: '#EF4444', color: '#fff', border: '#EF4444', icon: '❌' },
};

export function toast({ title, description, variant = 'default' }: ToastProps) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const styles = VARIANT_STYLES[variant];

  // Container
  let container = document.getElementById('__toast-container__');
  if (!container) {
    container = document.createElement('div');
    container.id = '__toast-container__';
    Object.assign(container.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    } as CSSStyleDeclaration);
    document.body.appendChild(container);
  }

  // Toast element
  const el = document.createElement('div');
  Object.assign(el.style, {
    background: styles.bg,
    color: styles.color,
    border: `1px solid ${styles.border}`,
    borderRadius: '8px',
    padding: '10px 12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '260px',
    maxWidth: '360px',
  } as CSSStyleDeclaration);

  const iconSpan = document.createElement('span');
  iconSpan.textContent = styles.icon;

  const textWrap = document.createElement('div');
  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  titleEl.style.fontWeight = '600';
  const descEl = document.createElement('div');
  descEl.textContent = description;
  descEl.style.opacity = '0.9';
  descEl.style.fontSize = '0.9rem';

  textWrap.appendChild(titleEl);
  textWrap.appendChild(descEl);

  el.appendChild(iconSpan);
  el.appendChild(textWrap);
  container.appendChild(el);

  // Auto-remove
  setTimeout(() => {
    el.style.transition = 'opacity 200ms ease';
    el.style.opacity = '0';
    setTimeout(() => {
      el.remove();
      if (container && container.childElementCount === 0) {
        container.remove();
      }
    }, 220);
  }, 3000);
}