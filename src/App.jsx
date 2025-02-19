import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Browse from "./pages/Browse";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "./redux/userSlice";
import RouteGuard from "./components/RouteGuard";
import WelcomeModal from "./components/WelcomeModal";
import { getUserCredits } from "./services/creditService";
import { setCredits, setLoading } from "./redux/creditSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const { uid, email, displayName, photoURL } = user;
          
          // Set loading state while we fetch credits
          dispatch(setLoading(true));
          
          // Add user to Redux store
          dispatch(
            addUser({
              uid: uid,
              email: email,
              displayName: displayName,
              photoURL: photoURL,
            })
          );
          
          // Get user credits
          const credits = await getUserCredits(uid);
          dispatch(setCredits(credits));
        } else {
          dispatch(removeUser());
          dispatch(setCredits(0));
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="relative min-h-screen">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <RouteGuard requireAuth={false}>
                <Login />
              </RouteGuard>
            }
          />
          <Route
            path="/browse"
            element={
              <RouteGuard requireAuth={true}>
                <Browse />
              </RouteGuard>
            }
          />
          <Route
            path="/browse/:movieId"
            element={
              <RouteGuard requireAuth={true}>
                <MovieDetails />
              </RouteGuard>
            }
          />
        </Routes>
        <Footer />
        <WelcomeModal />
      </div>
    </Router>
  );
};

export default App;
