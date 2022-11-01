import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { AuthProvider } from '../context/auth';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }: AppProps) {

  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;
  
  return <AuthProvider>
    <NavBar />
    <div className="pt-16">
      <Component {...pageProps} />
    </div>
  </AuthProvider>
}

export default MyApp
