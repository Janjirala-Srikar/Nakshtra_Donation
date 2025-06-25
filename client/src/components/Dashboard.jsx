import React from 'react'
import {useAuth} from '../context/AuthContext'
function Dashboard() {

    const { user, loading } = useAuth();
    console.log(user);
  return (
    <div>{user.email}</div>
  )
}

export default Dashboard