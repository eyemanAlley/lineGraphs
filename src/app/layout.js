import 'src/app/globals.css'
import { montserrat } from './fonts'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className} scroll-smooth`} >
      <body >{children}</body>
    </html>
  )
}