
import { Navigate, useLocation } from 'react-router'
import useRole from '../hooks/useRole'
import LoadingSpinner from '../components/Shared/Spinner/LoadingSpinner'



const CustomerRoute = ({ children }) => {
    const [role, isRoleLoading] = useRole()
    const location = useLocation()
    console.log(location)
    console.log('Customer route')
    if (isRoleLoading) return <LoadingSpinner />
    if (role === 'customer') return children
    return <Navigate to='/' replace='true' />
}

export default CustomerRoute