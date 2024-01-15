
import { NavItem} from "@/types";


export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: "billing",
    label: "Home",
  },

  {
    title: "🗒️ All Memo",
    href: "/dashboard/ememo/all",
    //@ts-expect-error no icon
    icon: "",
    label: "New memo",
  },
  {
    title: "✍️ New Memo",
    href: "/dashboard/ememo/new",
        //@ts-expect-error no icon
    icon: "",
    label: "New memo",
  },

  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile 🚧 Underconstruction",
  },

];