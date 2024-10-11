<template>
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__wrapper" :style="wrapperStyle">
            <div class="StarDefenderButton__container" >
                <div class="StarDefenderButton__connectLine">
                    <img src="/gui/images/star-defender/connect-line.svg" />
                    <div class="StarDefenderButton__content">
                        <div class="StarDefenderButton__bg">
                            <img src="/gui/images/star-defender/bg.svg" />
                            <div class="StarDefenderButton__name" @click.stop="showStarTooltip">
                                {{ name }}
                            </div>
                            <div class="StarDefenderButton__title --bold" @click="handleClick">
                                {{ title }}
                            </div>
                            <div class="StarDefenderButton__online exo2-font">
                                on line: 4000469
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { StarScreenPosition } from '@/models';

export default defineComponent({
    name: 'StarDefenderButton',
    props: {
        starId: {
            type: Number,
        },
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        position: {
            type: Object as PropType<StarScreenPosition>,
        },
    },
    computed: {
        wrapperStyle() {
            return {
                transform: `translate(${this.position.x}px, ${this.position.y}px)`,
            };
        },
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
        showStarTooltip() {
            this.$client.onGamePlateStarNameClick(this.starId);
        },
    },
});
</script>

<style scoped src="./StarDefenderButton.css"></style>