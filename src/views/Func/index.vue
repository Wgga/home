<template>
    <!-- 功能区域 -->
    <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="left">
                    <Hitokoto />
                    <Music v-if="playerHasId" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="right cards">
                    <Time />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="left cards">
                    <Weather />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import Music from "@/components/Music.vue";
import Hitokoto from "@/components/Hitokoto.vue";
import Weather from "@/components/Weather.vue";
import Time from "@/components/Time.vue";

const store = mainStore();

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 播放器 id
const playerHasId = import.meta.env.VITE_SONG_ID;

// 更新时间
const updateTimeData = () => {
    currentTime.value = getCurrentTime();
};

onMounted(() => {
    updateTimeData();
    timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
    clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.function {
    height: 165px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &.mobile {
        .el-row {
            .el-col {
                &:nth-of-type(1) {
                    display: contents;
                }

                &:nth-of-type(2) {
                    display: none;
                }
            }
        }
    }

    .el-row {
        height: 100%;
        width: 100%;
        margin: 0 !important;

        .el-col {
            padding-top: 10px;
            padding-bottom: 10px;

            /* &:nth-of-type(odd) {
                padding-left: 0 !important;
            }

            &:nth-of-type(even) {
                padding-right: 0 !important;
            } */

            @media (max-width: 1300px) {
                &:nth-of-type(1) {
                    display: none;
                }

                &:nth-of-type(2),
                &:nth-of-type(3) {
                    flex: 0 0 50%;
                    max-width: 50%;
                    width: 100%;
                }
            }

            @media (max-width: 850px) {
                &:nth-of-type(2) {
                    flex: none;
                    max-width: none;
                    width: 100%;
                }

                &:nth-of-type(3) {
                    display: none;
                }
            }

            /* @media (max-width: 910px) {
                &:nth-of-type(1) {
                    display: none;
                }

                &:nth-of-type(2) {
                    padding: 0 !important;
                    flex: none;
                    max-width: none;
                    width: 100%;
                }
            } */
        }

        .left,
        .right {
            width: 100%;
            height: 100%;
        }

        .right {
            display: flex;
            padding: 20px;
            align-items: center;
            justify-content: center;
            animation: fade 0.5s;
        }
    }
}
</style>
