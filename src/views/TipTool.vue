<template>
  <div class="tip-tool">
    <img
      style="width: 25px;position: absolute;color: white;top: 80px;left: 50%;transform: translateX(240px);cursor:pointer"
      @click="isShow=true"
      :src="isShow?require('@/assets/imgs/tips.png'):require('@/assets/imgs/tips_white.png')"
    />
    <div
      v-show="isShow"
      style="background:#171616;border-radius:5px;padding:8px 16px;position:absolute;top:120px;left:50%;transform:translateX(240px);width:300px;text-align:center;color:white;font-family:'sen-light';"
    >
      <div style="text-align:right;cursor:pointer">
        <img @click="isShow=false" width="16px" src="@/assets/imgs/remove_white.svg" />
      </div>
      <div style="margin-top:15px" v-html="tipTextList[currentPage]"></div>
      <div style="display:flex;justify-content:space-between;margin-top:18px">
        <i class="el-icon-arrow-left" style="cursor:pointer" @click="lastPage"></i>&nbsp;&nbsp;
        <i class="el-icon-arrow-right" style="cursor:pointer" @click="nextPage"></i>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isShow: false,
      currentPage: 0,
      tipTextList: [
        `Welcome to <span style="color:#FB8809">Felix</span>, the world's first dictionary on a blockchain. Created by The Immutable Network, word definitions can now be immortalized as unique NFTs!`,
        `Turn tips <span style="color:#FB8809">off/on</span> simply by clicking INFO icon. For fist time users we suggest that you leave tips ON.`,
        `In order to ensure everyone is able to participate you can always help this project by clicking <span style="color:#FB8809">DONATE</span> button in the footer.`,
        `<span style="color:#FB8809">BALANCE</span><br />of the project is always shown in the footer of the webapp.`,
        `For best experience we suggest using the <span style="color:#FB8809">FELIX</span> in the desktop mode`,
        `You can save up to 3 words / minute`,
        `You can save up to 10 words at once in a session`,
        `To ensure best usage of <span style="color:#FB8809">FELIX</span> we recommend connecting both, Metamask and V Wallet`
      ]
    };
  },
  created() {
    window.onresize = () => {
      if (window.innerWidth <= 500) {
        document.querySelector(".tip-tool").style.display = "none";
      } else if(!this.$route.path.includes("gallery")) {
        document.querySelector(".tip-tool").style.display = "block";
      }
    };
    document.onclick = e => {
      if (e.target.id === "felix_logo") {
        this.isShow = !this.isShow;
      }
    };
  },
  watch: {
    $route: {
      handler() {
        var tip_tool = document.querySelector(".tip-tool")
        if(tip_tool) tip_tool.style.display = this.$route.path.includes("gallery") ? "none" : "block"
      },
      immediate: true
    }
  },
  methods: {
    nextPage() {
      this.currentPage < this.tipTextList.length - 1 && ++this.currentPage;
    },
    lastPage() {
      this.currentPage > 0 && --this.currentPage;
    }
  }
};
</script>

<style lang="less" >
@media screen and(max-width: 768px) {
  .tip-tool{
    display: none !important;
  }
}
</style>
