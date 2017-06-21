/**
 * @fileoverview Externs for webcomponents polyfills
 * @externs
 */

var HTMLImports = {
  /**
   * @param {function()} callback
   */
  whenReady: function whenReady(callback) {}
};

window.HTMLImports = HTMLImports;

var ShadyDOM = {
  inUse: false,
  flush: function flush() {},

  /**
   * @param {!Node} target
   * @param {function(Array<MutationRecord>, MutationObserver)} callback
   * @return {MutationObserver}
   */
  observeChildren: function observeChildren(target, callback) {},

  /**
   * @param {MutationObserver} observer
   */
  unobserveChildren: function unobserveChildren(observer) {},

  /**
   * @param {Node} node
   */
  patch: function patch(node) {}
};

window.ShadyDOM = ShadyDOM;

var WebComponents = {};
window.WebComponents = WebComponents;

/** @type {Element} */
HTMLElement.prototype._activeElement;

/**
 * @param {HTMLTemplateElement} template
 */
HTMLTemplateElement.prototype.decorate = function (template) {};