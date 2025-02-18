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

const App = () => {
  const dispatch = useDispatch();
  const showAiSearchComponent = useSelector(
    (store) => store.aiSearch.showAiSearchComponent
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          }),
        );
      } else {
        dispatch(removeUser());
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
        {!showAiSearchComponent && <Footer />}
      </div>
    </Router>
  );
};

export default App;
