// ==UserScript==
// @name         Segment Fault real links
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  将思否页面中的链接替换为真实地址
// @author       汪心禾
// @match        https://segmentfault.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=segmentfault.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

/// <reference types="greasemonkey" />

"use strict";

/** @param {IntersectionObserverEntry[]} entries  */
function onIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      GM.xmlHttpRequest({
        url: entry.target.getAttribute("href"),
        onload(response) {
          entry.target.setAttribute(
            "href",
            response.responseXML
              .querySelector("[data-url]")
              .getAttribute("data-url"),
          );
        },
      });
    }
  });
}

const observer = new IntersectionObserver(onIntersection);

/** @param {Element} element */
function observeAllLinks(element) {
  element
    .querySelectorAll('[href^="https://link.segmentfault.com/?enc="]')
    .forEach((e) => observer.observe(e));
}

observeAllLinks(document.body);
document.body.addEventListener("DOMNodeInserted", (event) => {
  if (event.target && event.target.nodeType !== Node.TEXT_NODE) {
    observeAllLinks(event.target);
  }
});
