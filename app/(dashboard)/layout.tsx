import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full fixed flex-col w-[250px] inset-y-0">
        <Sidebar />
      </div>
      <div className="w-full h-[90px] md:pl-[250px] bg-white border-b border-slate-300 inset-y-0">
        <Navbar/>
      </div>
      <div className="w-full h-full md:pl-[250px]">{children}</div>
    </div>
  );
};

export default DashboardLayout;
