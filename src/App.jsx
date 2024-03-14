import {useState} from "react";
import "./App.css";
import PostList from "./components/postList";
function App() {
  return (
    <div>
      <h2 className="title">Post List</h2>
      <PostList />
    </div>
  );
}

export default App;
