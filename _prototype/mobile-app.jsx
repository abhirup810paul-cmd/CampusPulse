/* ============================================================
   CampusPulse Mobile — mounts the app inside an iOS device frame
   Sets __forceMobile + __skipAutoMount BEFORE app.jsx runs
   (done via a regular <script> tag in the HTML head)
   ============================================================ */

function MobileRoot() {
  const [dark, setDark] = React.useState(false);

  // Mirror the app's data-theme changes onto the outer page
  React.useEffect(() => {
    const sync = () => setDark(document.documentElement.getAttribute("data-theme") === "dark");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "36px 20px 52px", gap: 22,
      background: dark
        ? "linear-gradient(165deg, #030508 0%, #0a0617 55%, #050d18 100%)"
        : "linear-gradient(165deg, #0d1025 0%, #1a0d2e 52%, #0d1a28 100%)",
      transition: "background .4s ease",
    }}>
      {/* header label */}
      <div style={{ textAlign: "center", userSelect: "none" }}>
        <Logo size={26} textColor="#fff" live={false} />
        <p className="mono" style={{ margin: "8px 0 0", fontSize: 11.5,
          color: "rgba(255,255,255,.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Mobile prototype · iOS 26
        </p>
      </div>

      {/* phone */}
      <IOSDevice dark={dark} width={402} height={874}>
        <div style={{
          height: "100%",
          paddingTop: 54,   /* clear status bar */
          paddingBottom: 28, /* clear home indicator */
          boxSizing: "border-box",
          background: "var(--bg)",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          <CampusPulseApp />
        </div>
      </IOSDevice>

      {/* hint */}
      <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,.3)",
        fontFamily: "var(--font-sans)", textAlign: "center", lineHeight: 1.6 }}>
        Sign in with Microsoft · or browse as guest<br />
        <span style={{ opacity: .7 }}>Navigate with the bottom tabs</span>
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MobileRoot />);
