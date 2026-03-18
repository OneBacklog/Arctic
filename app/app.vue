<template>
  <div>
    <NuxtLoadingIndicator color="#88C0D0" />
    <ClientOnly>
      <NuxtRouteAnnouncer />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
