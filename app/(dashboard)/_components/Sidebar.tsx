'use client'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'

const Sidebar = () => {
    
  return (
    <div className="w-full h-full flex flex-col gap-y-6 bg-white border-r-[3px]">
      <div className='p-6 mx-auto'>
        <Logo/>
      </div>
      <div>
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar
