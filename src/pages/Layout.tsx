import type React from "react"
import { Outlet } from "react-router-dom"
import Menu from "../Components/Menu"

const LayoutMenu: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Menu />
      <main
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-width, 280px)", // Default to expanded width
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 960px) {
          main {
            margin-left: 0 !important;
          }
        }
        
        /* Detect collapsed sidebar state */
        body:has([data-sidebar-collapsed="true"]) main {
          margin-left: 70px;
        }
        
        body:has([data-sidebar-collapsed="false"]) main {
          margin-left: 280px;
        }
      `}</style>
    </div>
  )
}

export default LayoutMenu
