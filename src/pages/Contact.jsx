import "../styles/Contact.css";
import logo from "../assets/logo/logo.png";

function Contact() {
  const email = "irontuskrecords513@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied to clipboard!");
    } catch {
      alert("Unable to copy email.");
    }
  };

  return (
    <main className="contact-page">
      {/* ================= HERO ================= */}

      <section className="contact-hero">
        <img
          src={logo}
          alt="Iron Tusk Records Logo"
          className="contact-logo"
        />

        <h1>Get In Touch</h1>

        <p>
          Welcome to Iron Tusk Records. We're always excited to connect with
          artists, fans, venues, promoters, and business partners.
        </p>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="contact-card">
        <h2>About Iron Tusk Records</h2>

        <p>
          Iron Tusk Records is an independent record label based in Hamilton,
          Ohio. Our mission is to discover talented artists, release great
          music, and build lasting relationships throughout the music industry.
        </p>

        <p>
          Whether you're interested in artist development, distribution,
          licensing, or business opportunities, we'd love to hear from you.
        </p>
      </section>

      {/* ================= LEADERSHIP ================= */}

<section className="contact-card">
  <h2>Leadership</h2>

  <div className="team-member">
    <h3>Eddie Michaels</h3>
    <p className="team-title">Founder & Owner</p>
  </div>

  <div className="team-member">
    <h3>Paul Rogers</h3>
    <p className="team-title">Label Manager</p>
  </div>
</section>

      

      {/* ================= CONTACT ================= */}

      <section className="contact-card">
        <h2>Contact Information</h2>

        {/* Email */}

        <div className="contact-section">
          <h3>Email</h3>

          <p>{email}</p>

          <div className="button-row">
            <a
              href={`mailto:${email}`}
              className="contact-button"
            >
              📩 Open Email
            </a>

            <button
              className="contact-button"
              onClick={copyEmail}
            >
              📋 Copy Email
            </button>
          </div>
        </div>

        <hr />

        {/* Website */}

        <div className="contact-section">
          <h3>Website</h3>

          <p>www.irontuskrecords.com</p>

          <a
            href="https://www.irontuskrecords.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button"
          >
            🌐 Visit Website
          </a>
        </div>

        <hr />

        {/* Facebook */}

        <div className="contact-section">
          <h3>Facebook</h3>

          <p>Iron Tusk Records</p>

          <a
            href="https://www.facebook.com/profile.php?id=61575959332423"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button"
          >
            📘 Visit Facebook
          </a>
        </div>
      </section>

      {/* ================= BUSINESS ================= */}

      <section className="contact-card">
        <h2>Business Inquiries</h2>

        <ul className="business-list">
          <li>Artist Distribution</li>
          <li>Music Licensing</li>
          <li>Business Partnerships</li>
          <li>Press & Media</li>
          <li>General Information</li>
        </ul>
      </section>

      {/* ================= RESPONSE ================= */}

      <section className="contact-card">
        <h2>Response Time</h2>

        <p>
          We typically respond to all inquiries within{" "}
          <strong>1–3 business days.</strong>
        </p>
      </section>

      {/* ================= THANK YOU ================= */}

      <section className="contact-footer">
        <h2>Thank You</h2>

        <p>
          Thank you for visiting Iron Tusk Records. We appreciate your support
          and look forward to connecting with artists, fans, and industry
          professionals around the world.
        </p>
      </section>
    </main>
  );
}

export default Contact;