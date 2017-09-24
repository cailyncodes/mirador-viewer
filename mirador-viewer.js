"use strict";

/**
 * `mirador-viewer`
 * An encapsulation of the mirador viewer into a web component custom element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MiradorViewer extends Polymer.Element {
  constructor() {
    super();
    return this;
  }

  static get NOT_SUPPLIED_BY_USER() { return "Not Supplied By User"; }

  static get DEFAULT_WIDTH() { return "100%"; }

  static get DEFAULT_HEIGHT() { return "600px"; }

  static get is() { return "mirador-viewer"; }

  static get properties() {
    return {
      width: {
        type: String,
        value: MiradorViewer.NOT_SUPPLIED_BY_USER // default will be 100%
      },
      height: {
        type: String,
        value: MiradorViewer.NOT_SUPPLIED_BY_USER // default will be 600px
      },
      uri: String
    }
  }

  static get observers() {
    return [
      'constructViewer(uri)',
      'updateSize(width, height)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();

    this.constructViewer();
    this.updateSize();
  }

  constructViewer() {
    let data = this.uri && { "manifestUri": `${this.uri}`, "location": ""} || { "manifestUri": "", "location": ""};
    let layout = "1x1";
    let buildPath =  "./lib/mirador/mirador/";
    let windowObjects = this.uri && [{loadedManifest: `${this.uri}`}] || [{loadedManifest: ""}];

    let self = this;
    $(function() {
      console.log(self);
      Mirador({
        element: self,
        data,
        layout,
        buildPath,
        windowObjects
      });
    });
  }

  updateSize() {
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

    // let constructIFrame = function(iframe) {
    //   let iframeDoc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
    //   if (!iframeDoc) {
    //     setTimeout(constructIFrame, 500);
    //   } else {
    //     let headTag = iframeDoc.createElement("head");
    //     let bodyTag = iframeDoc.createElement("body");

    //     let headLinkTag = iframeDoc.createElement("link");
    //     let headScriptTag = iframeDoc.createElement("script");

    //     headLinkTag.href = "./lib/mirador/mirador/css/mirador-combined.css";
    //     headLinkTag.rel = "stylesheet";
    //     headScriptTag.src = "../lib/mirador/mirador/mirador.js";
    //     headScriptTag.type = "application/javascript";

    //     headTag.appendChild(headLinkTag);
    //     headTag.appendChild(headScriptTag);

    //     let bodyDivTag = iframeDoc.createElement("div");
    //     bodyDivTag.id = "viewer";
    //     let allowfullscreenAttribute = iframeDoc.createAttribute("allowfullscreen");
    //     allowfullscreenAttribute.value = "allowfullscreen";
    //     bodyDivTag.attributes.setNamedItem(allowfullscreenAttribute);

    //     let idRow = `id: "viewer"`;
    //     let dataRow = this.uri && `data: [{ "manifestUri": "${this.uri}", "location": ""}],` || `data: [{ "manifestUri": "", "location": ""}],`;
    //     let layoutRow = `layout: "1x1",`;
    //     let buildPath = `buildPath: "./lib/mirador/mirador/",`;
    //     let windowObjectsString = this.uri && `[{loadedManifest: "${this.uri}"}]` || `[{loadedManifest: ""}]`;
    //     let windowObjectsRow = `windowObjects: ${windowObjectsString},`;

    //     let bodyScriptTag = iframeDoc.createElement("script");
    //     bodyScriptTag.textContent =
    //      `var MiradorViewerNS = function() {}
    //       MiradorViewerNS.prototype.make = function() {
    //         if ('Mirador' in window) {
    //           Mirador({
    //             ${dataRow}
    //             ${layoutRow}
    //             ${buildPath}
    //             ${windowObjectsRow}
    //             ${idRow} // needs to be last so everything before it can when it's constructed have a , at the end
    //           });
    //         } else {
    //           window.setTimeout(this.make.bind(this), 500);
    //         }
    //       }

    //       new MiradorViewerNS().make();`
    //     ;

    //     bodyTag.appendChild(bodyDivTag);
    //     bodyTag.appendChild(bodyScriptTag);

    //     let htmlTag = iframeDoc.getElementsByTagName("html")[0];
    //     htmlTag.replaceChild(headTag, iframeDoc.getElementsByTagName("head")[0]);
    //     htmlTag.replaceChild(bodyTag, iframeDoc.getElementsByTagName("body")[0]);
    //   }
    // }

    // let divId = "container-" + this._viewerCount;
    // let divContainer = this.shadowRoot.getElementById(divId);

    // let iframe = divContainer.ownerDocument.createElement("iframe");
    // iframe.id = "iframe-viewer";
    // iframe.src = "javascript:true;";
    // //iframe.style = "width:100%;height:100%;border:0;";
    // iframe.style.width = "100%";
    // iframe.style.height = "100%";
    // iframe.style.border = "0";

    // let iframeDoc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
    // if (iframeDoc) {
    //   constructIFrame.call(this, iframe);
    // } else if (window.attachEvent) {
    //   iframe.attachEvent('onload', constructIFrame.bind(this, iframe));
    // } else if (window.addEventListener) {
    //   iframe.addEventListener('load', constructIFrame.bind(this, iframe), false);
    // } else {
    //   document.addEventListener('DOMContentReady', constructIFrame.bind(this, iframe), false);
    // }

    // divContainer.appendChild(iframe);

    
}

customElements.define(MiradorViewer.is, MiradorViewer);
