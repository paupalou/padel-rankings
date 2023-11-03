type BreadCrumbItem = {
  href?: string;
  label: string;
};

type BreadCrumbProps = {
  items: BreadCrumbItem[];
};

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <h2>
      {items.slice(0, -1).map((item, i) => (
        <a key={`breadcrumb-${i}`} class="text-cyan-800 mr-2" href={item.href}>
          {item.label} &gt;
        </a>
      ))}
      {items.slice(-1).map((item) => (
        <span key="breadcrumb-current" class="text-slate-800">
          {item.label}
        </span>
      ))}
    </h2>
  );
}
