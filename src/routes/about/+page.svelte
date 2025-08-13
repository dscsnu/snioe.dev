<script lang="ts">
    import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	let showNav = true;

    onMount(() => {
		document.body.style.overflow = 'hidden';
        document.documentElement.style.overflowY = 'hidden';
	});
</script>

<style>
	:global(body) {
		background: #000;
		color: #fff;
		margin: 0;
		font-family: system-ui, sans-serif;
        overflow: hidden;
	}

	.page-wrap {
		min-height: 100svh;
		padding: 0rem 1.25rem 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.hero {
		font: 700 clamp(2.8rem, 9vw, 5rem) / 1.05 system-ui, sans-serif;
		letter-spacing: .05em;
		background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58, #4285F4);
		background-size: 200% auto;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: heroShift 8000ms linear infinite;
		margin: 0;
	}

	.sub {
		max-width: 760px;
		font: 400 clamp(.95rem, 1.4vw, 1.05rem) / 1.6 system-ui, sans-serif;
		letter-spacing: .015em;
		margin: 1.6rem 0 0;
	}

	.extra {
		max-width: 760px;
		margin: 1.8rem 0 0;
		font: 400 clamp(.9rem, 1.25vw, 1rem) / 1.55 system-ui, sans-serif;
		color: #ddd;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
			opacity: .9;
		}
		50% {
			transform: translateY(6px);
			opacity: .45;
		}
	}

	@keyframes heroShift {
		to {
			background-position: 200% 50%;
		}
	}
</style>

<div class="page-wrap">
	<h1 class="hero">About GDSC</h1>
	<p class="sub">We design experiences where students learn by building together. Our chapters explore web, mobile, hardware, cloud, AI/ML and competitive programming while crafting events that welcome every curious mind.</p>
	<p class="extra">Beyond the code, we focus on mentorship, inclusive culture and shipping things that make campus tech energy tangible. Workshops, lightning talks, hack nights, coffee chats – a rhythm that keeps momentum real. If you're the kind who experiments, ships, iterates and memes at 2am over a feature name, you'll fit right in.</p>
</div>
<Nav visible={showNav} />
