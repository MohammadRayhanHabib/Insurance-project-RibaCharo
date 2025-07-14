import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import MainLayout from '../layouts/MainLayout'
import ProfileComponent from '../components/Profile/Profile'
import AllPolicies from '../pages/AllPolicies/AllPolicies'
import PolicyDetails from '../pages/AllPolicies/PolicyDetails'
import QuotePage from '../pages/QuotePage/QuotePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/profile',
                element: <PrivateRoute>
                    <ProfileComponent></ProfileComponent>
                </PrivateRoute>
            },
            {
                path: '/policies',
                element: <AllPolicies></AllPolicies>
            },
            {
                path: '/policyDetails/:id',
                element: <PolicyDetails></PolicyDetails>
            },
            {
                path: '/quote',
                element: <PrivateRoute>
                    <QuotePage></QuotePage>
                </PrivateRoute>
            }
        ],
    },

    { path: '/login', Component: Login },
    { path: '/signup', element: <SignUp /> },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [

        ],
    },
])
