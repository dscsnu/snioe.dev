<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import events from '$lib/events.json';
	interface EventItem { name:string; description:string; image:string }
	const list = events as EventItem[];
	let showNav = true;

	onMount(() => {
		document.body.style.overflow = 'auto';
		document.documentElement.style.overflowY = 'auto';
	});
</script>

<style>
	:global(body) {
		background: #000;
		color: #fff;
		margin: 0;
		font-family: system-ui, sans-serif;
		overflow-y: auto;
	}
	.page {
		min-height: 100svh;
		padding: 5.5rem clamp(1rem, 4vw, 3rem) 4rem;
	}
	.header {
		max-width: 760px;
		margin: 0 auto 2.4rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		text-align: center;
		align-items: center;
	}
	.header h1 {
		font: 700 clamp(2.8rem, 9vw, 5rem)/1.05 system-ui, sans-serif;
		letter-spacing: .05em;
		margin: 0;
		background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58, #4285F4);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		background-size: 200% auto;
		animation: heroShift 8000ms linear infinite;
	}
	.header p {
		margin: 0;
		max-width: 760px;
		font: 400 clamp(.95rem, 1.4vw, 1.05rem)/1.6 system-ui, sans-serif;
		letter-spacing: .015em;
		color: #ddd;
	}
	.grid {
		--min: 260px;
		display: grid;
		gap: 1.6rem;
		grid-template-columns: repeat(auto-fill, minmax(var(--min), 1fr));
		max-width: 1200px;
		margin: 0 auto;
	}
	.card {
		position: relative;
		background: #111;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 18px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 18px -6px rgba(0, 0, 0, 0.5);
		transition: transform .55s cubic-bezier(.16, .84, .31, 1), box-shadow .55s cubic-bezier(.16, .84, .31, 1), border-color .55s;
	}
	.card:hover,
	.card:focus-within {
		transform: translateY(-6px);
		box-shadow: 0 10px 34px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
		border-color: rgba(255, 255, 255, 0.15);
	}
	.media {
		aspect-ratio: 16/9;
		background: #222;
		position: relative;
		overflow: hidden;
	}
	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: brightness(.82) saturate(1.15);
		transition: transform 1.8s ease, filter .8s ease;
	}
	.card:hover .media img {
		transform: scale(1.08);
		filter: brightness(.95) saturate(1.25);
	}
	.content {
		padding: 1rem 1.05rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: .65rem;
	}
	.content h2 {
		font: 600 1.05rem/1.25 system-ui, sans-serif;
		letter-spacing: .04em;
		margin: 0;
	}
	.content p {
		margin: 0;
		font: 400 .8rem/1.4 system-ui, sans-serif;
		letter-spacing: .02em;
		color: #bbb;
	}
	.badge {
		position: absolute;
		top: .75rem;
		left: .75rem;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		padding: .35rem .6rem;
		font: 600 .6rem/1 system-ui, sans-serif;
		letter-spacing: .12em;
		border-radius: 999px;
		text-transform: uppercase;
		backdrop-filter: blur(6px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}
	.card::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(120deg, rgba(66, 133, 244, 0.15), rgba(219, 68, 55, 0.12), rgba(244, 180, 0, 0.12), rgba(15, 157, 88, 0.12));
		opacity: 0;
		transition: opacity .8s;
		pointer-events: none;
	}
	.card:hover::before {
		opacity: 1;
	}
	@keyframes heroShift { to { background-position: 200% 50%; } }
	@media (max-width: 700px) {
		.page {
			padding: 5rem 1rem 3.5rem;
		}
		.grid {
			gap: 1.1rem;
		}
	}
	@media (min-width: 900px) {
		.page {
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-height: 100svh;
			padding: 0 clamp(1rem, 4vw, 3rem) 4rem;
		}
	}
</style>

<div class="page">
	<section class="header">
		<h1>Events</h1>
		<p>Stuff we built, broke, debugged, shipped & memed through. A rolling slice of sessions that make the community tick.</p>
	</section>
	<div class="grid">
		{#each list as ev, i}
			<article class="card">
				<div class="media">
					<img src={ev.image} alt={ev.name} loading="lazy" />
					<span class="badge">{i+1}</span>
				</div>
				<div class="content">
					<h2>{ev.name}</h2>
					<p>{ev.description}</p>
				</div>
			</article>
		{/each}
	</div>
</div>
<Nav visible={showNav} />
