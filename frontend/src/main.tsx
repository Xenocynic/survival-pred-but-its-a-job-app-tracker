import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './App';
import BoardPage from './pages/Board';
import AnalyticsPage from './pages/Analytics';
import FeedPage from './pages/Feed';
import EditorPage from './pages/Editor';


const router = createBrowserRouter([
{
path: '/',
element: <AppLayout />,
children: [
{ index: true, element: <BoardPage /> },
{ path: 'board', element: <BoardPage /> },
{ path: 'analytics', element: <AnalyticsPage /> },
{ path: 'feed', element: <FeedPage /> },
{ path: 'editor', element: <EditorPage /> },
{ path: 'editor/:appId', element: <EditorPage /> },
],
},
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<RouterProvider router={router} />
</React.StrictMode>
);