import { useEffect, useRef } from "react";
import "./SceduleAside.css";

function SceduleAside({ children }) {
  const asideRef = useRef();
  useEffect(() => {
    const handleScroll = (e) =>
      asideRef.current?.classList.toggle("hidden", e.target.scrollLeft > 300)

    const app = document.querySelector(".scroll-listen-aside");

    app.addEventListener("scroll", handleScroll);

    return () => 
      app.removeEventListener("scroll", handleScroll)
  }, []);

  return (
    <div className="scedule__aside" ref={asideRef}>
      {children}
    </div>
  );
}

export default SceduleAside;
