<script setup>
import { WalletService } from "../services/Wallet.service.js";
import { ref } from "vue";

const input = ref({ account: '' });

async function handleClickCreateAccount() {
  const { did } = await WalletService.createWallet();

  let existingAccounts = JSON.parse(localStorage.getItem("accounts"));

  if(existingAccounts !== null || (existingAccounts?.length ?? 0) !==0){
    existingAccounts.push({name: input.value.account, did: did?.string() ?? ''});
    localStorage.setItem("accounts", JSON.stringify(existingAccounts));
  }
  else {
    localStorage.setItem('accounts',JSON.stringify([{name: input.value.account, did: did?.string() ?? ''}]));
  }
  window.dispatchEvent(new Event("storage"));
}
</script>

<template>
  <div class="q-pa-md" style="max-width: 400px">
    <h3>Create a new accaunt</h3>
    <q-form
        @submit="handleClickCreateAccount"
        @reset="$router.push({ name: 'Home' })"
        class="q-gutter-md"
    >
      <q-input
          filled
          v-model="input.account"
          label="Your name *"
          hint="Name"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<style scoped>

</style>
