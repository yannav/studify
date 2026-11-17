export function TypingDots({ label = 'Cramly is thinking' }: { label?: string }) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="round size-1.5 animate-typing rounded-full bg-leaf-text" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  )
}
