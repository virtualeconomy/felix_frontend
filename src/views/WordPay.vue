<template>
  <div>
    <i
      class="el-icon-arrow-left"
      @click="$router.go(-1)"
      style="color:#FB8809;font-size:20px;font-weight:600;cursor:pointer"
    >back</i>
    <div style="margin-top:38px">Save the words</div>
    <div
      style="margin:18px 0;color:#FB8809"
      v-for="(item, index) in $store.state.app.words"
      :key="index"
    >{{ item.word.toUpperCase() }}</div>
    <div>Price</div>
    <div style="margin-top:19px;font-size:24px;color:#FB8809">{{$store.state.app.words.length}} VSYS</div>

    <div style="margin-top:38px;padding-right:100px;z-index:10">
      Saving this word means it will be stored on the V SYSTEMS blockchain.
      <br />
      <br />Click SAVE to continue
    </div>
    <div style="min-height:100px;flex:1"></div>

    <div class="base-button" style="cursor:pointer" @click="pay">SAVE</div>
  </div>
</template>

<script>
import { reqGetBalance, reqSaveWordId } from "@/api/index";
import BigNumber from "bignumber.js";

export default {
  name: "WordPay",
  data() {
    return {
      clickable: true
    };
  },
  methods: {
    async pay() {
      let check = window.localStorage.getItem("c")
      check = check ? check : "check"
      if (!this.$store.state.eth.wallet.address) {
        alert("TO SAVE, YOU MUST CONNECT YOUR METAMASK WALLET");
      } else if ( check === "check" && (
          !this.$store.state.eth.wallet.amount ||
          BigNumber(this.$store.state.eth.wallet.amount).isLessThan(5000))
      ) {
        alert(`Balance of DARA is ${ this.$store.state.eth.wallet.amount }. You should have at least 5000 DARA to continue!`);
      } else {
        try {
          if (!this.clickable) return;
          this.clickable = false;
          let balance = 0
          const balanceData = await reqGetBalance();
          if (balanceData) {
            let values = Object.values(balanceData)
            balance = BigNumber(values[0].balance).dividedBy(1e8)
          }
          if (
              BigNumber(balance).isGreaterThan(
                  BigNumber(this.$store.state.app.words.length)
              )
          ) {
            let response = await reqSaveWordId(
                this.$store.state.app.words.map(item => item.id)
            );
            console.log(response, 'pay')
            let words = this.$store.state.app.words
            if (!window.localStorage.getItem('save_words')){
              window.localStorage.setItem('save_words', "[]")
            }
            let save_words = JSON.parse(localStorage['save_words'])
            for (var eachWord of words){
              save_words.push(eachWord)
            }
            localStorage['save_words'] = (JSON.stringify(save_words))
            this.$router.push("/word_finish");
          } else {
            alert("Balance of address in Backend is insufficient");
          }
        } catch (error) {
          if (error.response && error.response.status === 500) {
            alert(error.response.data);
          } else {
            alert(error);
          }
        }
        this.clickable = true;
      }
    }
  }
};
</script>

<style scoped>
.base-button {
  position: relative;
  z-index: 2;
  padding: 5px;
  text-align: center;
  border: 1px solid #FB8809;
  border-radius: 5px;
  color: #FB8809;
  margin: 100px 12px 0 12px;
}
.base-button:hover {
  color: white;
  background: #FB8809;
}
</style>
