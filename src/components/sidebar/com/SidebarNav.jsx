import { NavLink, useLocation } from "react-router-dom";
import { cn } from "cn";

function SidebarNavItem({ item }) {
  const { pathname } = useLocation();

  const { badge, icon: Icon, label, to, activePaths = [item.to] } = item;

  const isActive = activePaths.includes(pathname);

  return (
    <li>
      <NavLink
        to={to}
        className={cn({
          "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium": true,
          "text-muted-foreground hover:bg-muted hover:text-foreground": true,
          "bg-[#fdf1ed] text-[#a63d1d]": isActive,
        })}
      >
        <Icon className="size-4 shrink-0" />
        <span>{label}</span>
        {badge && (
          <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[#e85d31] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}

function SidebarNav({ items }) {
  return (
    <nav aria-label="Primary navigation" className="px-3 py-4">
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}

export default SidebarNav;
