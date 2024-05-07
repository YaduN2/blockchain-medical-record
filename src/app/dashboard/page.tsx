import React from 'react'
import Summary from '@/components/Summary'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//parallel Routing

function pages({children: ReactNode}) {
  return (
    
    <div className="content ">
      <ToastContainer />
    </div>
  )
}

export default pages