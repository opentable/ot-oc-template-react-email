import React from "react";
import { withSettingProvider } from "ot-oc-template-react-email-compiler/utils";

import styles from "./styles.css";

const App = ({ getSetting, name }) => {
  return (
    <div style={styles[".just-special"]}>
      <h1>Hello {name}</h1>
      <ul>
        <li>component name: {getSetting("name")}</li>
        <li>component version: {getSetting("version")}</li>
        <li>registry baseUrl: {getSetting("baseUrl")}</li>
        <li>component staticPath: {getSetting("staticPath")}</li>
      </ul>
    </div>
  );
};

export default withSettingProvider(App);
