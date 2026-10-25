import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const selector = ".section-reveal, .reveal-item";
    const observed = new WeakSet();

    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(selector)
        .forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    const observeNewElements = (node = document) => {
      if (node.nodeType !== Node.ELEMENT_NODE && node !== document) return;
      if (node.matches?.(selector) && !observed.has(node)) {
        observed.add(node);
        observer.observe(node);
      }
      node.querySelectorAll?.(selector).forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
      });
    };

    observeNewElements();
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => observeNewElements(node));
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
}
