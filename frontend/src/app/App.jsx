import { Route, Routes, useLocation } from 'react-router-dom';
import RequireSession from './RequireSession';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ReaderPage from '../pages/ReaderPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';

// Declara as páginas públicas e exige uma sessão válida para abrir o leitor.
export default function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signin"
        element={<SignInPage key={`${location.pathname}${location.search}`} />}
      />
      <Route
        path="/signup"
        element={<SignUpPage key={`${location.pathname}${location.search}`} />}
      />
      <Route element={<RequireSession />}>
        <Route path="/read" element={<ReaderPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
