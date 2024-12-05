"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "AT,you are a hero!"
    };
  },
  onLoad() {
  },
  methods: {
    publish() {
      common_vendor.Ys.callFunction({
        name: "Mbody",
        data: {
          content: "Hello, World!"
        }
      });
    },
    goToTrunk() {
      common_vendor.index.navigateTo({
        url: "/pages/trunk/trunk"
      });
    },
    goToLimbs() {
      common_vendor.index.navigateTo({
        url: "/pages/limb/limb"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.t($data.title),
    c: common_assets._imports_1,
    d: common_vendor.o((...args) => $options.goToTrunk && $options.goToTrunk(...args)),
    e: common_assets._imports_2,
    f: common_vendor.o((...args) => $options.goToLimbs && $options.goToLimbs(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
