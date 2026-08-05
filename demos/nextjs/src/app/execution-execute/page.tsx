"use client";

import React from "react";
import DemoWidget from "~/components/demo-widget";

export default function Page() {
  return (
    <React.Fragment>
      <h1>Execution: execute</h1>

      <p>
        The widget occupies no space until <code>execute()</code> is called. The default sitekey
        forces an interactive challenge, which must become visible after executing.
      </p>

      <DemoWidget
        initialSize="normal"
        initialSiteKeyType="interactive"
        options={{ execution: "execute", appearance: "interaction-only" }}
      />
    </React.Fragment>
  );
}
