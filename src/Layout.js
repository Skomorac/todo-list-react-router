import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import TodosPage from "./views/TodosPage";

function Layout() {
  return (
    <div className="Layout">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/TodosPage/:userName" element={<TodosPage />} />
          <Route render={() => <h1>Not found!</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Layout;
