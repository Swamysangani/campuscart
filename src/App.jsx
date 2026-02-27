import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import AppRoutes from './routes';
import '@splidejs/react-splide/css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <AppRoutes />
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
