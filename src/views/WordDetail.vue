<template>
  <div>
    <i
      class="el-icon-arrow-left"
      @click="$router.push('/')"
      style="color:#FB8809;font-size:20px;font-weight:600;cursor:pointer"
    ><span style="font-family:sen-light!important;">search</span></i>
    <div class="scroll_container">
      <div style="display:flex;align-items:baseline">
        <h1>{{ word.word }}</h1>&nbsp;&nbsp;
        <!-- <i class="el-icon-star-off" style="color:black;"></i> -->
      </div>
      <div style="word-wrap: break-word;word-break: break-all;">
        <span
          style="color:#FB8809;"
          v-for="(item,index) in lexical_category"
          :key="index"
        >{{ item }}&nbsp;</span>
        <h3>DEFINITIONS</h3>
        <div style="min-height:500px;">
          <div
            style="position:relative;z-index:2;font-family:sen-light"
            v-for="(item, index) in wordDetail"
            :key="item.id"
            v-html="`${index + 1}. ${formatDefinition(item.definition)}`"
          ></div>
          <div class="tx_id" v-if="isSaved">
                <span class="id_title">TXID:</span>
                <span class="id_text" @click="txInfo(word.blockchainhash)">{{word.blockchainhash.slice(0, 15) + "..." + word.blockchainhash.slice(-10)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="$router.push('/')"
      class="base-add-button"
      style="border:1px solid #000;color:#000;"
      v-if="isSaved"
    >WORD IS ALREADY NFT</div>
    <div @click="addWord" class="base-add-button" v-else>ADD WORD TO LIST FOR NFTs</div>
    <div @click="save" class="base-button" v-if="!isSaved">MINT NOW</div>
  </div>
</template>

<script>
import { reqLemmaWord } from "@/api/index";
import BigNumber from "bignumber.js";

export default {
  name: "WordDetail",
  data() {
    return {
      wordDetail: [],
      word: "",
      isSaved: false
    };
  },
  computed: {
    selectedArray: {
      get() {
        return this.$store.state.app.words;
      },
      set(v) {
        return v;
      }
    },
    lexical_category() {
      var array = [];
      for (var i = 0; i < this.wordDetail.length; i++) {
        if (array.indexOf(this.wordDetail[i].lexical_category) === -1) {
          array.push(this.wordDetail[i].lexical_category);
        }
      }
      return array;
    }
  },
  watch: {
    $route: {
      async handler() {
        if (this.$router.currentRoute.name === "Detail") {
          this.word = JSON.parse(this.$route.query[0]);
          this.isSaved = false;
          if (this.word && (this.word.blockchainhash || this.word.isMinted)) {
            this.isSaved = true;
          }
          this.wordDetail = await reqLemmaWord(this.word.word);
        }
      },
      immediate: true
    }
  },
  methods: {
    formatDefinition(str) {
      // return str.replace( /\''(.*?)\''/ig,function(item){return `<span style="color:blue;cursor:pointer">${item.substr(1, item.length-3).split('|')[1]}</span>`})
      var str = str.replace( /\''(.*?)\''/ig,function(item){return `<span style="color:blue">${item.substr(1, item.length-3).split('|')[1]}</span>`})
      if(/^[a-zA-Z]+$/.test(str.charAt(0))) return str.charAt(0).toUpperCase()+str.slice(1)
      else return str
    },
    save() {
      this.$store.commit("app/savedWords", [this.word]);
      // this.$router.push("/word_pay");
      this.$router.push("/word_finish");
    },
    addWord() {
      if (
        this.selectedArray.length < 10 &&
        !this.selectedArray.find(value => value.id === this.word.id)
      ) {
        this.selectedArray.push(this.word);
        this.$router.push({
          path: "/",
          query: {
            menu: "save"
          }
        });
      } else {
        alert("Maximum storage is 10");
      }
    },
    txInfo(txId) {
        let EXPLORER = 'https://explorer.v.systems'
        let TEST_EXPLORER = 'https://testexplorer.v.systems'
        let TX_URL = '/transactions/'
        let url = this.$store.state.vsys.wallet.net === 'testnet' ? TEST_EXPLORER : EXPLORER
        window.open(url + TX_URL + txId)
    }
  }
};
</script>

<style lang="less" scoped>
.base-button {
  position: relative;
  z-index: 2;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  margin: 0 12px;
  background: #fb8809;
  color: white;
  cursor: pointer;
}

.base-add-button {
  position: relative;
  z-index: 2;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  margin: 0 12px;
  color: #fb8809;
  cursor: pointer;
  border: 1px solid #fb8809;
  margin-bottom: 10px;
}

.scroll_container{
  overflow-y:auto;
  z-index: 2;
  height: 600px;
  margin-bottom: 50px;
}

.scroll_container::-webkit-scrollbar {
  display: none;
}

.tx_id{
    font-size: 15px;
    font-weight: bold;
    margin: 20px 0;

  .id_title{
    color: #000000;
  }

  .id_text{
    color: #fb8809;
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
