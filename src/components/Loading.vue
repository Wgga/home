<template>
	<div id="loader-wrapper" :class="store.imgLoadStatus ? 'loaded' : null">
		<div class="loader">
			<div class="base">
				<div class="cube" v-for="(x, index) in cubelist" :key="index"></div>
			</div>
			<!-- <div class="loader-circle" /> -->
			<div class="loader-text">
				<span class="name">
					{{ siteName }}
				</span>
				<span class="tip"> 加载中 </span>
			</div>
		</div>
		<div class="loader-section section-left" />
		<div class="loader-section section-right" />
	</div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const cubelist = new Array(9).fill(null);

// 配置
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	overflow: hidden;

	.loader {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.loader-circle {
			width: 150px;
			height: 150px;
			border-radius: 50%;
			border: 3px solid transparent;
			border-top-color: #fff;
			animation: spin 1.8s linear infinite;
			z-index: 2;

			&:before {
				content: "";
				position: absolute;
				top: 5px;
				left: 5px;
				right: 5px;
				bottom: 5px;
				border-radius: 50%;
				border: 3px solid transparent;
				border-top-color: #a4a4a4;
				animation: spin-reverse 0.6s linear infinite;
			}

			&:after {
				content: "";
				position: absolute;
				top: 15px;
				left: 15px;
				right: 15px;
				bottom: 15px;
				border-radius: 50%;
				border: 3px solid transparent;
				border-top-color: #d3d3d3;
				animation: spin 1s linear infinite;
			}
		}

		.loader-text {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #fff;
			z-index: 2;
			margin-top: 40px;
			font-size: 24px;
			transform: translateY(150px);

			.tip {
				margin-top: 6px;
				font-size: 18px;
				opacity: 0.6;
			}
		}
	}

	.loader-section {
		position: fixed;
		top: 0;
		width: 51%;
		height: 100%;
		background: #333;
		z-index: 1;

		&.section-left {
			left: 0;
		}

		&.section-right {
			right: 0;
		}
	}

	&.loaded {
		visibility: hidden;
		transform: translateY(-100%);
		transition:
			transform 0.3s 1s ease-out,
			visibility 0.3s 1s ease-out;

		.loader {

			.loader-circle,
			.loader-text {
				opacity: 0;
				transition: opacity 0.3s ease-out;
			}

			.base {
				display: none;
			}
		}

		.loader-section {
			&.section-left {
				transform: translateX(-100%);
				transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			}

			&.section-right {
				transform: translateX(100%);
				transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			}
		}
	}

	.base {
		height: 9em;
		left: 50%;
		margin: -7.5em;
		padding: 3em;
		position: absolute;
		top: 40%;
		width: 9em;
		transform: rotateX(45deg) rotateZ(45deg);
		transform-style: preserve-3d;
		z-index: 99;
		box-sizing: initial;

		.cube,
		.cube:after,
		.cube:before {
			content: '';
			float: left;
			height: 3em;
			position: absolute;
			width: 3em;
		}

		/* Top */
		.cube {
			background-color: #E34361;
			position: relative;
			transform: translateZ(3em);
			transform-style: preserve-3d;
			transition: .25s;
			box-shadow: 13em 13em 1.5em rgba(0, 0, 0, 0.1);
			animation: anim 1s infinite;

			&:after {
				background-color: #3BB777;
				transform: rotateX(-90deg) translateY(3em);
				transform-origin: 100% 100%;
			}

			&:before {
				background-color: #3BB777;
				transform: rotateY(90deg) translateX(3em);
				transform-origin: 100% 0;
			}

			&:nth-child(1) {
				animation-delay: 0.05s;
			}

			&:nth-child(2) {
				animation-delay: 0.1s;
			}

			&:nth-child(3) {
				animation-delay: 0.15s;
			}

			&:nth-child(4) {
				animation-delay: 0.2s;
			}

			&:nth-child(5) {
				animation-delay: 0.25s;
			}

			&:nth-child(6) {
				animation-delay: 0.3s;
			}

			&:nth-child(7) {
				animation-delay: 0.35s;
			}

			&:nth-child(8) {
				animation-delay: 0.4s;
			}

			&:nth-child(9) {
				animation-delay: 0.45s;
			}
		}
	}
}

@keyframes anim {
	50% {
		transform: translateZ(0.5em);
	}
}

/* @keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@keyframes spin-reverse {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(-360deg);
	}
} */
</style>
