import { vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID, SCRIPT_URL, Turnstile } from "../src";
import type { RenderParameters } from "../src/turnstile";
import { DEMO_SITEKEY } from "./constants";

function resetDom() {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
}

describe("Basic setup", () => {
  beforeAll(() => {
    render(<Turnstile siteKey={DEMO_SITEKEY.pass} />);
  });

  afterAll(() => {
    resetDom();
  });

  it("renders the widget container", async () => {
    const container = document.querySelector(`#${DEFAULT_CONTAINER_ID}`);
    expect(container).toBeTruthy();
  });

  it("injects the script", async () => {
    const script = document.querySelector("script");
    expect(script).toBeTruthy();
    expect(script?.id).toBe(DEFAULT_SCRIPT_ID);
    expect(script?.src).toContain(SCRIPT_URL);
  });
});

describe("Manual script injection", () => {
  beforeAll(() => {
    render(<Turnstile injectScript={false} siteKey={DEMO_SITEKEY.pass} />);
  });

  afterAll(() => {
    resetDom();
  });

  it("renders the widget container", async () => {
    const container = document.querySelector(`#${DEFAULT_CONTAINER_ID}`);
    expect(container).toBeTruthy();
  });

  it("does not injects the script", async () => {
    const script = document.querySelector("script");
    expect(script).toBeFalsy();
  });
});

describe("Offlabel render parameters", () => {
  const renderMock = vi.fn((_container: unknown, _params: RenderParameters) => "0");

  const mockTurnstile = () => {
    const script = document.createElement("script");
    script.id = DEFAULT_SCRIPT_ID;
    document.head.appendChild(script);
    window.turnstile = { render: renderMock, remove: vi.fn() } as unknown as Window["turnstile"];
  };

  const getRenderParams = () => renderMock.mock.calls[0][1];

  afterEach(() => {
    cleanup();
    renderMock.mockClear();
    delete window.turnstile;
    resetDom();
  });

  it("forwards the default values to turnstile.render", async () => {
    mockTurnstile();
    render(<Turnstile injectScript={false} siteKey={DEMO_SITEKEY.pass} />);
    await waitFor(() => expect(renderMock).toHaveBeenCalled());
    expect(getRenderParams()["offlabel-show-privacy"]).toBe(true);
    expect(getRenderParams()["offlabel-show-help"]).toBe(true);
  });

  it("forwards custom values to turnstile.render", async () => {
    mockTurnstile();
    render(
      <Turnstile
        injectScript={false}
        options={{ offlabelShowPrivacy: false, offlabelShowHelp: false }}
        siteKey={DEMO_SITEKEY.pass}
      />
    );
    await waitFor(() => expect(renderMock).toHaveBeenCalled());
    expect(getRenderParams()["offlabel-show-privacy"]).toBe(false);
    expect(getRenderParams()["offlabel-show-help"]).toBe(false);
  });
});
