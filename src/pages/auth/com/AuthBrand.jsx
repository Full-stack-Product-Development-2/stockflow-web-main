import { ChartColumn } from "lucide-react";
import { Link } from "react-router-dom";

function AuthBrand() {
  return (
    <Link to="/" className="mb-6 flex items-center justify-center gap-2">
      <span className="flex size-10 items-center justify-center rounded-lg bg-orange-500 text-white">
        <ChartColumn className="size-5" />
      </span>
      <div>
        <p className="text-xl font-semibold leading-none text-foreground">
          StockFlow
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Distribution System
        </p>
      </div>
    </Link>
  );
}

export default AuthBrand;
