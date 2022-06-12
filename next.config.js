/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) =>{
    config.module.rules.push(
      {
        loader: 'less-loader',
        options: {
          modifyVars: darkTheme,
        }
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      }
    )

    return config
  },
  reactStrictMode: true,
  images:{
    domains:
    ['192.168.188.52' , 'localhost', 'https://api.theone-web.com']
  },
  redirects:  async () => {
    return [
      {
        source: '/watch',
        destination: '/',
        permanent: true,
      },
    ]
  }
}


module.exports = {nextConfig}
