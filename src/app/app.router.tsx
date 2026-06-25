import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AppLayout } from "../shared/components/layout/AppLayout";
import { CampaignCreatePage, CampaignDetailPage, CampaignListPage } from "@/features/campaigns";
import { DashboardPage } from "@/features/dasboard";
import { RecipientListPage } from "@/features/recipients/pages/RecipientListPage";
import { TemplateListPage } from "@/features/templates";


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
                element: <CampaignListPage />
            },
            {
                path: 'campaigns/new', 
                element: <CampaignCreatePage />
            },
            {
                path: 'campaigns/:id', 
                element: <CampaignDetailPage />
            },
            {
                path: 'recipients',  
                element: <RecipientListPage />
            },
            {
                path: 'templates',   
                element: <TemplateListPage />
            }
        ]
    }
])

export function AppRouter() {
    return <RouterProvider router={appRouter}/>
}