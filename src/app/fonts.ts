import { Montserrat, Balthazar } from 'next/font/google'
 
export const montserrat = Montserrat({
    weight: ['200', '300', '400', '600', '700', '800', '900'],
    subsets: ['latin'],
    display: 'swap',
})
 
export const balthazar = Balthazar({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
})
