import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Login from "./login/page";

export default function Home() {
  return (
    <>
      <h1>Slack-App Clone </h1>
      <nav>
        <Login />
      </nav>
    </>
  );
}
