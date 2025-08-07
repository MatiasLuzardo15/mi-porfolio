export const ProfessionalBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradiente sutil y profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10 dark:from-background dark:via-background dark:to-primary/5" />
      
      {/* Efectos geométricos sutiles */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20">
        {/* Círculos sutiles en las esquinas */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/3 -right-60 w-96 h-96 rounded-full bg-muted/5 blur-3xl" />
      </div>
      
      {/* Grid sutil para textura */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};
