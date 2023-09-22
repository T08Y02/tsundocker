import '@/styles/globals.css'
import {UserProvider} from '@auth0/nextjs-auth0/client';
import {NextUIProvider} from '@nextui-org/react'
import { Auth0Provider } from '@auth0/auth0-react';

import {ThemeProvider as NextThemesProvider} from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
              domain={process.env.AUTH0_ISSUER_BASE_URL}
              clientId={process.env.AUTH0_CLIENT_ID}
    >
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <UserProvider>
         <Component {...pageProps} />
         </UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
    </Auth0Provider>
  )
}

export default MyApp;