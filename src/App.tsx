import { ReactElement } from "react";
import "./App.css";
import { TableDetections } from "./components/TableDetections";

function App(): ReactElement {
  return (
    <div className="m-10 mb-14">
      <TableDetections />
    </div>
  );
}

export default App;
