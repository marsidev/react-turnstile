"use client";

import React from "react";
import DemoWidget from "~/components/demo-widget";

// A custom script id keeps this demo's script isolated from the other demos'.
const NONCE_VALUE = "cf-turnstile-nonce-e2e";
const NONCE_SCRIPT_ID = "turnstile-script-with-nonce";

export default function Page() {
  return (
    <React.Fragment>
      <h1>Script options - nonce</h1>

      <DemoWidget
        scriptOptions={{
          id: NONCE_SCRIPT_ID,
          nonce: NONCE_VALUE
        }}
      />
    </React.Fragment>
  );
}
