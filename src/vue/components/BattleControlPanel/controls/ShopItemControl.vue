<template>
    <div v-if="inventoryList.length == 2" class="ShopItemControl__row">
        <div class="ShopItemControl__item" @click="handleClick(inventoryList[0])">
            <BaseControl 
            :name="itemName[inventoryList[0]]" 
            :disabled="false" 
            :active="true"
            />
        </div>
        <div class="ShopItemControl__item" @click="handleClick(inventoryList[1])">
            <BaseControl 
            :name="itemName[inventoryList[1]]" 
            :disabled="false" 
            :active="true"
            />
        </div>
    </div>

    <div v-if="inventoryList.length == 1" class="ShopItemControl__row">
        <div class="ShopItemControl__item" @click="handleClick(inventoryList[0])">
            <BaseControl 
            :name="itemName[inventoryList[0]]" 
            :disabled="false"
            :active="true"
            />
        </div>
        <div class="ShopItemControl__item">
            <BaseControl :disabled="true" />
        </div>
    </div>

    <div v-if="inventoryList.length == 0" class="ShopItemControl__row">
        <div class="ShopItemControl__item">
            <BaseControl :disabled="true" />
        </div>
        <div class="ShopItemControl__item">
            <BaseControl :disabled="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';
import { PropType } from 'vue';
import { ShopItemData } from '~/game/battle/Types';
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia';
export default {
    name: 'shopItemControl',
    components: {
        BaseControl
    },
    computed: {
        inventoryList() {
            return this.battleStore.shop.inventoryList
        },
        ...mapStores(useBattleStore)
    },
    props: {
        items: {
            type: Array as PropType<ShopItemData[]>,
        },
    },
    data() {
        return {
            itemName: ['tower', 'star', 'ship', 'linkor'],
        }
    },
    methods: {
        handleClick(itemId: number) {
            console.log('handleClick', itemId)
            this.$client.onBattleInventoryItemActivate(itemId);
        }
    }
}
</script>

<style>
.ShopItemControl__row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    pointer-events: all;
    gap: 5px;
}
</style>
