import DashboardShell from "@/components/DashboardShell";

export const metadata = {
  title: "Панель керування",
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}