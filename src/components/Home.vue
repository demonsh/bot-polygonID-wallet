<script setup>
  import { onMounted, ref } from "vue";
  import { useRouter } from 'vue-router';
  import QCode from './QCode.vue';
  import {Html5Qrcode} from "html5-qrcode";
  import { ExtensionService } from "../services/Extension.service";
  import {
    approveMethod,
  } from "../services/index.js";
  import {
    PROTOCOL_CONSTANTS
  } from "@0xpolygonid/js-sdk";
  const $router = useRouter();

  const accounts = ref([]);
  const credentials = ref([]);
  const dialog = ref(false);
  const maximizedToggle = ref(true);
  const cameraId = ref(null);

  onMounted(() => {
    window.addEventListener('storage', () => {
      console.log("Change to local storage!");
      let accounts = JSON.parse(localStorage.getItem('accounts'));
      accounts.value = accounts.value || [];

    })
    let _accounts = JSON.parse(localStorage.getItem('accounts'));
    if(!_accounts || _accounts.length <= 0) {
      $router.push({ name: 'Hello' });

    } else {
      accounts.value = _accounts;
    }
    getCredentials();
  })

  const getCredentials = async () => {

  const { credWallet } = await ExtensionService.getExtensionServiceInstance();
    credentials.value = await credWallet.list();
};

// const handleCredentialDelete = async (credentialId) => {
//   const { credWallet } = ExtensionService.getExtensionServiceInstance();
//   await credWallet.remove(credentialId);
//   await getCredentials();
// };

  function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }
  function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
  }

  function stringToUint8Array(inputString) {
    const encoder = new TextEncoder();
    return encoder.encode(inputString);
  }


  async function base64(payload) {
    return await fetch(decodeURIComponent(payload))
        .then(
            (res) => {
              return res.arrayBuffer();
            }
        ).then(
            (res) => new Uint8Array(res)
        );
  }

  let html5QrCode = null;
  onMounted(() => {
    // html5QrCode = new Html5Qrcode("reader", );
  });

  const authRawRequest = ref('');
  const qrCodeSuccessCallback = async (decodedText, decodedResult) => {
    await hideQR();
    const text = {id:"230dad3e-d749-4be9-adc3-78ed1881268e",typ: PROTOCOL_CONSTANTS.MediaType.PlainMessage, type:PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE.AUTHORIZATION_REQUEST_MESSAGE_TYPE, thid:"230dad3e-d749-4be9-adc3-78ed1881268e",body:{callbackUrl:"https://issuer.polygonid.me/api/callback?sessionId=319173",reason:"test flow",scope:[]},from:"did:polygonid:polygon:mumbai:2qCh1LDVwwXcjVEQYsECkJChbNH3DoTWAdw2Ds8jYf"};
     authRawRequest.value = new TextEncoder().encode(decodedText);
  };

  const loading = ref(false);
  async function approve() {
    loading.value = true;
    console.log(authRawRequest.value);
    await approveMethod(authRawRequest.value);
    authRawRequest.value = '';
    loading.value = false;
  }
