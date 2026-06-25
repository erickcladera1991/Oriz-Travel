import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // O de donde lo estés importando

// 1. Mueve todo tu código actual del login a esta función interna
function LoginContent() {
  const searchParams = useSearchParams();
  
  return (
    // Todo el diseño actual de tu formulario de login (inputs, botones, etc.)
    <div>
      {/* ... tu código actual ... */}
    </div>
  );
}

// 2. Tu export principal ahora solo envuelve al contenido en Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}