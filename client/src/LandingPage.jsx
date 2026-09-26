import Navbar from "@/components/Navbar";
import About from "@/pages/About";
import Hero from "@/pages/Hero";
import ProblemSolution from "@/pages/ProblemSolution";
import logo from "@/assets/logo-koreksi-hori.png";
import Features from "@/pages/Features";
import Footer from "./pages/Footer";

function LandingPage() {
  const items = [
    {
      label: "Projects",
      bgColor: "#1B1722",
      textColor: "#fff",
      links: [
        { label: "Problem & Solution", ariaLabel: "Problem and Solution" },
        { label: "Features", ariaLabel: "Project Features" },
      ],
    },
    {
      label: "About",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        { label: "Project", ariaLabel: "About Project" },
        { label: "Developer", ariaLabel: "About Developer" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" },
      ],
    },
  ];
  return (
    <>
      <Navbar
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
        theme="light"
      />
      <Hero></Hero>
      <ProblemSolution></ProblemSolution>
      <Features />
      <About></About>
      <Footer />
    </>
  );
}

export default LandingPage;
