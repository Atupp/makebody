"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "Trunk",
  data() {
    return {
      weights: {
        benchPress: 0,
        pullUp: 0,
        inclineBenchPress: 0,
        seatedRow: 0,
        cableFly: 0,
        singleArmRow: 0
      },
      sets: {
        benchPress: 0,
        inclineBenchPress: 0,
        seatedRow: 0,
        cableFly: 0,
        singleArmRow: 0
      },
      reps: {
        benchPress: 0,
        inclineBenchPress: 0,
        seatedRow: 0,
        cableFly: 0,
        singleArmRow: 0
      },
      selectedDate: ""
    };
  },
  methods: {
    trunk_submitData() {
      if (!this.selectedDate) {
        common_vendor.index.showToast({
          title: "请先选择日期",
          icon: "none"
        });
        return;
      }
      const hasData = Object.values(this.weights).some((val) => val > 0) || Object.values(this.sets).some((val) => val > 0) || Object.values(this.reps).some((val) => val > 0);
      if (!hasData) {
        common_vendor.index.showToast({
          title: "请输入训练数据",
          icon: "none"
        });
        return;
      }
      const selectedDateTime = new Date(this.selectedDate);
      selectedDateTime.setHours(12, 0, 0, 0);
      const timestamp = selectedDateTime.toISOString();
      common_vendor.index.showModal({
        title: "确认提交",
        content: `确定要提交 ${this.selectedDate} 的训练数据吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.Ys.callFunction({
              name: "Mbody",
              data: {
                api: "trunk_submitData",
                uni_weights: this.weights,
                uni_sets: this.sets,
                uni_reps: this.reps,
                timestamp,
                date: this.selectedDate
                // 额外保存日期字符串
              }
            }).then(() => {
              common_vendor.index.showToast({
                title: "提交成功",
                icon: "success"
              });
            }).catch((err) => {
              console.error("提交失败:", err);
              common_vendor.index.showToast({
                title: "提交失败",
                icon: "none"
              });
            });
          }
        }
      });
    },
    trunk_getLastRecord() {
      if (!this.selectedDate) {
        common_vendor.index.showToast({
          title: "请先选择日期",
          icon: "none"
        });
        return;
      }
      const selectedDateTime = new Date(this.selectedDate);
      selectedDateTime.setHours(12, 0, 0, 0);
      const timestamp = selectedDateTime.toISOString();
      common_vendor.Ys.callFunction({
        name: "Mbody",
        data: {
          api: "trunk_getLastRecord",
          timestamp,
          date: this.selectedDate
        }
      }).then((res) => {
        if (res.result && res.result.data) {
          this.weights = { ...this.weights, ...res.result.data.uni_weights };
          this.sets = { ...this.sets, ...res.result.data.uni_sets };
          this.reps = { ...this.reps, ...res.result.data.uni_reps };
          common_vendor.index.showToast({
            title: "数据加载成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "该日期没有记录",
            icon: "none"
          });
        }
      }).catch((err) => {
        console.error("获取记录失败:", err);
        common_vendor.index.showToast({
          title: "获取记录失败",
          icon: "none"
        });
      });
    },
    onDateChange(e) {
      this.selectedDate = e.detail.value;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.selectedDate || "请选择日期"),
    b: $data.selectedDate,
    c: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    d: $data.weights.benchPress,
    e: common_vendor.o(($event) => $data.weights.benchPress = $event.detail.value),
    f: $data.sets.benchPress,
    g: common_vendor.o(($event) => $data.sets.benchPress = $event.detail.value),
    h: $data.reps.benchPress,
    i: common_vendor.o(($event) => $data.reps.benchPress = $event.detail.value),
    j: $data.weights.pullUp,
    k: common_vendor.o(($event) => $data.weights.pullUp = $event.detail.value),
    l: $data.reps.pullUp,
    m: common_vendor.o(($event) => $data.reps.pullUp = $event.detail.value),
    n: $data.weights.inclineBenchPress,
    o: common_vendor.o(($event) => $data.weights.inclineBenchPress = $event.detail.value),
    p: $data.sets.inclineBenchPress,
    q: common_vendor.o(($event) => $data.sets.inclineBenchPress = $event.detail.value),
    r: $data.reps.inclineBenchPress,
    s: common_vendor.o(($event) => $data.reps.inclineBenchPress = $event.detail.value),
    t: $data.weights.seatedRow,
    v: common_vendor.o(($event) => $data.weights.seatedRow = $event.detail.value),
    w: $data.sets.seatedRow,
    x: common_vendor.o(($event) => $data.sets.seatedRow = $event.detail.value),
    y: $data.reps.seatedRow,
    z: common_vendor.o(($event) => $data.reps.seatedRow = $event.detail.value),
    A: $data.weights.cableFly,
    B: common_vendor.o(($event) => $data.weights.cableFly = $event.detail.value),
    C: $data.sets.cableFly,
    D: common_vendor.o(($event) => $data.sets.cableFly = $event.detail.value),
    E: $data.reps.cableFly,
    F: common_vendor.o(($event) => $data.reps.cableFly = $event.detail.value),
    G: $data.weights.singleArmRow,
    H: common_vendor.o(($event) => $data.weights.singleArmRow = $event.detail.value),
    I: $data.sets.singleArmRow,
    J: common_vendor.o(($event) => $data.sets.singleArmRow = $event.detail.value),
    K: $data.reps.singleArmRow,
    L: common_vendor.o(($event) => $data.reps.singleArmRow = $event.detail.value),
    M: common_vendor.o((...args) => $options.trunk_submitData && $options.trunk_submitData(...args)),
    N: common_vendor.o((...args) => $options.trunk_getLastRecord && $options.trunk_getLastRecord(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
