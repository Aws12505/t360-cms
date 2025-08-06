// resources/js/Components/flash-message.tsx
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { type SharedData } from '@/types';

export default function FlashMessage() {
  const { flash } = usePage<SharedData>().props;
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setIsExiting(false);
      setVisible(true);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setVisible(false), 300); // Matches the fade-out duration
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsExiting(true);
      setTimeout(() => setVisible(false), 300);
    }
  }, [flash]);

  if (!visible || !flash || (!flash.success && !flash.error)) return null;

  const message = flash.success || flash.error;
  const isSuccess = !!flash.success;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${
      isExiting 
        ? 'opacity-0 translate-y-2' 
        : 'opacity-100 translate-y-0'
    }`}>
      <div className={`flex items-center gap-4 rounded-lg px-4 py-3 text-white shadow-lg ${
        isSuccess ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`rounded-full p-1 transition-colors ${
            isSuccess ? 'hover:bg-green-600' : 'hover:bg-red-600'
          }`}
          aria-label="Close message"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}