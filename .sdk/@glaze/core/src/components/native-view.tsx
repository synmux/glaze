"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { glazeNativeViewTrace } from "../utils/trace";

const ROOT_ID = "native-view-root";

export interface NativeWindow extends Window {
  animateOut?: () => void;
  cancelAnimateOut?: () => void;
  onAnimateOutComplete?: () => void;
  ResizeObserver?: typeof ResizeObserver;
}

export interface NativeViewHandle<Win extends NativeWindow> {
  resize: () => void;
  getWindow: () => Win | null;
}

type NativeViewProps<Win extends NativeWindow> = {
  ref?: React.Ref<NativeViewHandle<Win>>;
  children: React.ReactNode;
  feature: "hud" | "tooltip";
  queryParams?: Record<string, string>;
  onReady?: (window: Win) => void;
  onClose?: () => void;
};

export function NativeView<Win extends NativeWindow>({
  ref,
  children,
  feature,
  queryParams,
  onClose: onCloseProp,
  onReady: onReadyProp,
}: NativeViewProps<Win>) {
  const id = React.useId();

  const url = new URL("about:blank");
  url.searchParams.append("feature", feature);
  url.searchParams.append("id", id);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const urlStr = url.toString();
  const urlStrRef = React.useRef(urlStr);

  const childWindowRef = React.useRef<Win | null>(null);
  const lastKnownSizeRef = React.useRef<{ width: number; height: number } | null>(null);

  const onReadyRef = React.useRef(onReadyProp);
  onReadyRef.current = onReadyProp;
  const onCloseRef = React.useRef(onCloseProp);
  onCloseRef.current = onCloseProp;

  const resize = React.useCallback(() => {
    const rootRect = childWindowRef.current?.document.getElementById(ROOT_ID)?.getBoundingClientRect();
    if (!rootRect) return;
    const width = Math.ceil(rootRect.width);
    const height = Math.ceil(rootRect.height);

    if (width === 0 || height === 0) return;
    if (lastKnownSizeRef.current?.width === width && lastKnownSizeRef.current?.height === height) return;

    lastKnownSizeRef.current = { width, height };
    childWindowRef.current?.resizeTo(width, height);
  }, []);

  React.useImperativeHandle(ref, () => ({ resize, getWindow: () => childWindowRef.current }), [resize]);

  const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(
    function setup() {
      glazeNativeViewTrace("setup", { feature, id, hasFocus: typeof document !== "undefined" && document.hasFocus() });
      const childWindow: Win | null = window.open(urlStrRef.current, "") as Win | null;
      if (childWindow) {
        glazeNativeViewTrace("setup.opened", { feature, id });
        onReadyRef.current?.(childWindow);
        childWindowRef.current = childWindow;

        const base = childWindow.document.createElement("base");
        base.href = window.location.href;
        childWindow.document.head.appendChild(base);

        copyStyles(window.document, childWindow.document);

        const parentRoot = window.document.documentElement;
        const childRoot = childWindow.document.documentElement;
        childRoot.className = parentRoot.className;
        // Child windows are floating UI (tooltips, HUDs) — never window chrome,
        // so they opt out of the window background gradient.
        childRoot.classList.add("no-background");
        childRoot.style.background = "transparent";

        childWindow.onAnimateOutComplete = () => onCloseRef.current?.();

        const root = childWindow.document.createElement("div");
        root.id = ROOT_ID;
        root.style.position = "fixed";
        childWindow.document.body.appendChild(root);
        setPortalRoot(root);

        return function teardown() {
          glazeNativeViewTrace("teardown", { feature, id });
          childWindow.close();
          childWindowRef.current = null;
        };
      }

      console.warn("[NativeView] window.open returned null", {
        feature,
        url: urlStrRef.current,
      });
    },
    [feature, id],
  );

  React.useEffect(
    function handleFontReady() {
      const doc = childWindowRef.current?.document;
      if (!doc) return;

      let cancelled = false;

      waitForStylesheetLinks(doc)
        .then(() => {
          if (cancelled) return;
          ensureFontFaceRulesRegistered(doc);
          for (const face of doc.fonts) face.load().catch(() => {});
          return doc.fonts.ready;
        })
        .then(() => {
          if (!cancelled) resize();
        })
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    },
    [portalRoot, resize],
  );

  React.useEffect(
    function observePortalSize() {
      const childWindow = childWindowRef.current;
      if (feature !== "tooltip" || !portalRoot || !childWindow) return;

      let frame = 0;
      const resizeOnNextFrame = () => {
        if (frame !== 0) childWindow.cancelAnimationFrame(frame);
        frame = childWindow.requestAnimationFrame(() => {
          frame = 0;
          resize();
        });
      };

      const ResizeObserverCtor = childWindow.ResizeObserver ?? ResizeObserver;
      const observer = new ResizeObserverCtor(resizeOnNextFrame);
      observer.observe(portalRoot);
      resizeOnNextFrame();

      return () => {
        if (frame !== 0) childWindow.cancelAnimationFrame(frame);
        observer.disconnect();
      };
    },
    [feature, portalRoot, resize],
  );

  return portalRoot ? ReactDOM.createPortal(children, portalRoot) : null;
}
NativeView.displayName = "NativeView";

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  const styleNodes = sourceDoc.querySelectorAll<HTMLStyleElement | HTMLLinkElement>('style, link[rel="stylesheet"]');
  for (const node of styleNodes) {
    targetDoc.head.appendChild(targetDoc.importNode(node, true));
  }
}

async function waitForStylesheetLinks(doc: Document) {
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  await Promise.all(
    links.map((link) => {
      if (link.sheet) return Promise.resolve();
      return new Promise<void>((resolve) => {
        link.addEventListener("load", () => resolve(), { once: true });
        link.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
}

function ensureFontFaceRulesRegistered(doc: Document) {
  const rules: string[] = [];
  const FontFaceRuleCtor = doc.defaultView?.CSSFontFaceRule;
  for (const sheet of doc.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (FontFaceRuleCtor && rule instanceof FontFaceRuleCtor) {
          rules.push(rule.cssText);
        }
      }
    } catch {
      // cross-origin sheet
    }
  }
  if (rules.length > 0) {
    const style = doc.createElement("style");
    style.textContent = rules.join("\n");
    doc.head.appendChild(style);
  }
}
