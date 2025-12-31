import type { LucideIcon } from "lucide-react"
import {
  HomeIcon,
  LayoutIcon,
  BookOpenIcon,
  DownloadIcon,
  AlertCircleIcon,
  TagIcon,
  MousePointerIcon,
  CreditCardIcon,
  SearchIcon,
  MenuIcon,
  FileTextIcon,
  TypeIcon,
  ListIcon,
  MinusIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string | number
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    title: "ホーム",
    items: [
      {
        title: "概要",
        url: "/",
        icon: HomeIcon,
      },
    ],
  },
  {
    title: "コンポーネント",
    items: [
      {
        title: "AlertDialog",
        url: "/components/alert-dialog",
        icon: AlertCircleIcon,
      },
      {
        title: "Badge",
        url: "/components/badge",
        icon: TagIcon,
      },
      {
        title: "Button",
        url: "/components/button",
        icon: MousePointerIcon,
      },
      {
        title: "Card",
        url: "/components/card",
        icon: CreditCardIcon,
      },
      {
        title: "Combobox",
        url: "/components/combobox",
        icon: SearchIcon,
      },
      {
        title: "DropdownMenu",
        url: "/components/dropdown-menu",
        icon: MenuIcon,
      },
      {
        title: "Field",
        url: "/components/field",
        icon: FileTextIcon,
      },
      {
        title: "Input",
        url: "/components/input",
        icon: TypeIcon,
      },
      {
        title: "Label",
        url: "/components/label",
        icon: FileTextIcon,
      },
      {
        title: "Select",
        url: "/components/select",
        icon: ListIcon,
      },
      {
        title: "Separator",
        url: "/components/separator",
        icon: MinusIcon,
      },
      {
        title: "Textarea",
        url: "/components/textarea",
        icon: FileTextIcon,
      },
    ],
  },
  {
    title: "ドキュメント",
    items: [
      {
        title: "はじめに",
        url: "/docs/getting-started",
        icon: BookOpenIcon,
      },
      {
        title: "インストール",
        url: "/docs/installation",
        icon: DownloadIcon,
      },
    ],
  },
]

