<template>
  <div class="row justify-content-center">
    <div class="w-75">
      <div class="mt-2">
        <h3>Erc 721 Token holder raffle machine</h3>
        <p class="small-text">
          Enter your contract number and all NFT holders will be loaded
          automatically. NFT draws can be made one by one. The chance increases
          more according to the total number of NFTs.
        </p>
      </div>
      <div class="mt-2">
        <input
          class="form-control"
          type="text"
          v-model="contract"
          placeholder="Contract number 0x000"
        />
        <a @click="getHolders" class="btn btn-primary mt-2 w-100"
          >Load the holders</a
        >
      </div>
      <div class="mt-2" v-if="isDataOkey">
        <div class="alert alert-danger text-center">
          {{ totalentransCount }} {{ contractInfo.name }} holder ready
        </div>
        <a v-if="!rolling" class="btn-success btn w-100" @click="rollClick()">
          Draw it 🚀
        </a>
        <div v-if="hiddenName" class="alert alert-primary text-center">
          🎲 {{ nameRotation }} 🎲
        </div>
        <div
          v-if="hiddenWinner && winner !== null"
          class="alert alert-secondary text-center mt-2"
        >
          🎁 {{ winner }} 🎁
          <p>Congratulations you won</p>
        </div>
      </div>

      <div class="mt-2 mb-2">
        <ol class="list-group list-group-numbered" v-if="isDataOkey">
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-start
            "
            v-for="(item, index) in holders"
            :key="index"
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold">{{ formatWallet(item.address) }}</div>
            </div>
            <span class="badge bg-primary rounded-pill"
              >{{ item.value }} ticked</span
            >
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      rolling: false,
      hiddenName: false,
      hiddenWinner: false,
      nameRotation: '',
      winnder: null,
      ENTRANTS: [],
      network: 'https://explorer.emerald.oasis.dev',
      isDataOkey: false,
      contract: '',
      holders: null,
      contractInfo: {},
      totalentransCount: 0,
    };
  },
  mounted() {
    console.log(
      '%cEnjoy the machine',
      'color: red; background: black; font-size: 30px'
    );
  },
  methods: {
    formatWallet(address) {
      return (
        address.substr(0, 4) +
        ' .................... ' +
        address.substr(address.length - 4, 4)
      );
    },
    getHolders() {
      this.isDataOkey = false;
      this.axios
        .get(
          this.network +
            '/api?module=token&action=getTokenHolders&contractaddress=' +
            this.contract +
            '&page=1&offset=5000'
        )
        .then((data) => {
          this.holders = data.data.result;
          this.isDataOkey = true;
          this.ENTRANTS = [];

          this.holders.forEach((item) => {
            let count = item.value;
            //count = item.value > 100 ? 20 : item.value;
            for (let i = 1; i <= count; i++) {
              this.ENTRANTS.push(item.address);
            }
          });
          this.totalentransCount = this.ENTRANTS.length;
        });
      this.axios
        .get(
          this.network +
            '/api?module=token&action=getToken&contractaddress=' +
            this.contract
        )
        .then((data) => {
          this.contractInfo = data.data.result;
        });
    },
    randomName() {
      const rand = Math.floor(Math.random() * this.ENTRANTS.length);
      let name = this.ENTRANTS[rand];
      this.nameRotation = name;
    },
    rollClick() {
      this.winnder = null;
      this.rolling = true;
      this.hiddenName = true;
      this.hiddenWinner = false;

      this.setDeceleratingTimeout(this.randomName, 10, 30);

      setTimeout(() => {
        this.hiddenName = false;
        this.hiddenWinner = true;
        this.rolling = false;
        this.winner = this.nameRotation;
        this.$confetti.start();
        setTimeout(() => {
          this.$confetti.stop();
        }, 1000);
      }, 4000);
    },
    setDeceleratingTimeout(callback, factor, times) {
      const internalCallback = ((t, counter) => {
        return () => {
          if (--t > 0) {
            setTimeout(internalCallback, ++counter * factor);
            callback();
          }
        };
      })(times, 0);

      setTimeout(internalCallback, factor);
    },
  },
};
</script>
