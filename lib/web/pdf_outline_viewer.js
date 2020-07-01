/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2019 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PDFOutlineViewer = void 0;

var _pdf = require("../pdf");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_TITLE = "\u2013";

var PDFOutlineViewer = /*#__PURE__*/function () {
  function PDFOutlineViewer(_ref) {
    var container = _ref.container,
        linkService = _ref.linkService,
        eventBus = _ref.eventBus;

    _classCallCheck(this, PDFOutlineViewer);

    this.container = container;
    this.linkService = linkService;
    this.eventBus = eventBus;
    this.reset();
    eventBus.on('toggleoutlinetree', this.toggleOutlineTree.bind(this));
  }

  _createClass(PDFOutlineViewer, [{
    key: "reset",
    value: function reset() {
      this.outline = null;
      this.lastToggleIsShow = true;
      this.container.textContent = '';
      this.container.classList.remove('outlineWithDeepNesting');
    }
  }, {
    key: "_dispatchEvent",
    value: function _dispatchEvent(outlineCount) {
      this.eventBus.dispatch('outlineloaded', {
        source: this,
        outlineCount: outlineCount
      });
    }
  }, {
    key: "_bindLink",
    value: function _bindLink(element, _ref2) {
      var url = _ref2.url,
          newWindow = _ref2.newWindow,
          dest = _ref2.dest;
      var linkService = this.linkService;

      if (url) {
        (0, _pdf.addLinkAttributes)(element, {
          url: url,
          target: newWindow ? _pdf.LinkTarget.BLANK : linkService.externalLinkTarget,
          rel: linkService.externalLinkRel,
          enabled: linkService.externalLinkEnabled
        });
        return;
      }

      element.href = linkService.getDestinationHash(dest);

      element.onclick = function () {
        if (dest) {
          linkService.navigateTo(dest);
        }

        return false;
      };
    }
  }, {
    key: "_setStyles",
    value: function _setStyles(element, _ref3) {
      var bold = _ref3.bold,
          italic = _ref3.italic;
      var styleStr = '';

      if (bold) {
        styleStr += 'font-weight: bold;';
      }

      if (italic) {
        styleStr += 'font-style: italic;';
      }

      if (styleStr) {
        element.setAttribute('style', styleStr);
      }
    }
  }, {
    key: "_addToggleButton",
    value: function _addToggleButton(div, _ref4) {
      var _this = this;

      var count = _ref4.count,
          items = _ref4.items;
      var toggler = document.createElement('div');
      toggler.className = 'outlineItemToggler';

      if (count < 0 && Math.abs(count) === items.length) {
        toggler.classList.add('outlineItemsHidden');
      }

      toggler.onclick = function (evt) {
        evt.stopPropagation();
        toggler.classList.toggle('outlineItemsHidden');

        if (evt.shiftKey) {
          var shouldShowAll = !toggler.classList.contains('outlineItemsHidden');

          _this._toggleOutlineItem(div, shouldShowAll);
        }
      };

      div.insertBefore(toggler, div.firstChild);
    }
  }, {
    key: "_toggleOutlineItem",
    value: function _toggleOutlineItem(root) {
      var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.lastToggleIsShow = show;

      var _iterator = _createForOfIteratorHelper(root.querySelectorAll('.outlineItemToggler')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var toggler = _step.value;
          toggler.classList.toggle('outlineItemsHidden', !show);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "toggleOutlineTree",
    value: function toggleOutlineTree() {
      if (!this.outline) {
        return;
      }

      this._toggleOutlineItem(this.container, !this.lastToggleIsShow);
    }
  }, {
    key: "render",
    value: function render(_ref5) {
      var outline = _ref5.outline;
      var outlineCount = 0;

      if (this.outline) {
        this.reset();
      }

      this.outline = outline || null;

      if (!outline) {
        this._dispatchEvent(outlineCount);

        return;
      }

      var fragment = document.createDocumentFragment();
      var queue = [{
        parent: fragment,
        items: this.outline
      }];
      var hasAnyNesting = false;

      while (queue.length > 0) {
        var levelData = queue.shift();

        var _iterator2 = _createForOfIteratorHelper(levelData.items),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var div = document.createElement('div');
            div.className = 'outlineItem';
            var element = document.createElement('a');

            this._bindLink(element, item);

            this._setStyles(element, item);

            element.textContent = (0, _pdf.removeNullCharacters)(item.title) || DEFAULT_TITLE;
            div.appendChild(element);

            if (item.items.length > 0) {
              hasAnyNesting = true;

              this._addToggleButton(div, item);

              var itemsDiv = document.createElement('div');
              itemsDiv.className = 'outlineItems';
              div.appendChild(itemsDiv);
              queue.push({
                parent: itemsDiv,
                items: item.items
              });
            }

            levelData.parent.appendChild(div);
            outlineCount++;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (hasAnyNesting) {
        this.container.classList.add('outlineWithDeepNesting');
        this.lastToggleIsShow = fragment.querySelectorAll('.outlineItemsHidden').length === 0;
      }

      this.container.appendChild(fragment);

      this._dispatchEvent(outlineCount);
    }
  }]);

  return PDFOutlineViewer;
}();

exports.PDFOutlineViewer = PDFOutlineViewer;