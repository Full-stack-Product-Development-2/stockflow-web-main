import { NavLink, useLocation } from "react-router-dom";
import { cn } from "cn";

function SidebarNavItem({ item }) {
  const { pathname } = useLocation();

  const { badge, icon: Icon, label, to, activePaths = [item.to] } = item;

  const isActive = activePaths.includes(pathname);

  return (
    <li className="min-w-0 flex-1">
      <NavLink
        to={to}
        className={cn({
          "relative flex h-14 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 text-center text-[10px] leading-tight font-medium md:h-11 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-left md:text-sm": true,
          "text-muted-foreground hover:bg-muted hover:text-foreground": true,
          "bg-[#fdf1ed] text-[#a63d1d]": isActive,
        })}
      >
        <Icon className="size-4 shrink-0" />
        <span>{label}</span>
        {badge && (
          <span className="absolute top-1 left-1/2 ml-2 inline-flex min-w-5 md:static md:ml-auto items-center justify-center rounded-full bg-[#e85d31] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}

function SidebarNav({ items }) {
  return (
    <nav aria-label="Primary navigation" className="w-full px-1 py-1 md:px-3 md:py-4">
      <ul className="flex md:block md:space-y-1">
        {items.map((item) => (
          <SidebarNavItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}

export default SidebarNav;
