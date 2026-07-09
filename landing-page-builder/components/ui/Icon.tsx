import {
  Layers, Plug, MessageSquare, Database,
  TrendingUp, Target, Users, BarChart2,
  Package, Mail, LineChart, Cpu,
  Clock, LayoutDashboard, PieChart,
  ShoppingCart, AlertCircle, BookOpen,
} from 'lucide-react'
import { LucideProps } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  layers: Layers,
  plug: Plug,
  'message-square': MessageSquare,
  database: Database,
  'trending-up': TrendingUp,
  target: Target,
  users: Users,
  'bar-chart': BarChart2,
  package: Package,
  mail: Mail,
  'line-chart': LineChart,
  cpu: Cpu,
  clock: Clock,
  dashboard: LayoutDashboard,
  'pie-chart': PieChart,
  cart: ShoppingCart,
  alert: AlertCircle,
  book: BookOpen,
}

interface IconProps extends LucideProps {
  name: string
}

export function Icon({ name, size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return <Component size={size} strokeWidth={strokeWidth} {...props} />
}
