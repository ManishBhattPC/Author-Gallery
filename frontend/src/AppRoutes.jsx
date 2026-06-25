import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import Explore from "./pages/Explore.jsx"
import Books from "./pages/Books.jsx"
import About from "./pages/About.jsx"
import Authors from "./pages/Authors.jsx"
import Contact from "./pages/Contact.jsx"
import SupportHelpdesk from "./pages/SupportHelpdesk.jsx"
import PrivacyTerms from "./pages/PrivacyTerms.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/SignUp.jsx"
import NotFound from "./pages/NotFound.jsx"
import AuthorDashboard from "./pages/AuthorDashboard.jsx"
import AuthorProfile from "./pages/AuthorProfile.jsx"
import AuthorDetails from "./pages/AuthorDetails.jsx"
import BookDetails from "./components/BookComponents/BookDetails.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"

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
        <Route path="helpdesk" element={<SupportHelpdesk />} />
        <Route path="privacy-terms" element={<PrivacyTerms />} />

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

        <Route
          path="dashboard/author-profile"
          element={
            <ProtectedRoute>
              <AuthorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="authors/:id" element={<AuthorDetails />} />

        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes