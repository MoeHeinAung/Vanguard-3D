import { cn } from "@/lib/utils"
import { badgeVariants } from "./badge-variants"

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), "rounded-none", className)} {...props} />
}

export { Badge }