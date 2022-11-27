const Loading = (props) => {
  return (
    <section style={{ width: "60%", margin: "1rem auto", textAlign: "center" }}>
      <h1 style={{ color: "var(--mauMh3--)" }}>Đang load đê ... </h1>
      <img src="/images/dogrun.gif" alt="Loading..." />
    </section>
  );
};

export default Loading;
