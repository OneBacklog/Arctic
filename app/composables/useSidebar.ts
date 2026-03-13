export const useSidebar = () => {
  const sidebarOpen = useState<boolean | null>('sidebar-open', () => null)
  return { sidebarOpen }
}
