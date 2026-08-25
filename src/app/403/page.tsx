export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-glow px-6">
      <div className="glass-card p-10 text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-neon-pink">403</h1>
        <p className="text-white/70">لا تملك صلاحية الوصول لهذه الصفحة.</p>
      </div>
    </main>
  );
}
