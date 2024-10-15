<template>
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__wrapper" :style="wrapperStyle">
            <div class="StarDefenderButton__container">
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
    data() {
        return {
            currentX: 0,
            currentY: 0,
            previousPosition: null as StarScreenPosition | null,
            currentPosition: null as StarScreenPosition | null,
            velocityX: 0,
            velocityY: 0,
            lastUpdateTime: Date.now(),
            animationFrame: null as number | null,
        };
    },
    computed: {
        wrapperStyle() {
            return {
                transform: `translate(${this.currentX}px, ${this.currentY}px)`,
            };
        },
    },
    watch: {
        position(newPos) {
            if (newPos) {
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.lastUpdateTime) / 1000; 

                if (this.currentPosition && deltaTime > 0) {
                    this.previousPosition = { ...this.currentPosition };

                    this.currentPosition = { ...newPos };

                    this.velocityX = (this.currentPosition.x - this.previousPosition.x) / deltaTime;
                    this.velocityY = (this.currentPosition.y - this.previousPosition.y) / deltaTime;

                    this.lastUpdateTime = currentTime;
                } else {
                    this.currentPosition = { ...newPos };
                    this.previousPosition = { ...newPos };
                    this.velocityX = 0;
                    this.velocityY = 0;
                    this.lastUpdateTime = currentTime;
                }
            }
        },
    },
    mounted() {
        if (this.position) {
            this.currentPosition = { ...this.position };
            this.previousPosition = { ...this.position };
            this.currentX = this.position.x;
            this.currentY = this.position.y;
            this.lastUpdateTime = Date.now();
        }

        this.animate();
    },
    beforeUnmount() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
        showStarTooltip() {
            this.$client.onGamePlateStarNameClick(this.starId);
        },
        animate() {
            this.interpolatePosition();
            this.animationFrame = requestAnimationFrame(this.animate);
        },
        interpolatePosition() {
            const currentTime = Date.now();
            const deltaTime = (currentTime - this.lastUpdateTime) / 1000; 

            const predictedX = this.currentPosition.x + this.velocityX * deltaTime;
            const predictedY = this.currentPosition.y + this.velocityY * deltaTime;

            const smoothingFactor = 0.1; 
            this.currentX += (predictedX - this.currentX) * smoothingFactor;
            this.currentY += (predictedY - this.currentY) * smoothingFactor;
        },
    },
});
</script>

<style scoped src="./StarDefenderButton.css"></style>
