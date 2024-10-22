import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Body from "./pages/Body";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Browse from "./pages/Browse";

const App = () => {
  const showAiSearchComponent = useSelector(
    (store) => store.aiSearch.showAiSearchComponent
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Body />
          {!showAiSearchComponent && <Footer />}
        </>
      ),
      children: [
        { path: "/", element: <Login /> }, // Default route
        { path: "/browse", element: <Browse /> }, // Browse route
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
