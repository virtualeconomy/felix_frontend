<template>
  <div>
    <i
      class="el-icon-arrow-left"
      @click="$router.go(-1)"
      style="color:#FB8809;font-size:20px;font-weight:600; cursor:pointer"
    ><span style="font-family:sen-light!important;">back</span></i>
    <div style="margin-top:39px">MINT SELECTION</div>
    <div class="scroll_container">
      <div v-for="(item, index) in $store.state.app.words" :key="index" class="mint_words">
          <h3 style="color:#FB8809;">{{ item.word.toUpperCase() }}</h3>
          <!-- <span >8 VSYS</span> -->
      </div>
      <!-- <div class="mint_words"  style="padding-bottom:20px">
        <span style="font-size:20px;font-weight:bold">MINT FEES</span>
        <span style="font-size:15px;font-weight:bold">0.3 VSYS</span>
      </div> -->
    </div>
    <!-- <div class="mint_words" style="z-index: 2;">
        Total Price
        <div style="font-size:40px;color:#FB8809;">{{$store.state.app.words.length * 8 + 0.3}} VSYS</div>
    </div> -->
    <div class="mint_tips" style="margin-top:100px;">After you click MINT, your selection will be stored on the chain.</div>
    <div class="mint_tips">Click MINT to continue</div>
    <div class="mint_btn" @click="mintNFT">MINT</div>
    <!-- <div class="base-button" @click="$router.push('/settings/saved_words')" style="margin-top:20px; cursor:pointer">VIEW YOUR SAVED WORDS</div> -->
  </div>
</template>

<script>
import { reqMintNft } from "@/api/index";
import BigNumber from "bignumber.js";
import { DARA_RESTRICTION } from '@/constants'

export default {
  name: 'WordFinish',
  data() {
    return {
    }
  },
  methods: {
    async mintNFT() {
        const loading = this.$loading({
          lock: true,
          text: 'PLEASE WAIT',
          background: 'rgba(0, 0, 0, 0.8)',
          customClass: 'loading_sty'
        });
        // if(this.$store.state.app.curWallet.address && this.$store.state.eth.wallet.address){
        //   try{
        //     await this.$store.dispatch(`eth/getBalance`, "0x0255af6c9f86F6B0543357baCefA262A2664f80F")
        //   }catch{
        //   }
        // }
        try {
          if (!this.$store.state.vsys.wallet.address) {
            loading.close();
            alert("TO MINT, YOU MUST CONNECT YOUR V WALLET");
          } 
          // else if (!this.$store.state.eth.wallet.address) {
          //   loading.close();
          //   alert("TO MINT, YOU MUST CONNECT YOUR METAMASK WALLET");
          // } 
          // else if (!this.$store.state.eth.wallet.amount || BigNumber(this.$store.state.eth.wallet.amount).isLessThan(DARA_RESTRICTION)) {
          //   loading.close();
          //   alert(`Balance of DARA is ${ this.$store.state.eth.wallet.amount }. You should have at least 5000 DARA to continue!`);
          // } 
          else {
            const promises = this.$store.state.app.words.map(async word => {
              let reqArg = { user_addr :this.$store.state.vsys.wallet.address ,
                            words: [word.id]
                          }
              let result = await reqMintNft(reqArg)
              return result;
            });
            const nfts = await Promise.all(promises);
            let nftRecords = JSON.parse(window.localStorage.getItem('nfts'))
            nftRecords = nftRecords ? nftRecords : []
            let newNFTs = []
            let nft = {}
            for (let i = 0; i < nfts.length; i ++) {
              const item = nfts[i]
              // let nftId = ""
              // for (let key in item["token_ids"]) {
              //   nftId = item["token_ids"] ? item["token_ids"][key] : ''
              // }
              nft = {
                // "nftId": nftId,
                "nft_creation_txid": item["db_save_txid"],
                "nft_word_ids": item["word_ids"],
                "nft_word_name": this.$store.state.app.words[this.$store.state.app.words.findIndex(idx=>idx.id === item["word_ids"][0])].word,
                "recipient": item["recipient"],
                "status": "done"
              }
              nftRecords.push(nft)
              newNFTs.push(nft)
            }
            nftRecords = JSON.stringify(nftRecords)
            window.localStorage.setItem('nfts', nftRecords)
            this.$store.commit("app/savedWords", []);
            loading.close();
            this.$router.push({ path: "/mint_success", query: { 0: newNFTs} });
            // this.$router.push("/mint_success");
          }
        } catch (error) {
          // Need to check that the word has been saved
          loading.close();
          // this.$message.error(error);
        }
    }
  }
}
</script>

<style  lang="less" >
.loading_sty .el-loading-spinner .path{
      stroke: #FB8809;
    }
.loading_sty  .el-loading-spinner .el-loading-text {
    color: #FB8809 ;
}
.mint_btn{
  background: #fb8809;
  color: white;
  font-weight: bold;
  position: relative;
  z-index: 2;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  margin: 30px 0px 12px;
  cursor: pointer;
}
.scroll_container{
  overflow-y:auto;
  z-index: 2;
  height: 400px;
}
.scroll_container::-webkit-scrollbar {
  display: none;
}
.mint_words{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;

  h3{
    font-weight: normal;
    width: 80%;
  }
  
  span{
    font-size: 17px;
  }
}
.mint_tips{
  z-index: 2;
margin-top: 20px;
}
.base-button {
  position: relative;
  z-index: 2;
  padding: 5px;
  text-align: center;
  border: 1px solid #FB8809;
  border-radius: 5px;
  color: #FB8809;
  margin: 0 12px;
}
.base-button:hover {
  color: white;
  background: #FB8809;
}
</style>