<template>
    <div class="wall">
        <WallComponent />
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import WallComponent from "@/components/Wall.vue";
import Component from "vue-class-component";

@Component({ components: { WallComponent } })
export default class WallView extends Vue {
};
</script>
