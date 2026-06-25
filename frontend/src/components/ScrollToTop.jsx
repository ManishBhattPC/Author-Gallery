import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Scroll instantly without smooth animation delay for immediate page load feel
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
