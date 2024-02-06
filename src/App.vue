<script setup>
  import { INIT } from './constants';
  import { onMounted, ref } from "vue";
  import { ExtensionService } from './services/Extension.service';

  const inited = ref(false);

  onMounted(() => {
    const init = async () => {
      const { status } = await ExtensionService.init();
      if(status === INIT)
        inited.value = true;
      else
        console.error('Extension services cant be initialized');
    }
    init()
        .catch(error => {
          console.error(error)
          console.log(error);
        });
  });
</script>

<template>
  <router-view v-slot="{ Component }" v-if="inited">
    <Transition mode="out-in" name="fade">
      <div :key="$route.name">
        <component :is="Component" />
      </div>
    </Transition>
  </router-view>
<!--  <router-view  />-->
  <h1 v-else></h1>
</template>

<style>

</style>
