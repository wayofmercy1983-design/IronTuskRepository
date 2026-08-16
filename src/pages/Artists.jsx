export default function Artists() {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        background: "#111",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#D4AF37",
          fontSize: "3rem",
          marginBottom: "1rem",
        }}
      >
        Artists
      </h1>

      <p
        style={{
          maxWidth: "600px",
          fontSize: "1.2rem",
          color: "#ccc",
          lineHeight: "1.8",
        }}
      >
        This section is currently under construction.
        <br />
        Artist profiles and additional content will be available soon.
      </p>
    </main>
  );
}