const config = {
  appName: "hsroadmap",
  appDescription: "aweseomsauce",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://trajection.vercel.app",
};

export default config;