// setTimeout(() => {
//   qrCodeSuccessCallback();
// }, 1000);
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  function showScanner() {
    html5QrCode = new Html5Qrcode("reader", );
    dialog.value = true;
    Html5Qrcode.getCameras().then(devices => {
      if(devices && devices.length) {
        cameraId.value = devices[0].id;

        html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback);

      }
    }).catch(err => {
      // handle err
    });
  }
  function hideQR() {
    dialog.value = false;

    html5QrCode
        .stop()
        .then((res) => {
          html5QrCode.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
  };

</script>

<template>
  <div id="reader" v-if="dialog" :class="['reader', cameraId && 'active-render']"></div>
<!--  <q-dialog-->
<!--      v-model="dialog"-->
<!--      persistent-->
<!--      :maximized="maximizedToggle"-->
<!--  >-->
<!--    <q-card class="bg-transparent text-white">-->
<!--      <q-btn dense flat icon="close" class="close" @click="hideQR">-->
<!--        <q-tooltip class="bg-white text-primary">Close</q-tooltip>-->
<!--      </q-btn>-->
<!--      -->
<!--    </q-card>-->
<!--  </q-dialog>-->
  <div class="wrap-bg main-page">
    <div class="wrap-main" style="max-width: 400px; ">
      <div class="column justify-around full-height">
        <div class="wrap-center">
          <header>
            <q-toolbar>
              <q-avatar >
                <q-icon  name="person" color="grey-7"/>
              </q-avatar>

              <q-toolbar-title>
              </q-toolbar-title>

              <q-btn flat round dense icon="settings"  color="grey-7" />
            </q-toolbar>
          </header>
          <TransitionGroup name="list" tag="div">
          <div class="content" v-if="!authRawRequest">
            <div class="credit-card column justify-between">
              <div class="title text-white flex justify-between">
                <div>
                  <p>My data</p>
                  <span>0 credential</span>
                </div>
                <div>
                  <q-btn no-caps color="grey-10" round icon="vpn_key" />
                </div>
              </div>
              <div>
                <q-btn label="Unlock" no-caps color="grey-8" rounded />
              </div>
            </div>
            <QCode />
          </div>
          <div class="content" v-else>
            <div>
              <div class="flex justify-center">
                <q-btn icon="work" @click="approve" round size="lg" class="text-purple-4" />
              </div>
              <div class="text text-center">
                <p class="q-pt-lg text-grey-8">
                  Add your first credential to start using PolygonID
                </p>
              </div>
            </div>
            <q-btn label="Connect" :loading="loading" @click="approve" no-caps color="purple-4" size="lg" rounded />
          </div>
          </TransitionGroup>
          <footer v-if="!authRawRequest">
            <q-toolbar>
              <q-avatar>
                <q-icon name="home" color="purple"/>
              </q-avatar>
              <q-toolbar-title class="flex justify-center">
                <q-btn flat round dense icon="qr_code_scanner" @click="showScanner"  color="grey-7" />
              </q-toolbar-title>
              <q-btn flat round dense icon="notifications"  color="grey-7" />
            </q-toolbar>
          </footer>
        </div>
      </div>
    </div>
  </div>

<!--  <div>-->
<!--    <pre>-->
<!--      {{credentials}}-->
<!--    </pre>-->
<!--  </div>-->

</template>

<style lang="scss">
//.active-render {
//  opacity: 1 !important;
//  visibility: visible !important;
//  position: absolute !important;
//}
//#reader {
//  width: 400px;
//  height: 400px;
//  @media (max-width: 768px) {
//    width: 100vw;
//    height: 100vh;
//  }
//  //position: fixed !important;
//}
//.reader {
//  width: 400px;
//  height: 400px;
//  @media (max-width: 768px) {
//    width: 100vh;
//    height: 100vh;
//  }
//  //position: fixed;
//  top: 0;
//  right: 0;
//  bottom: 0;
//  left: 0;
//  //visibility: hidden;
//  //opacity: 0;
//}
.main-page {
  .text {
    font-size: 20px;
    font-weight: bold;
  }
  footer, header {
    position: fixed;
    top: 20px;
    left: 15px;
    right: 15px;
  }
  footer {
    top: initial;
    bottom: 20px;
  }
  .content {
    padding: 80px 1px 2px 2px;
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .credit-card {
    border-radius: 10px;
    background: rgb(84,84,84);
    background: linear-gradient(90deg, rgb(119, 119, 119) 0%, rgb(101, 101, 101) 35%, rgb(56, 56, 56) 100%);
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    padding: 20px;
    width: 100%;
    height: 220px;
    .title {
      p {
        font-size: 20px;
      }
    }
  }
  h1  {
    display: flex;
  }
  .img {
    width: 150px;
    display: flex;

  }
  img {
    display: block;
    width: 100%;
  }
  .close {
    position: absolute;
    z-index: 1000;
    top: 20px;
    right: 20px;
  }
  .list-leave-active {
    //position: absolute;
  }
  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

}


</style>
