"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MiradorViewer = function (_Polymer$Element) {
  _inherits(MiradorViewer, _Polymer$Element);

  function MiradorViewer() {
    var _ret;

    _classCallCheck(this, MiradorViewer);

    var _this = _possibleConstructorReturn(this, (MiradorViewer.__proto__ || Object.getPrototypeOf(MiradorViewer)).call(this));

    _this.__viewerCounter = MiradorViewer._counter;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MiradorViewer, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(MiradorViewer.prototype.__proto__ || Object.getPrototypeOf(MiradorViewer.prototype), "connectedCallback", this).call(this);
      this._viewerCount = this._viewerCounter;

      var constructIFrame = function constructIFrame(iframe) {
        var iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document;
        if (!iframeDoc) {
          setTimeout(constructIFrame, 500);
        } else {
          var headTag = iframeDoc.createElement("head");
          var bodyTag = iframeDoc.createElement("body");

          var headLinkTag = iframeDoc.createElement("link");
          var headScriptTag = iframeDoc.createElement("script");
          headLinkTag.href = "./bower_components/mirador-viewer/lib/mirador/mirador/css/mirador-combined.css";
          headLinkTag.rel = "stylesheet";
          headScriptTag.src = "./bower_components/mirador-viewer/lib/mirador/mirador/mirador.js";
          headScriptTag.type = "application/javascript";

          headTag.appendChild(headLinkTag);
          headTag.appendChild(headScriptTag);

          var bodyDivTag = iframeDoc.createElement("div");
          bodyDivTag.id = "viewer";
          var allowfullscreenAttribute = iframeDoc.createAttribute("allowfullscreen");
          allowfullscreenAttribute.value = "allowfullscreen";
          bodyDivTag.attributes.setNamedItem(allowfullscreenAttribute);

          var idRow = "id: \"viewer\"";
          var dataRow = this.uri && "data: [{ \"manifestUri\": \"" + this.uri + "\", \"location\": \"\"}]," || "data: [{ \"manifestUri\": \"\", \"location\": \"\"}],";
          var layoutRow = "layout: \"1x1\",";
          var buildPath = "buildPath: \"./bower_components/mirador-viewer/lib/mirador/mirador/\",";
          var windowObjectsString = this.uri && "[{loadedManifest: \"" + this.uri + "\"}]" || "[{loadedManifest: \"\"}]";
          var windowObjectsRow = "windowObjects: " + windowObjectsString + ",";

          var bodyScriptTag = iframeDoc.createElement("script");
          bodyScriptTag.textContent = "var MiradorViewerNS = function() {}\n          MiradorViewerNS.prototype.make = function() {\n            if ('Mirador' in window) {\n              Mirador({\n                " + dataRow + "\n                " + layoutRow + "\n                " + buildPath + "\n                " + windowObjectsRow + "\n                " + idRow + " // needs to be last so everything before it can when it's constructed have a , at the end\n              });\n            } else {\n              window.setTimeout(this.make.bind(this), 500);\n            }\n          }\n\n          new MiradorViewerNS().make();";

          bodyTag.appendChild(bodyDivTag);
          bodyTag.appendChild(bodyScriptTag);

          var htmlTag = iframeDoc.getElementsByTagName("html")[0];
          htmlTag.replaceChild(headTag, iframeDoc.getElementsByTagName("head")[0]);
          htmlTag.replaceChild(bodyTag, iframeDoc.getElementsByTagName("body")[0]);
        }
      };

      var divId = "container-" + this._viewerCount;
      var divContainer = this.shadowRoot.getElementById(divId);

      var iframe = divContainer.ownerDocument.createElement("iframe");
      iframe.id = "iframe-viewer";
      iframe.src = "javascript:true;";
      //iframe.style = "width:100%;height:100%;border:0;";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";

      var iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document;
      if (iframeDoc) {
        constructIFrame.call(this, iframe);
      } else if (window.attachEvent) {
        iframe.attachEvent('onload', constructIFrame.bind(this, iframe));
      } else if (window.addEventListener) {
        iframe.addEventListener('load', constructIFrame.bind(this, iframe), false);
      } else {
        document.addEventListener('DOMContentReady', constructIFrame.bind(this, iframe), false);
      }

      divContainer.appendChild(iframe);

      if (this.style.width === "") {
        if (this.width == MiradorViewer.NOT_SUPPLIED_BY_USER) {
          this.style.width = MiradorViewer.DEFAULT_WIDTH;
        } else {
          this.style.width = this.width;
        }
      } /* else {
        was set via css
        } */

      if (this.style.height === "") {
        if (this.height == MiradorViewer.NOT_SUPPLIED_BY_USER) {
          this.style.height = MiradorViewer.DEFAULT_HEIGHT;
        } else {
          this.style.height = this.height;
        }
      } /* else {
        was set via css
        } */
    }
  }, {
    key: "_viewerCounter",
    get: function get() {
      return this.__viewerCounter.toString();
    }
  }], [{
    key: "NOT_SUPPLIED_BY_USER",
    get: function get() {
      return "Not Supplied By User";
    }
  }, {
    key: "DEFAULT_WIDTH",
    get: function get() {
      return "100%";
    }
  }, {
    key: "DEFAULT_HEIGHT",
    get: function get() {
      return "600px";
    }
  }, {
    key: "is",
    get: function get() {
      return "mirador-viewer";
    }
  }, {
    key: "_counter",
    get: function get() {
      MiradorViewer.__counter = (MiradorViewer.__counter || 0) + 1;
      return MiradorViewer.__counter;
    }
  }, {
    key: "properties",
    get: function get() {
      return {
        _viewerCount: String,
        width: {
          type: String,
          value: MiradorViewer.NOT_SUPPLIED_BY_USER // default will be 100%
        },
        height: {
          type: String,
          value: MiradorViewer.NOT_SUPPLIED_BY_USER // default will be 600px
        },
        uri: String
      };
    }
  }]);

  return MiradorViewer;
}(Polymer.Element);

customElements.define(MiradorViewer.is, MiradorViewer);