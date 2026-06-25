import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AppLayout } from "../shared/components/layout/AppLayout";


const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" />
            },
            {
                path: 'dashboard',   
                element: <DashboardPage /> 
            },
            {
                path: 'campaigns', 
                element: <CampaignsPage />
            },
            {
                path: 'campaigns/list', 
                element: <CampaignsListPage />
            },
            {
                path: 'campaigns/new', 
                element: <CampaignsCreatePage />
            },
            {
                path: 'campaigns/:id', 
                element: <CampaignsDetailPage />
            },
            {
                path: 'recipients',  
                element: <RecipientsPage />
            },
            {
                path: 'templates',   
                element: <TemplatesPage />
            }
        ]
    }
])

export function AppRouter() {
    return <RouterProvider router={appRouter}/>
}