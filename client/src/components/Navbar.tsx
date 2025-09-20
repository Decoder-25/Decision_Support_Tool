// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Box, alpha } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { label: "Home",      path: "/page1" },
  { label: "Models",    path: "/page1" }, 
  { label: "Builder",   path: "/page2" },
  { label: "Dashboard", path: "/page3" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const onHome = pathname === "/page1";

  /* ------------------------------------------------------------------ */
  /* scroll   → blur header                                              */
  /* section → set active pill ("Home" | "Models")                      */
  /* ------------------------------------------------------------------ */
  const [scrolled, setScrolled]     = useState(false);
  const [activeSection, setActive]  = useState<"Home" | "Models">("Home");

  /* header blur */
  useEffect(() => {
    if (!onHome) return;
    const handle = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, [onHome]);

  /* section change */
  useEffect(() => {
    if (!onHome) return;

    const hero   = document.getElementById("hero-section");
    const models = document.getElementById("models-section");
    if (!hero || !models) return;                           

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero && entry.isIntersecting)   setActive("Home");
          if (entry.target === models && entry.isIntersecting) setActive("Models");
        });
      },
      { threshold: 0.3 }
    );

    io.observe(hero);
    io.observe(models);
    return () => io.disconnect();
  }, [onHome]);

  /* ------------------------------------------------------------------ */
  /* static colour logic (unchanged)                                    */
  /* ------------------------------------------------------------------ */
  const barTransparent  = onHome && !scrolled;
  const barBg           = barTransparent ? "transparent" : "#ffffff";
  const barClr          = barTransparent ? "#fff"        : "#1e1e1e";

  const textActiveColor   = barTransparent ? "#fff" : "#1e1e1e";
  const textInactiveColor = barTransparent
    ? alpha("#ffffff", 0.7)
    : "#666666";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: barBg,
        color:      barClr,
        boxShadow:  barTransparent ? "none" : "0 1px 10px rgba(0,0,0,0.06)",
        backdropFilter: barTransparent ? "none" : "blur(12px)",
        transition: "all .25s",
        zIndex:     (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: 80, px: 2 }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display:  "flex",
              gap:      4,
              px:       { xs: 3, sm: 4 },
              py:       1,
              borderRadius: 40,
              backdropFilter: "blur(4px)",
              border:   barTransparent
                ? "1px solid rgba(255,255,255,0.25)"
                : "1px solid rgba(0,0,0,0.05)",
              background: barTransparent
                ? "rgba(0,0,0,0.04)"
                : "#ffffff",
              maxWidth: 1200,
              width:    "100%",
              justifyContent: "center",
            }}
          >
            {LINKS.map(({ label, path }) => {
              /* active logic */
              const active =
                pathname === path &&
                (!onHome || label === activeSection);

              return (
                <Button
                  key={label}
                  component={Link}
                  to={path}
                  disableRipple
                  sx={{
                    textTransform: "none",
                    fontWeight:    500,
                    px:            { xs: 2, sm: 3 },
                    py:            1.2,
                    minWidth:      110,
                    borderRadius:  40,
                    fontSize:      "0.95rem",

                    color: active ? textActiveColor : textInactiveColor,

                    /* pill background */
                    backgroundColor: active
                      ? barTransparent
                        ? alpha("#ffffff", 0.20)
                        : alpha("#000000", 0.04)
                      : "transparent",

                    /* pill border */
                    border: active
                      ? `1px solid ${
                          barTransparent
                            ? alpha("#ffffff", 0.35)
                            : alpha("#000000", 0.10)
                        }`
                      : "none",

                    "&:hover": {
                      backgroundColor: active
                        ? barTransparent
                          ? alpha("#ffffff", 0.25)
                          : alpha("#000000", 0.06)
                        : barTransparent
                        ? alpha("#ffffff", 0.18)
                        : alpha("#000000", 0.04),
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
