interface InputProps {
  name: string;
  label?: string;
  type?: "text" | "number" | "date";
  className?: string;
  min?: number
  max?: number
}

export default function Input(
  { label, name, type = "text", className, ...props }: InputProps,
) {
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        className={`border border-slate-950 h-fit ${className} rounded-lg px-1`}
        {...props}
      />
    </>
  );
}
