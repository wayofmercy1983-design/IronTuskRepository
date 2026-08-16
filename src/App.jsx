import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Releases from "./pages/Releases";
import ReleasePage from "./pages/ReleasePage";
import Shows from "./pages/Shows";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:slug" element={<ArtistProfile />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/release/:slug" element={<ReleasePage />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;