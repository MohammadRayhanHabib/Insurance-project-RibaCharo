import { Outlet, useNavigation } from 'react-router'
import Navbar from '../components/Shared/Navbar/Navbar'
import Footer from '../components/Shared/Footer/Footer'
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/Shared/Spinner/LoadingSpinner';
const MainLayout = () => {
    const { loading: authLoading } = useAuth();
    const navigation = useNavigation();
    return (
        <div className='bg-white'>
            <Navbar />
            <div className=' min-h-screen'>
                <main className="">
                    {authLoading || navigation.state === 'loading' ? (
                        <LoadingSpinner></LoadingSpinner>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
