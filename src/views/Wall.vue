<template>
    <div class="wall">
        <Wall />
    </div>
</template>

<script>
// @ is an alias to /src
import Wall from "@/components/Wall.vue";

export default {
    name: "Home",
    components: {
        Wall
    }
};
</script>
