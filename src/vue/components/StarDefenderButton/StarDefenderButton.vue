<template>
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__wrapper" ref="wrapper">
            <div class="StarDefenderButton__container" >
                <div class="StarDefenderButton__connectLine">
                    <img src="/gui/images/star-defender/connect-line.svg" />
                    <div class="StarDefenderButton__content">
                        <div class="StarDefenderButton__bg">
                            <img src="/gui/images/star-defender/bg.svg" />
                            <template v-if="selectedMenu === 'SEARCH GAME' || selectedMenu === 'PLAY WITH A BOT' || selectedMenu === 'DUEL'">
                                <div class="StarDefenderButton__name">
                                    Star Defender
                                </div>
                                <div class="StarDefenderButton__search">
                                    <h4 class="StarDefenderButton__search-title --bold">
                                        {{ displayText }}
                                    </h4>
                                    <div class="StarDefenderButton__loading">
                                        <div v-for="dot in dotsAmount" class="StarDefenderButton__dot" :class="{
                                            'is-active': dot === activeDot,
                                            'is-disabled': interval === null,
                                        }" />
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="StarDefenderButton__name" @click.stop="showStarTooltip">
                                    {{ name }}
                                </div>
                                <div class="StarDefenderButton__title --bold" @click="handleClick">
                                    {{ title }}
                                </div>
                                <div class="StarDefenderButton__online exo2-font">
                                    on line: 4000469
                                </div>
                            </template>
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
        starId: Number,
        name: String,
        title: String,
        position: Object as PropType<StarScreenPosition>,
        selectedMenu: {
            type: String
        },  
        updateInterval: {
            type: Number,
            default: 143 // second / dots amount
        },
    },
    computed: {
    displayText() {
            if ( this.selectedMenu == 'SEARCH GAME')
                return 'SEARCHING'
            else if ( this.selectedMenu == 'DUEL')
                return 'DUEL WAITING'
            else 
                return 'BOT WAITING'
        }
    },
    data() {
        return {
            activeDot: 1,
            dotsAmount: 7,
            initialTime: Date.now(),
            interval: null,
            passedTime: 0,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            animationFrame: null as number | null,
            wrapperEl: null as HTMLElement | null,
        };
    },
    mounted() {
        this.interval = setInterval(() => {
        const nextDot = this.activeDot + 1
        this.passedTime = Date.now() - this.initialTime
        this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot
        }, this.updateInterval);

        this.wrapperEl = this.$refs.wrapper as HTMLElement;
        if (this.wrapperEl && this.position) {
            this.currentX = this.position.x;
            this.currentY = this.position.y;
            this.targetX = this.position.x;
            this.targetY = this.position.y;
            this.updateTransform();
        }
    },
    watch: {
        position(newPos) {
            if (newPos) {
                this.targetX = newPos.x;
                this.targetY = newPos.y;
                this.startInterpolation();
            }
        },
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
        showStarTooltip() {
            this.$client.onGamePlateStarNameClick(this.starId);
        },
        startInterpolation() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.interpolatePosition();
        },
        interpolatePosition() {
            const speed = 0.5; 
            const threshold = 0.1; 

            const animate = () => {
                const distX = this.targetX - this.currentX;
                const distY = this.targetY - this.currentY;

                this.currentX += distX * speed;
                this.currentY += distY * speed;

                this.updateTransform();

                if (Math.abs(distX) > threshold || Math.abs(distY) > threshold) {
                    this.animationFrame = requestAnimationFrame(animate);
                } else {
                    this.currentX = this.targetX;
                    this.currentY = this.targetY;
                    this.updateTransform();
                    this.animationFrame = null;
                }
            };

            animate();
        },
        updateTransform() {
            if (this.wrapperEl) {
                this.wrapperEl.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
            }
        },
    },
    beforeUnmount() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },
    unmounted() {
        clearInterval(this.interval)
    },
});
</script>


<style scoped src="./StarDefenderButton.css"></style>