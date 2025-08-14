<script context="module" lang="ts">
	export const navAnimState = { done: false };
</script>
<script lang="ts">
	export let visible = false;

	interface Link { href: string; label: string }
	const links: Link[] = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/events', label: 'Events' },
		{ href: '/team', label: 'Team' },
		{ href: '/contact', label: 'Contact' }
	];

	let drawAttention = false;
		$: if (visible && !navAnimState.done) {
			navAnimState.done = true;
		setTimeout(() => {
			drawAttention = true;
			setTimeout(() => (drawAttention = false), 1800);
		}, 160);
	}
</script>

<nav class="nav-desktop" aria-label="Main" data-visible={visible} data-attention={drawAttention}>
	<ul>
		{#each links as l}
			<li><a href={l.href}>{l.label}</a></li>
		{/each}
	</ul>
</nav>

<nav class="nav-mobile" aria-label="Main" data-visible={visible} data-attention={drawAttention}>
	<ul>
		{#each links as l}
			<li><a href={l.href}>{l.label}</a></li>
		{/each}
	</ul>
</nav>

<style>
	:global(:root) {
		--nav-bg: rgba(20,20,22,0.6);
		--nav-border: rgba(255,255,255,0.07);
		--nav-radius: 18px;
		--transition-base: 420ms cubic-bezier(.16,.84,.31,1);
	}
	.nav-desktop,
	.nav-mobile {
		pointer-events: none;
	}

	.nav-desktop[data-visible="true"],
	.nav-mobile[data-visible="true"] {
		pointer-events: auto;
	}

	.nav-desktop {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%) translateY(-8px);
		background: var(--nav-bg);
		backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid var(--nav-border);
		border-radius: 24px;
		padding: 0.85rem 1.6rem;
		box-shadow: 0 4px 18px -6px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
		opacity: 0;
		transition: opacity var(--transition-base), transform var(--transition-base);
		z-index: 40;
	}

	.nav-desktop[data-visible="true"] {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}

	.nav-desktop ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 1.6rem;
	}

	.nav-desktop a {
		text-decoration: none;
		font: 500 1rem/1.2 system-ui, sans-serif;
		letter-spacing: 0.04em;
		color: #fff;
		position: relative;
		padding: 0.55rem 0.7rem;
		border-radius: 10px;
		transition: color 0.35s, background 0.35s, box-shadow 0.45s, transform 0.45s;
	}

	.nav-desktop a::after {
		content: "";
		position: absolute;
		left: 10%;
		bottom: 6px;
		width: 0;
		height: 3px;
		border-radius: 2px;
		background: linear-gradient(90deg, #4285F4, #DB4437, #F4B400, #0F9D58);
		transition: width 420ms cubic-bezier(0.16, 0.84, 0.31, 1);
	}

	.nav-desktop a:hover::after,
	.nav-desktop a:focus-visible::after {
		width: 80%;
	}

	.nav-desktop a:hover,
	.nav-desktop a:focus-visible {
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 2px 14px -4px rgba(66, 133, 244, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
		transform: translateY(-2px);
	}

	.nav-mobile {
		position: fixed;
		left: 50%;
		bottom: calc(env(safe-area-inset-bottom, 0px) + 0.85rem);
		transform: translate(-50%, 16px);
		background: var(--nav-bg);
		backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid var(--nav-border);
		border-radius: var(--nav-radius);
		padding: 0.35rem 0.6rem;
		width: min(92%, 480px);
		opacity: 0;
		transition: opacity var(--transition-base), transform var(--transition-base);
		z-index: 50;
	}

	.nav-mobile[data-visible="true"] {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.nav-mobile ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0.4rem;
		justify-content: center;
	}

	.nav-mobile li {
		flex: 1;
		min-width: 0;
	}

	.nav-mobile a {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font: 600 0.82rem/1.15 system-ui, sans-serif;
		letter-spacing: 0.05em;
		color: #fff;
		padding: 0.65rem 0.55rem;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(4px);
		transition: background 0.35s, color 0.35s, box-shadow 0.45s, transform 0.45s;
	}

	.nav-mobile a:hover,
	.nav-mobile a:focus-visible {
		background: rgba(255, 255, 255, 0.12);
		box-shadow: 0 2px 10px -3px rgba(66, 133, 244, 0.4);
	}

	.nav-mobile a:active {
		transform: translateY(1px);
	}

	.nav-desktop a:hover::before,
	.nav-desktop a:focus-visible::before {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			120deg,
			rgba(66, 133, 244, 0.15),
			rgba(219, 68, 55, 0.15),
			rgba(244, 180, 0, 0.15),
			rgba(15, 157, 88, 0.15)
		);
		opacity: 0;
		animation: glowFade 900ms ease forwards;
		pointer-events: none;
	}

	@keyframes glowFade {
		0% {
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.nav-desktop[data-attention="true"] {
		animation: navPulse 680ms ease, settle 300ms ease 680ms forwards;
	}

	.nav-desktop[data-attention="true"] a,
	.nav-mobile[data-attention="true"] a {
		position: relative;
		background: linear-gradient(90deg, #DB4437, #F4B400, #0F9D58, #4285F4, #DB4437);
		background-size: 180% auto;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: linkShimmer 1200ms linear 1;
	}
	[data-attention="true"] li:nth-child(1) a { animation-delay: 0ms; }
	[data-attention="true"] li:nth-child(2) a { animation-delay: 120ms; }
	[data-attention="true"] li:nth-child(3) a { animation-delay: 240ms; }
	[data-attention="true"] li:nth-child(4) a { animation-delay: 360ms; }
	[data-attention="true"] li:nth-child(5) a { animation-delay: 480ms; }
	[data-attention="true"] li:nth-child(6) a { animation-delay: 600ms; }
	.nav-mobile[data-attention="true"] { animation: navMobilePulse 1100ms ease-in-out; }

	@keyframes navPulse {
		0% { transform: translateX(-50%) translateY(-8px) scale(.9); box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
		50% { transform: translateX(-50%) translateY(-3px) scale(1.045); box-shadow: 0 6px 26px -6px rgba(0,0,0,0.7), 0 0 0 4px rgba(255,255,255,0.05); }
		100% { transform: translateX(-50%) translateY(0) scale(1); box-shadow: 0 4px 18px -6px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset; }
	}
	@keyframes shimmer { to { background-position: 200% 50%; } }
	@keyframes navMobilePulse {
		0% { box-shadow: 0 0 0 0 rgba(66,133,244,0.0); }
		40% { box-shadow: 0 0 0 9px rgba(66,133,244,0.28); }
		80% { box-shadow: 0 0 0 12px rgba(66,133,244,0.08); }
		100% { box-shadow: 0 0 0 0 rgba(66,133,244,0); }
	}
	@keyframes linkShimmer { to { background-position: 200% 50%; } }
	@media (prefers-reduced-motion: reduce) {
		.nav-desktop[data-attention="true"], .nav-mobile[data-attention="true"] { animation: none; }
		.nav-desktop[data-attention="true"] a,
		.nav-mobile[data-attention="true"] a { animation: none; background: none; color: #fff; }
		.nav-desktop a, .nav-mobile a { transition: none; transform: none !important; }
	}

	@media (max-width: 700px) {
		.nav-desktop { display: none; }
	}
	@media (min-width: 701px) {
		.nav-mobile { display: none; }
	}
</style>

