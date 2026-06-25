'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
// ... si tenías más imports aquí (como supabase), déjalos

function LoginContent() {
  const searchParams = useSearchParams();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* AQUÍ DEBE IR TU DISEÑO ACTUAL DEL LOGIN.
        Si borraste todo, asegúrate de mantener tus inputs y botones de Tigres FC / Oriz Travel aquí dentro.
      */}
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      {/* Tu formulario actual */}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-sm text-slate-500">Cargando formulario...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}