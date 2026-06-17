import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import Explore from "./pages/Explore.jsx"
import Books from "./pages/Books.jsx"
import About from "./pages/About.jsx"
import Authors from "./pages/Authors.jsx"
import Contact from "./pages/Contact.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/SignUp.jsx"
import NotFound from "./pages/NotFound.jsx"
import AuthorDashboard from "./pages/AuthorDashboard.jsx"
import BookDetails from "./components/BookDetails.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="about" element={<About />} />
        <Route path="authors" element={<Authors />} />
        <Route path="contact" element={<Contact />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route
          path="author-dashboard"
          element={
            <ProtectedRoute >
              <AuthorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes