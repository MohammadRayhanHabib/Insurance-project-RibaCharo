import { Outlet } from 'react-router'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
const MainLayout = () => {
    return (
        <div className='bg-white'>
            <Navbar />
            <div className=' min-h-screen'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
