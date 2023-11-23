import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorElement from './Components/ErrorElement/ErrorElement';
import Main from './Components/Layout/Main';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      errorElement: <ErrorElement></ErrorElement>,
      element: <Main></Main>,
      children: [
        {
          path: '/',
          element: <Home></Home>
        },
        {
          path: '/login',
          element: <Login></Login>
        },
        {
          path: "/register",
          element: <Register></Register>
        },
        {
          path: "/forgetPassword",
          element: <ForgetPassword></ForgetPassword>
        }

      ]
    }
  ])
  return (
    <div className='autoMargin bg-custom'>
      <RouterProvider router={router}>

      </RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
