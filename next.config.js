/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:
    ['192.168.188.52' , 'localhost', 'https://api.theone-web.com']
  },
}


module.exports = {nextConfig}
