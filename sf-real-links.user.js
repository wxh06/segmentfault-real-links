// ==UserScript==
// @name         Segment Fault 思否真实链接
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去除思否网页中的外链跳转，并将其替换为真实地址
// @author       汪心禾
// @match        https://segmentfault.com/*
// @icon         https://static.segmentfault.com/main_site_next/df1f59ce/favicon.ico
// @grant        GM.xmlHttpRequest
// @connect      link.segmentfault.com
// ==/UserScript==

/// <reference types="greasemonkey" />

"use strict";

const observer = new IntersectionObserver((entries) => {
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
          observer.unobserve(entry.target);
        },
      });
    }
  });
});

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
