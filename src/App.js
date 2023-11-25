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
import Forbidden from './Components/Forbidden/Forbidden';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      errorElement: <ErrorElement></ErrorElement>,
      element: <Main></Main>,
      children: [
        {
          path: '/',
          element: <PrivateRoute><Home></Home></PrivateRoute>
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
    },
    {
      path:"/forbidden",
      element: <Forbidden></Forbidden>
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
