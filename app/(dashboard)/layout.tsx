import Sidebar from "./_components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full fixed flex-col w-[250px] inset-y-0">
        <Sidebar />
      </div>
      <div className="w-full h-full md:pl-[250px]">{children}</div>
    </div>
  );
};

export default DashboardLayout;
