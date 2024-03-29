import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/rootLayout/RootLayout'
import Home from './components/home/Home'
import Signin from './components/signin/Signin'
import UserProfile from 	 './components/user-profile/UserProfile'
import Signup from './components/signup/Signup'
function App() {
  const browserRouter=createBrowserRouter([
    {
      path:"",
      element:<RootLayout />,
      children : [
        {
          path:"/",
          element:<Home />
        },
        {
          path:"signup",
          element:<Signup />
        },
        {
          path:"signin",
          element:<Signin />
        },
        {
          path: "user-profile",
          element: <UserProfile/>
        }
      ]
    }
  ]);
  return (
    <div>
      <RouterProvider router={browserRouter} />
    </div>
  )
}

export default App;