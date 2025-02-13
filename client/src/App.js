import './App.css';
import React, { Component, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./routes";
import AppRoute from './routes/route';


function App() {
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<div>{route.component}</div>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AppRoute>
                {route.component}
              </AppRoute>
            }
            key={idx}
            exact={true}
          />
        ))}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
