import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-white/35 font-medium mb-6">
    {items.map((item, i) => (
      <span key={item.label} className="flex items-center gap-1.5">
        {i > 0 && <ChevronRight size={11} className="text-white/20" />}
        {item.href ? (
          <Link
            to={item.href}
            className="hover:text-white/65 transition-colors duration-200"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-white/65">{item.label}</span>
        )}
      </span>
    ))}
  </div>
);

export default Breadcrumb;
