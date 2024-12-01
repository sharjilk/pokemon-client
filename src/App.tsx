import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "@/layout/Layout";
import React, { Suspense } from "react";

const FavoritePokemons = React.lazy(() => import("@/pages/FavoritePokemons"));
const PokemonList = React.lazy(() => import("@/pages/PokemonList"));

const App = () => {
  return (
    <>
      <Router>
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/favorites" element={<FavoritePokemons />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </>
  );
};

export default App;
