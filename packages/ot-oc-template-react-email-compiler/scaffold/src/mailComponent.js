import React from "react";
import styles from "./styles.css";

const MailComponent = props => (
  <div style={styles[".special"]}>
    <h1>Hello {props.name}</h1>
  </div>
);

export default MailComponent;
