function ReturnDetailField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

export default ReturnDetailField;
