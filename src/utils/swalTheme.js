export function getSwalTheme() {
    const theme = localStorage.getItem("theme") || "dark"
  
    if (theme === "light") {
      return {
        background: "#ffffff",
        color: "#0f172a", // slate-900
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#64748b", // slate-500
        backdrop: "rgba(0,0,0,0.4)"
      }
    }
  
    // dark mode
    return {
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#334155",
      backdrop: "rgba(2,6,23,0.8)"
    }
  }
  