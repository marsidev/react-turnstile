import type { MockInstance } from "vitest";
import { vi } from "vitest";
import { createRef } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID, SCRIPT_URL, Turnstile } from "../src";
import type { RenderParameters } from "../src/turnstile";
import type { TurnstileInstance } from "../src/types";
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

describe("Invalid render parameters", () => {
  // Cloudflare's api.js validates the render parameters up front and throws a
  // `TurnstileError` for invalid ones (empty sitekey, unknown theme/size/appearance,
  // malformed action/cData, ...). Only failures raised after the widget is created
  // - such as a sitekey that does not exist - are reported via `error-callback`,
  // so the throw is the only signal the component gets for these.
  const turnstileError = new Error(
    '[Cloudflare Turnstile] Invalid input for parameter "sitekey", got "".'
  );

  let consoleError: MockInstance<typeof console.error>;

  const mockTurnstile = () => {
    const script = document.createElement("script");
    script.id = DEFAULT_SCRIPT_ID;
    document.head.appendChild(script);
    window.turnstile = {
      render: vi.fn(() => {
        throw turnstileError;
      }),
      remove: vi.fn()
    } as unknown as Window["turnstile"];
  };

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleError.mockRestore();
    delete window.turnstile;
    resetDom();
  });

  it("calls onError when turnstile.render rejects the parameters", async () => {
    mockTurnstile();
    const onError = vi.fn();
    render(<Turnstile injectScript={false} siteKey="" onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalledWith(turnstileError.message));
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("calls onError with dynamic callbacks too", async () => {
    mockTurnstile();
    const onError = vi.fn();
    render(
      <Turnstile injectScript={false} rerenderOnCallbackChange siteKey="" onError={onError} />
    );
    await waitFor(() => expect(onError).toHaveBeenCalledWith(turnstileError.message));
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("calls onError when the imperative render method rejects the parameters", async () => {
    mockTurnstile();
    const onError = vi.fn();
    const ref = createRef<TurnstileInstance | undefined>();
    render(<Turnstile ref={ref} injectScript={false} siteKey="" onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalled());
    onError.mockClear();

    expect(ref.current?.render()).toBeUndefined();
    expect(onError).toHaveBeenCalledWith(turnstileError.message);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("logs to console.error when onError is not provided", async () => {
    mockTurnstile();
    render(<Turnstile injectScript={false} siteKey="" />);
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith(turnstileError));
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
