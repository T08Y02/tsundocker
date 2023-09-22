const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

module.exports = {
  trailingSlash: true,
  env: {
    AUTH0_SECRET:process.env.AUTH0_SECRET,
    AUTH0_BASE_URL:process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL:process.env.AUTH0_ISSUER_BASE_URL, 
    AUTH0_CLIENT_ID:process.env.AUTH0_CLIENT_ID, 
    AUTH0_CLIENT_SECRET:process.env.AUTH0_CLIENT_SECRET,
    AUTH0_COOKIE_SECRET:process.env.AUTH0_COOKIE_SECRET,
    AUTH0_AUDIENCE:process.env.AUTH0_AUDIENCE,

  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

//module.exports = nextConfig
