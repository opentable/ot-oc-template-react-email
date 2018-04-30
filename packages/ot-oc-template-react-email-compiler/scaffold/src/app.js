import React from "react";
import styles from "./styles.css";

const App = props => (
  <div style={styles.special}>
    <h1>Hello {props.name}</h1>
  </div>
);

export default App;
