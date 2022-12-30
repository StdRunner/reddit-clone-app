/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains: [
      "www.gravatar.com", 
      "localhost",
      "ec2-3-86-23-163.compute-1.amazonaws.com"
    ]
  }
}

module.exports = nextConfig
