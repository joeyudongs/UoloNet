! function (t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var r;
        "undefined" != typeof window ? r = window : "undefined" != typeof global ? r = global : "undefined" != typeof self && (r = self), r.hull = t()
    }
}(function () {
    return function t(r, n, o) {
        function i(s, l) {
            if (!n[s]) {
                if (!r[s]) {
                    var u = "function" == typeof require && require;
                    if (!l && u) return u(s, !0);
                    if (e) return e(s, !0);
                    var h = new Error("Cannot find module '" + s + "'");
                    throw h.code = "MODULE_NOT_FOUND", h
                }
                var p = n[s] = {
                    exports: {}
                };
                r[s][0].call(p.exports, function (t) {
                    var n = r[s][1][t];
                    return i(n ? n : t)
                }, p, p.exports, t, r, n, o)
            }
            return n[s].exports
        }
        for (var e = "function" == typeof require && require, s = 0; s < o.length; s++) i(o[s]);
        return i
    }({
        1: [function (t, r) {
            function n(t) {
                var r = [];
                t.forEach(function (t) {
                    var n = this.point2CellXY(t),
                        o = n[0],
                        i = n[1];
                    void 0 === r[o] && (r[o] = []), void 0 === r[o][i] && (r[o][i] = []), r[o][i].push(t)
                }, this), this.cellPoints = function (t, n) {
                    return void 0 !== r[t] && void 0 !== r[t][n] ? r[t][n] : []
                }, this.removePoint = function (t) {
                    for (var n, o = this.point2CellXY(t), i = r[o[0]][o[1]], e = 0; e < i.length; e++)
                        if (i[e][0] === t[0] && i[e][1] === t[1]) {
                            n = e;
                            break
                        }
                    return i.splice(n, 1), i
                }
            }

            function o(t) {
                return new n(t)
            }
            n.prototype = {
                point2CellXY: function (t) {
                    var r = parseInt(t[0] / n.CELL_SIZE),
                        o = parseInt(t[1] / n.CELL_SIZE);
                    return [r, o]
                },
                rangePoints: function (t) {
                    for (var r = this.point2CellXY([t[0], t[1]]), n = this.point2CellXY([t[2], t[3]]), o = [], i = r[0]; i <= n[0]; i++)
                        for (var e = r[1]; e <= n[1]; e++) o = o.concat(this.cellPoints(i, e));
                    return o
                },
                addBorder2Bbox: function (t, r) {
                    return [t[0] - r * n.CELL_SIZE, t[1] - r * n.CELL_SIZE, t[2] + r * n.CELL_SIZE, t[3] + r * n.CELL_SIZE]
                }
            }, n.CELL_SIZE = 10, r.exports = o
        }, {}],
        2: [function (t, r) {
            "use strict";

            function n(t, r) {
                return void 0 === r ? t : t.map(function (t) {
                    var n = new Function("pt", "return [pt" + r[0] + ",pt" + r[1] + "];");
                    return n(t)
                })
            }

            function o(t, r) {
                return void 0 === r ? t : t.map(function (t) {
                    var n = new Function("pt", "var o = {}; o" + r[0] + "= pt[0]; o" + r[1] + "= pt[1]; return o;");
                    return n(t)
                })
            }

            function i(t) {
                return t.sort(function (t, r) {
                    return t[0] == r[0] ? t[1] - r[1] : t[0] - r[0]
                })
            }

            function e(t) {
                for (var r = -1 / 0, n = t.length - 1; n >= 0; n--) t[n][1] > r && (r = t[n][1]);
                return r
            }

            function s(t) {
                for (var r = [], n = 0; n < t.length; n++) {
                    for (; r.length >= 2 && u(r[r.length - 2], r[r.length - 1], t[n]) <= 0;) r.pop();
                    r.push(t[n])
                }
                return r.pop(), r
            }

            function l(t) {
                for (var r = t.reverse(), n = [], o = 0; o < r.length; o++) {
                    for (; n.length >= 2 && u(n[n.length - 2], n[n.length - 1], r[o]) <= 0;) n.pop();
                    n.push(r[o])
                }
                return n.pop(), n
            }

            function u(t, r, n) {
                return (r[0] - t[0]) * (n[1] - t[1]) - (r[1] - t[1]) * (n[0] - t[0])
            }

            function h(t, r) {
                return Math.pow(r[0] - t[0], 2) + Math.pow(r[1] - t[1], 2)
            }

            function p(t, r, n) {
                var o = [r[0] - t[0], r[1] - t[1]],
                    i = [n[0] - t[0], n[1] - t[1]],
                    e = h(t, r),
                    s = h(t, n),
                    l = o[0] * i[0] + o[1] * i[1];
                return l / Math.sqrt(e * s)
            }

            function f(t, r) {
                for (var n = 0; n < r.length - 1; n++) {
                    var o = [r[n], r[n + 1]];
                    if (!(t[0][0] === o[0][0] && t[0][1] === o[0][1] || t[0][0] === o[1][0] && t[0][1] === o[1][1]) && g(t, o)) return !0
                }
                return !1
            }

            function a(t, r) {
                var n, o, i, e;
                return t[0][0] < t[1][0] ? (n = t[0][0] - r, o = t[1][0] + r) : (n = t[1][0] - r, o = t[0][0] + r), t[0][1] < t[1][1] ? (i = t[0][1] - r, e = t[1][1] + r) : (i = t[1][1] - r, e = t[0][1] + r), [n, i, o, e]
            }

            function y(t, r, n) {
                for (var o, i, e = null, s = _, l = _, u = 0; u < r.length; u++) o = p(t[0], t[1], r[u]), i = p(t[1], t[0], r[u]), o > s && i > l && !f([t[0], r[u]], n) && !f([t[1], r[u]], n) && (s = o, l = i, e = r[u]);
                return e
            }

            function v(t, r, n, o) {
                for (var i, e, s, l, u, p = !1, f = 0; f < t.length - 1; f++)
                    if (i = [t[f], t[f + 1]], !(h(i[0], i[1]) < r)) {
                        e = 0, s = x, u = a(i, s);
                        do u = o.addBorder2Bbox(u, e), s = u[2] - u[0], l = y(i, o.rangePoints(u), t), e++; while (null === l && n > s);
                        null !== l && (t.splice(f + 1, 0, l), o.removePoint(l), p = !0)
                    }
                return p ? v(t, r, n, o) : t
            }

            function c(t, r, u) {
                var h, p, f, a, y, c = r || 20;
                return t.length < 4 ? t : (t = i(n(t, u)), p = s(t), h = l(t), f = h.concat(p), f.push(t[0]), y = Math.max(t[t.length - 1][0], e(f)) * m, a = t.filter(function (t) {
                    return f.indexOf(t) < 0
                }), o(v(f, Math.pow(c, 2), y, d(a)), u))
            }
            var g = t("./intersect.js"),
                d = t("./grid.js"),
                _ = Math.cos(90 / (180 / Math.PI)),
                x = 5,
                m = .8;
            r.exports = c
        }, {
            "./grid.js": 1,
            "./intersect.js": 3
        }],
        3: [function (t, r) {
            function n(t, r, n, o, i, e) {
                var s = (e - r) * (n - t) - (o - r) * (i - t);
                return s > 0 ? !0 : 0 > s ? !1 : !0
            }

            function o(t, r) {
                var o = t[0][0],
                    i = t[0][1],
                    e = t[1][0],
                    s = t[1][1],
                    l = r[0][0],
                    u = r[0][1],
                    h = r[1][0],
                    p = r[1][1];
                return n(o, i, l, u, h, p) !== n(e, s, l, u, h, p) && n(o, i, e, s, l, u) !== n(o, i, e, s, h, p)
            }
            r.exports = o
        }, {}]
    }, {}, [2])(2)
});
var roiUtil = function (t, r) {
    this.xm = r.x_dim[0], this.ym = r.y_dim[0], this.zm = r.z_dim[0], this.polys = new Array;
    var n = r.z_pixdim[0];
    this.zpd = n / .1, this.mx = this.get_mx(t, r)
};
roiUtil.prototype.get_xy = function (t) {
    var r = Math.round(t / this.zpd);
    return r = this.zm - r, this.mx[r]
}, roiUtil.prototype.get_xz = function (t) {
    for (var r = this.zpd, n = this.zm, o = this.mx, i = (this.ym, this.xm), e = new Array(i * n * r), s = new Array, l = 0; n * r > l; l++)
        if (l % r == 0) {
            var u = Math.round(l / r);
            u = u == n ? u - 1 : u;
            for (var h = (new Array, 0); i > h; h++) {
                var p = o[u][t * i + h];
                h % r == 0 && this.need_fill(h, t, u) && (p = 1), 1 == p && s.push([h, l])
            }
        }
    var f = this.hull_points(s, r, e),
        a = this.hull_inner_points(s, r, e, f);
    return f = f.concat(a)
}, roiUtil.prototype.get_yz = function (t) {
    for (var r = this.zpd, n = this.zm, o = this.mx, i = this.ym, e = (this.xm, new Array(i * n * r)), s = new Array, l = 0; l < this.zm * r; l++)
        if (l % r == 0) {
            var u = Math.round(l / r);
            u = u == n ? u - 1 : u;
            for (var h = (new Array, 0); i > h; h++) {
                var p = o[u][h * i + t];
                h % r == 0 && this.need_fill(t, h, u) && (p = 1), 1 == p && s.push([h, l])
            }
        }
    var f = this.hull_points(s, r, e),
        a = this.hull_inner_points(s, r, e, f);
    return f = f.concat(a)
}, roiUtil.prototype.hull_inner_points = function (t, r, n, o) {
    for (var i = new Array, e = 0; e < t.length; e++) {
        for (var s = !0, l = 0; l < o.length; l++) {
            var u = Math.sqrt((t[e][0] - o[l][0]) * (t[e][0] - o[l][0]) + (t[e][1] - o[l][1]) * (t[e][1] - o[l][1]));
            if (3 * r >= u) {
                s = !1;
                break
            }
        }
        s && i.push(t[e])
    }
    var h = this.hull_points(i, 1.1 * r, n);
    return h
}, roiUtil.prototype.hull_points = function (t, r) {
    for (var n = hull(t, 3 * r), o = new Array, i = new Array, e = 0; e < n.length; e++)
        if (e != n.length - 1) {
            var s = Math.sqrt((n[e][0] - n[e + 1][0]) * (n[e][0] - n[e + 1][0]) + (n[e][1] - n[e + 1][1]) * (n[e][1] - n[e + 1][1]));
            3 * r > s ? i.push(n[e], n[e + 1]) : o.push(e, e + 1)
        } else i.push(n[e], n[0]);
    for (; o.length > 0;)
        for (var l = o.pop(), e = 0; e < o.length; e++) {
            var s = Math.sqrt((n[l][0] - n[o[e]][0]) * (n[l][0] - n[o[e]][0]) + (n[l][1] - n[o[e]][1]) * (n[l][1] - n[o[e]][1]));
            if (3 * r > s) {
                i.push(n[l], n[o[e]]), o.splice(e, 1);
                break
            }
        }
    return i
}, roiUtil.prototype.split_lines = function () {
    for (var t = 0; t < ls1.length; t++) ls1[t].st.ref < 2 ? itp.push(ls1[t]) : ls1[t].st.x != ls1[t].et.x && ls1[t].st.y != ls1[t].et.y && ls1[t].et.ref < 2 && itp.push(ls1[t])
}, roiUtil.prototype.dumpbreakP = function (t) {
    for (var r = 0; r < t.length; r++) t[r].st.ref < 2 && console.log(t[r].st), t[r].st.x != t[r].et.x && t[r].st.y != t[r].et.y && t[r].et.ref < 2 && console.log(t[r].et)
}, roiUtil.prototype.need_fill = function (t, r, n) {
    var o = {
        x: t,
        y: r
    };
    if (!this.polys[n]) return !1;
    if (this.polys[n + 1] && this.polys[n - 1]) {
        var i = this.getPolygonsLength(this.polys[n]),
            e = this.getPolygonsLength(this.polys[n + 1]),
            s = this.getPolygonsLength(this.polys[n - 1]),
            l = i > e ? i / 2 > i - e : e / 2 > e - i,
            u = i > s ? i / 2 > i - s : s / 2 > s - i;
        if (i > 1 && e > 1 && l && this.pointInPolygons(this.polys[n], o) && !this.pointInPolygons(this.polys[n + 1], o)) return !0;
        if (i > 1 && s > 1 && u && this.pointInPolygons(this.polys[n], o) && !this.pointInPolygons(this.polys[n - 1], o)) return !0
    } else if (this.pointInPolygons(this.polys[n], o)) return !0;
    return !1
}, roiUtil.prototype.getPolygonsLength = function (t) {
    for (var r = 0, n = 0; n < t.length; n++) {
        var o = t[n];
        r += o.pts.length
    }
    return r
}, roiUtil.prototype.pointInPolygons = function (t, r) {
    for (var n = 0; n < t.length; n++) {
        var o = t[n];
        if ((void 0 == o.hole || !this.pointInPolygon(o.hole.pts, r)) && this.pointInPolygon(o.pts, r)) return !0
    }
    return !1
}, roiUtil.prototype.polygon_in_polygon = function (t, r) {
    for (var n = 0; n < r.length; n++)
        if (!this.pointInPolygon(t, r[n])) return !1;
    return !0
}, roiUtil.prototype.get_points = function (t, r, n, o) {
    var i = n - t,
        e = o - r,
        s = 2 * Math.sqrt(i * i + e * e),
        l = new Array;
    if (2 >= s) return l;
    for (var u = 1; s > u; u++) l.push([Math.round(t + u * i / s), Math.ceil(r + u * e / s)]);
    return l.push([n, o]), l
}, roiUtil.prototype.pointInPolygon = function (t, r) {
    for (var n = r.x, o = r.y, i = !1, e = 0, s = t.length - 1; e < t.length; s = e++) {
        var l = t[e].x,
            u = t[e].y,
            h = t[s].x,
            p = t[s].y,
            f = u > o != p > o && (h - l) * (o - u) / (p - u) + l > n;
        f && (i = !i)
    }
    return i
}, roiUtil.prototype.get_mx = function (t, r) {
    for (var n = r.x_dim[0], o = r.y_dim[0], i = r.z_dim[0], e = r.x_start_dicom[0], s = r.y_start_dicom[0], l = r.z_start[0], u = r.x_pixdim[0], h = r.y_pixdim[0], p = r.z_pixdim[0], f = new Array, a = 0; a < t.curve.length; a++) f[a] = t.curve[a].points[0];
    f.sort(function (t, r) {
        return t[0][2] > r[0][2] ? 1 : -1
    });
    for (var y = new Array(i), a = 0; i > a; a++) y[a] = new Array(n * o);
    for (var a = 0; a < f.length; a++) {
        curve = f[a];
        for (var v = new Array, c = 0; c < curve.length; c++) {
            var g = Math.round((curve[c][0] - e) / u),
                d = o - Math.round((curve[c][1] - s) / h),
                _ = Math.round((curve[c][2] - l) / p);
            if (y[_][d * n + g] = 1, v.push({
                    x: g,
                    y: d
                }), c < curve.length - 1)
                for (var x = Math.round((curve[c + 1][0] - e) / u), m = o - Math.round((curve[c + 1][1] - s) / h), w = this.get_points(g, d, x, m), M = 0; M < w.length; M++) y[_][w[M][1] * n + w[M][0]] = 1;
            else
                for (var x = Math.round((curve[0][0] - e) / u), m = o - Math.round((curve[0][1] - s) / h), w = this.get_points(g, d, x, m), M = 0; M < w.length; M++) y[_][w[M][1] * n + w[M][0]] = 1
        }
        var _ = Math.round((curve[0][2] - l) / p);
        if (void 0 == this.polys[_]) this.polys[_] = new Array({
            pts: v
        });
        else {
            for (var P = !1, I = 0; I < this.polys[_].length; I++)
                if (this.polygon_in_polygon(this.polys[_][I].pts, v)) {
                    this.polys[_][I].hole = {
                        pts: v
                    }, P = !0;
                    break
                }
            if (!P)
                for (var I = 0; I < this.polys[_].length; I++)
                    if (this.polygon_in_polygon(v, this.polys[_][I].pts)) {
                        var L = {
                            pts: v
                        };
                        L.hole = this.polys[_][I], this.polys[_][I] = L, P = !0;
                        break
                    }
            P || this.polys[_].push({
                pts: v
            })
        }
    }
    return y
};
