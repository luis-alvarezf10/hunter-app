export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Implementar verificación de rol de administrador
  // Puedes usar middleware o un componente cliente para verificar auth
  
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
