import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  // Future admin implementation
  // if (role && user.role !== role) {
  //   return <Navigate to="/" />
  // }

  return children
}

export default ProtectedRoute