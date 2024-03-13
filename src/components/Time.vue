<template>
	<div class="time">
		<div class="date">
			<span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
			<span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
			<span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
			<span class="sm-hidden">{{ currentTime.weekday }}</span>
		</div>
		<div class="text">
			<span> {{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
		</div>
	</div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/getTime";

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

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
.time {
	font-size: 1.1rem;
	text-align: center;

	.date {
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
	}

	.text {
		margin-top: 10px;
		font-size: 3.25rem;
		letter-spacing: 2px;
		font-family: "UnidreamLED";
	}
}
</style>