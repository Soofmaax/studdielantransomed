import { toast as hotToast } from 'react-hot-toast';

type ToastProps = {
  title: string;
  description: string;
  variant?: 'default' | 'success' | 'destructive';
};

export function toast({ title, description, variant = 'default' }: ToastProps) {
  const toastStyles = {
    default: {
      style: {
        background: '#fff',
        color: '#374151',
        border: '1px solid #E5E7EB',
      },
      icon: '🔔',
    },
    success: {
      style: {
        background: '#B2C2B1',
        color: '#fff',
        border: '1px solid #B2C2B1',
      },
      icon: '✅',
    },
    destructive: {
      style: {
        background: '#EF4444',
        color: '#fff',
        border: '1px solid #EF4444',
      },
      icon: '❌',
    },
  };

  return hotToast(
    () => (
      <div className="flex items-center gap-2">
        <span>{toastStyles[variant].icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: 'top-right',
      ...toastStyles[variant],
    }
  );
}