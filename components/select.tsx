type SelectProps = {
  placeholder?: string;
  name?: string;
  options: unknown[];
  // deno-lint-ignore no-explicit-any
  onChange?: (e: any) => void;
};

export default function Select({ placeholder, options, ...rest }: SelectProps) {
  return (
    <select
      className="p-1 bg-white border border-slate-300 rounded-lg text-sm"
      {...rest}
    >
      <option hidden selected className="text-gray-400">
        {placeholder ?? "Select one..."}
      </option>
      {options}
    </select>
  );
}
