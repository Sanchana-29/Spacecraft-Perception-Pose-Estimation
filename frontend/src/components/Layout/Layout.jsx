import { useState } from "react";

import TopBar from "../TopBar/TopBar";
import Sidebar from "../Sidebar/Sidebar";
import ObjectInspector from "../ObjectInspector/ObjectInspector";
import BottomControls from "../BottomControls/BottomControls";

import "./Layout.css";


function Layout({
  children,
  showInspector = true,
  showFooter = true,
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (

    <div
      className={`
        layout
        ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}
        ${showInspector ? "with-inspector" : "without-inspector"}
        ${showFooter ? "with-footer" : "without-footer"}
      `}
    >

      {/* ================================
          TOP BAR
          ================================ */}

      <header className="topbar">
        <TopBar />
      </header>


      {/* ================================
          SIDEBAR
          ================================ */}

      <aside className="sidebar">

        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

      </aside>


      {/* ================================
          MAIN CONTENT
          ================================ */}

      <main className="content">
        {children}
      </main>


      {/* ================================
          OBJECT INSPECTOR
          ================================ */}

      {showInspector && (

        <aside className="inspector">
          <ObjectInspector />
        </aside>

      )}


      {/* ================================
          BOTTOM CONTROLS
          ================================ */}

      {showFooter && (

        <footer className="footer">
          <BottomControls />
        </footer>

      )}

    </div>
  );
}


export default Layout;