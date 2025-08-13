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

	let hasShown = false;
	let drawAttention = false;
	$: if (visible && !hasShown) {
		setTimeout(() => {
			drawAttention = true;
			setTimeout(() => (drawAttention = false), 4600);
		}, 240);
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
	.nav-desktop, .nav-mobile { pointer-events: none; }
	.nav-desktop[data-visible="true"], .nav-mobile[data-visible="true"] { pointer-events: auto; }

	.nav-desktop {
		position: fixed;
		top: 1rem; left: 50%; transform: translateX(-50%) translateY(-8px);
		background: var(--nav-bg);
		backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid var(--nav-border);
		border-radius: 24px;
		padding: 0.85rem 1.6rem;
		box-shadow: 0 4px 18px -6px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset;
		opacity: 0;
		transition: opacity var(--transition-base), transform var(--transition-base);
		z-index: 40;
	}
	.nav-desktop[data-visible="true"] { opacity: 1; transform: translateX(-50%) translateY(0); }
	.nav-desktop ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 1.6rem; }
	.nav-desktop a {
		text-decoration: none;
		font: 500 1rem/1.2 system-ui, sans-serif;
		letter-spacing: .04em;
		color: #fff; position: relative;
		padding: .55rem .6rem;
		border-radius: 10px;
		transition: color .35s, background .35s;
	}
	.nav-desktop a::after {
		content: ""; position: absolute; left: 10%; bottom: 6px; width: 0; height: 3px; border-radius: 2px; background: linear-gradient(90deg,#4285F4,#DB4437,#F4B400,#0F9D58);
		transition: width 420ms cubic-bezier(.16,.84,.31,1);
	}
	.nav-desktop a:hover::after, .nav-desktop a:focus-visible::after { width: 80%; }
	.nav-desktop a:hover, .nav-desktop a:focus-visible { background: rgba(255,255,255,0.06); }

	.nav-mobile {
		position: fixed; left: 50%; bottom: calc(env(safe-area-inset-bottom, 0px) + 0.85rem);
		transform: translate(-50%, 16px);
		background: var(--nav-bg);
		backdrop-filter: blur(18px) saturate(180%);
		border: 1px solid var(--nav-border);
		border-radius: var(--nav-radius);
		padding: .35rem .6rem;
		width: min(92%, 480px);
		opacity: 0;
		transition: opacity var(--transition-base), transform var(--transition-base);
		z-index: 50;
	}
	.nav-mobile[data-visible="true"] { opacity: 1; transform: translate(-50%,0); }
	.nav-mobile ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: space-between;
	}
	.nav-mobile li {
		flex: 1;
	}
	.nav-mobile a {
		display: block;
		text-align: center;
		text-decoration: none;
		font: 500 0.7rem/1.1 system-ui, sans-serif;
		letter-spacing: .03em;
		color: #fff;
		padding: .55rem .4rem;
		border-radius: 10px;
		transition: background .35s, color .35s;
	}
	.nav-mobile a:active { transform: translateY(1px); }
	.nav-mobile a:hover, .nav-mobile a:focus-visible { background: rgba(255,255,255,0.08); }

	.nav-desktop[data-attention="true"] {
		animation: navPulse 1150ms ease, settle 450ms ease 1150ms forwards;
	}
	.nav-desktop[data-attention="true"] a,
	.nav-mobile[data-attention="true"] a {
		position: relative;
		background: linear-gradient(90deg,#4285F4,#DB4437,#F4B400,#0F9D58);
		background-size: 220% auto;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: linkShimmer 2600ms linear 1;
	}
	[data-attention="true"] li:nth-child(1) a { animation-delay: 0ms; }
	[data-attention="true"] li:nth-child(2) a { animation-delay: 180ms; }
	[data-attention="true"] li:nth-child(3) a { animation-delay: 360ms; }
	[data-attention="true"] li:nth-child(4) a { animation-delay: 540ms; }
	[data-attention="true"] li:nth-child(5) a { animation-delay: 720ms; }
	[data-attention="true"] li:nth-child(6) a { animation-delay: 900ms; }
	.nav-mobile[data-attention="true"] { animation: navMobilePulse 1400ms ease-in-out; }

	@keyframes navPulse {
		0% { transform: translateX(-50%) translateY(-8px) scale(.9); box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
		45% { transform: translateX(-50%) translateY(-2px) scale(1.05); box-shadow: 0 6px 30px -6px rgba(0,0,0,0.7), 0 0 0 6px rgba(255,255,255,0.05); }
		100% { transform: translateX(-50%) translateY(0) scale(1); box-shadow: 0 4px 18px -6px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset; }
	}
	@keyframes shimmer { to { background-position: 200% 50%; } }
	@keyframes navMobilePulse {
		0% { box-shadow: 0 0 0 0 rgba(66,133,244,0.0); }
		35% { box-shadow: 0 0 0 10px rgba(66,133,244,0.25); }
		70% { box-shadow: 0 0 0 14px rgba(66,133,244,0.08); }
		100% { box-shadow: 0 0 0 0 rgba(66,133,244,0); }
	}
	@keyframes linkShimmer { to { background-position: 200% 50%; } }
	@media (prefers-reduced-motion: reduce) {
		.nav-desktop[data-attention="true"], .nav-mobile[data-attention="true"] { animation: none; }
		.nav-desktop[data-attention="true"] a,
		.nav-mobile[data-attention="true"] a { animation: none; background: none; color: #fff; }
	}

	@media (max-width: 700px) {
		.nav-desktop { display: none; }
	}
	@media (min-width: 701px) {
		.nav-mobile { display: none; }
	}
</style>

