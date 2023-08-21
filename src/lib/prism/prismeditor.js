! function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports, require("vue")) : "function" == typeof define && define.amd ? define(["exports", "vue"], e) : e((t = t || self).PrismEditor = {}, t.Vue)
}(this, (function (t, e) {
  "use strict";
  var i = void 0 !== typeof self ? self : this;

  function s() {
    return (s = Object.assign || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];
        for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s])
      }
      return t
    }).apply(this, arguments)
  }
  e = e && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  var n = "undefined" != typeof window && navigator && /Win/i.test(navigator.platform),
    r = "undefined" != typeof window && navigator && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
    o = e.extend({
      props: {
        lineNumbers: {
          type: Boolean,
          default: !1
        },
        autoStyleLineNumbers: {
          type: Boolean,
          default: !0
        },
        readonly: {
          type: Boolean,
          default: !1
        },
        value: {
          type: String,
          default: ""
        },
        highlight: {
          type: Function,
          required: !0
        },
        tabSize: {
          type: Number,
          default: 2
        },
        insertSpaces: {
          type: Boolean,
          default: !0
        },
        ignoreTabKey: {
          type: Boolean,
          default: !1
        },
        placeholder: {
          type: String,
          default: ""
        }
      },
      data: function () {
        return {
          capture: !0,
          history: {
            stack: [],
            offset: -1
          },
          lineNumbersHeight: "20px",
          codeData: ""
        }
      },
      watch: {
        value: {
          immediate: !0,
          handler: function (t) {
            console.log(
              '这是内容1!!!!!!!!!!!!!!!!!!!'
            )
            this.codeData = t || ""
          }
        },
        content: {
          immediate: !0,
          handler: function () {
            var t = this;
            this.lineNumbers && this.$nextTick((function () {
              t.setLineNumbersHeight()
            }))
          }
        },
        lineNumbers: function () {
          var t = this;
          this.$nextTick((function () {
            t.styleLineNumbers(), t.setLineNumbersHeight()
          }))
        }
      },
      computed: {
        isEmpty: function () {
          return 0 === this.codeData.length
        },
        content: function () {
          console.log("this.codeData",this.highlight)
          return this.highlight(this.codeData) + "<br />"
        },
        lineNumbersCount: function () {
          return this.codeData.split(/\r\n|\n/).length
        }
      },
      mounted: function () {
        this._recordCurrentState(), this.styleLineNumbers()
      },
      methods: {
        setLineNumbersHeight: function () {
          this.lineNumbersHeight = getComputedStyle(this.$refs.pre).height
        },
        styleLineNumbers: function () {
          if (this.lineNumbers && this.autoStyleLineNumbers) {
            var t = this.$refs.pre,
              e = this.$el.querySelector(".prism-editor__line-numbers"),
              i = window.getComputedStyle(t);
              console.log(i,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

            this.$nextTick((function () {
              var s = "border-top-left-radius",
                n = "border-bottom-left-radius";
              e && (e.style[s] = i[s], e.style[n] = i[n], t.style[s] = "0", t.style[n] = "0", ["background-color", "margin-top", "padding-top", "font-family", "font-size", "line-height"].forEach((function (t) {
                console.log('rrrrrttttttttttttttttttttttttt',t,i[t])
                e.style[t] = i[t]
              })), e.style["margin-bottom"] = "-" + i["padding-top"])
            }))
          }
        },
        _recordCurrentState: function () {
          var t = this.$refs.textarea;
          t && this._recordChange({
            value: t.value,
            selectionStart: t.selectionStart,
            selectionEnd: t.selectionEnd
          })
        },
        _getLines: function (t, e) {
          return t.substring(0, e).split("\n")
        },
        _applyEdits: function (t) {
          var e = this.$refs.textarea,
            i = this.history.stack[this.history.offset];
          i && e && (this.history.stack[this.history.offset] = s({}, i, {
            selectionStart: e.selectionStart,
            selectionEnd: e.selectionEnd
          })), this._recordChange(t), this._updateInput(t)
        },
        _recordChange: function (t, e) {
          void 0 === e && (e = !1);
          var i = this.history,
            n = i.stack,
            r = i.offset;
          if (n.length && r > -1) {
            this.history.stack = n.slice(0, r + 1);
            var o = this.history.stack.length;
            if (o > 100) {
              var a = o - 100;
              this.history.stack = n.slice(a, o), this.history.offset = Math.max(this.history.offset - a, 0)
            }
          }
          var l = Date.now();
          if (e) {
            var h = this.history.stack[this.history.offset];
            if (h && l - h.timestamp < 3e3) {
              var u, d, c = /[^a-z0-9]([a-z0-9]+)$/i,
                f = null === (u = this._getLines(h.value, h.selectionStart).pop()) || void 0 === u ? void 0 : u.match(c),
                p = null === (d = this._getLines(t.value, t.selectionStart).pop()) || void 0 === d ? void 0 : d.match(c);
              if (f && p && p[1].startsWith(f[1])) return void(this.history.stack[this.history.offset] = s({}, t, {
                timestamp: l
              }))
            }
          }
          this.history.stack.push(s({}, t, {
            timestamp: l
          })), this.history.offset++
        },
        _updateInput: function (t) {
          var e = this.$refs.textarea;
          e && (e.value = t.value, e.selectionStart = t.selectionStart, e.selectionEnd = t.selectionEnd, this.$emit("input", t.value))
        },
        handleChange: function (t) {
          var e = t.target,
            i = e.value;
          this._recordChange({
            value: i,
            selectionStart: e.selectionStart,
            selectionEnd: e.selectionEnd
          }, !0), this.$emit("input", i)
        },
        _undoEdit: function () {
          var t = this.history,
            e = t.offset,
            i = t.stack[e - 1];
          i && (this._updateInput(i), this.history.offset = Math.max(e - 1, 0))
        },
        _redoEdit: function () {
          var t = this.history,
            e = t.stack,
            i = t.offset,
            s = e[i + 1];
          s && (this._updateInput(s), this.history.offset = Math.min(i + 1, e.length - 1))
        },
        handleKeyDown: function (t) {
          var e = this.tabSize,
            i = this.insertSpaces,
            s = this.ignoreTabKey;
          if (!this.$listeners.keydown || (this.$emit("keydown", t), !t.defaultPrevented)) {
            27 === t.keyCode && (t.target.blur(), this.$emit("blur", t));
            var o = t.target,
              a = o.value,
              l = o.selectionStart,
              h = o.selectionEnd,
              u = (i ? " " : "\t").repeat(e);
            if (9 === t.keyCode && !s && this.capture)
              if (t.preventDefault(), t.shiftKey) {
                var d = this._getLines(a, l),
                  c = d.length - 1,
                  f = this._getLines(a, h).length - 1,
                  p = a.split("\n").map((function (t, e) {
                    return e >= c && e <= f && t.startsWith(u) ? t.substring(u.length) : t
                  })).join("\n");
                a !== p && this._applyEdits({
                  value: p,
                  selectionStart: d[c].startsWith(u) ? l - u.length : l,
                  selectionEnd: h - (a.length - p.length)
                })
              } else if (l !== h) {
              var y = this._getLines(a, l),
                m = y.length - 1,
                v = this._getLines(a, h).length - 1,
                g = y[m];
              this._applyEdits({
                value: a.split("\n").map((function (t, e) {
                  return e >= m && e <= v ? u + t : t
                })).join("\n"),
                selectionStart: /\S/.test(g) ? l + u.length : l,
                selectionEnd: h + u.length * (v - m + 1)
              })
            } else {
              var b = l + u.length;
              this._applyEdits({
                value: a.substring(0, l) + u + a.substring(h),
                selectionStart: b,
                selectionEnd: b
              })
            } else if (8 === t.keyCode) {
              var _ = l !== h;
              if (a.substring(0, l).endsWith(u) && !_) {
                t.preventDefault();
                var k = l - u.length;
                this._applyEdits({
                  value: a.substring(0, l - u.length) + a.substring(h),
                  selectionStart: k,
                  selectionEnd: k
                })
              }
            } else if (13 === t.keyCode) {
              if (l === h) {
                var C = this._getLines(a, l).pop(),
                  E = null == C ? void 0 : C.match(/^\s+/);
                if (E && E[0]) {
                  t.preventDefault();
                  var S = "\n" + E[0],
                    w = l + S.length;
                  this._applyEdits({
                    value: a.substring(0, l) + S + a.substring(h),
                    selectionStart: w,
                    selectionEnd: w
                  })
                }
              }
            } else if (57 === t.keyCode || 219 === t.keyCode || 222 === t.keyCode || 192 === t.keyCode) {
              var K;
              57 === t.keyCode && t.shiftKey ? K = ["(", ")"] : 219 === t.keyCode ? K = t.shiftKey ? ["{", "}"] : ["[", "]"] : 222 === t.keyCode ? K = t.shiftKey ? ['"', '"'] : ["'", "'"] : 192 !== t.keyCode || t.shiftKey || (K = ["`", "`"]), l !== h && K && (t.preventDefault(), this._applyEdits({
                value: a.substring(0, l) + K[0] + a.substring(l, h) + K[1] + a.substring(h),
                selectionStart: l,
                selectionEnd: h + 2
              }))
            } else !(r ? t.metaKey && 90 === t.keyCode : t.ctrlKey && 90 === t.keyCode) || t.shiftKey || t.altKey ? (r ? t.metaKey && 90 === t.keyCode && t.shiftKey : n ? t.ctrlKey && 89 === t.keyCode : t.ctrlKey && 90 === t.keyCode && t.shiftKey) && !t.altKey ? (t.preventDefault(), this._redoEdit()) : 77 !== t.keyCode || !t.ctrlKey || r && !t.shiftKey || (t.preventDefault(), this.capture = !this.capture) : (t.preventDefault(), this._undoEdit())
          }
        }
      },
      render: function (t) {
        var e = this,
          i = t("div", {
            attrs: {
              class: "prism-editor__line-width-calc",
              style: "height: 0px; visibility: hidden; pointer-events: none;"
            }
          }, "999"),
          s = t("div", {
            staticClass: "prism-editor__line-numbers",
            style: {
              "min-height": this.lineNumbersHeight
            },
            attrs: {
              "aria-hidden": "true"
            }
          }, [i, Array.from(Array(this.lineNumbersCount).keys()).map((function (e, i) {
            return t("div", {
              attrs: {
                class: "prism-editor__line-number token comment"
              }
            }, "" + ++i)
          }))]),
          n = t("textarea", {
            ref: "textarea",
            on: {
              input: this.handleChange,
              keydown: this.handleKeyDown,
              click: function (t) {
                e.$emit("click", t)
              },
              keyup: function (t) {
                e.$emit("keyup", t)
              },
              focus: function (t) {
                e.$emit("focus", t)
              },
              blur: function (t) {
                e.$emit("blur", t)
              }
            },
            staticClass: "prism-editor__textarea",
            class: {
              "prism-editor__textarea--empty": this.isEmpty
            },
            attrs: {
              spellCheck: "false",
              autocapitalize: "off",
              autocomplete: "off",
              autocorrect: "off",
              "data-gramm": "false",
              placeholder: this.placeholder,
              "data-testid": "textarea",
              readonly: this.readonly
            },
            domProps: {
              value: this.codeData
            }
          }),
          r = t("pre", {
            ref: "pre",
            staticClass: "prism-editor__editor",
            attrs: {
              "data-testid": "preview"
            },
            domProps: {
              innerHTML: this.content
            }
          }),
          o = t("div", {
            staticClass: "prism-editor__container"
          }, [n, r]);
        return t("div", {
          staticClass: "prism-editor-wrapper"
        }, [this.lineNumbers && s, o])
      }
    });
  t.PrismEditor = o, Object.defineProperty(t, "__esModule", {
    value: !0
  });
  let a = null;
  "undefined" != typeof window ? a = window.Vue : void 0 !== i && (a = i.Vue), a && a.component("PrismEditor", o)
}));