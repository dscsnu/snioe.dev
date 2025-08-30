<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';

	let progress = 0;
	let rawProgress = 0;
	let target = 0; 
	let raf: number | null = null;
	let showGDSC = false;
	const MAX_PROGRESS = 2;
	const STACK_FADE_START = 0.9; 
	const STACK_FADE_END = 1.15; 
	const PARA_START = STACK_FADE_START;

	const clamp = (v: number) => (v < 0 ? 0 : v > MAX_PROGRESS ? MAX_PROGRESS : v);
	let morph = 0;
	$: morph = progress > 1 ? 1 : progress;
	$: showGDSC = morph >= 0.5;
	let showNav = false;
	$: showNav = morph >= 0.62;
	let stackFade = 0;
	let paraProgress = 0;

	function ease(t: number) {
		return t * t * (3 - 2 * t);
	}

	$: {
		const rawStack = progress <= STACK_FADE_START
			? 0
			: progress >= STACK_FADE_END
			? 1
			: (progress - STACK_FADE_START) / (STACK_FADE_END - STACK_FADE_START);
		stackFade = ease(rawStack);
		const rawPara = progress <= PARA_START
			? 0
			: (progress - PARA_START) / (MAX_PROGRESS - PARA_START);
		paraProgress = ease(rawPara > 1 ? 1 : rawPara);
	}

	function animate() {
		if (Math.abs(target - progress) < 0.0005) {
			progress = target;
			raf = null;
			return;
		}
		progress += (target - progress) * 0.12;
		raf = requestAnimationFrame(animate);
	}
	function setTarget(v: number) {
		target = clamp(v);
		if (!raf) raf = requestAnimationFrame(animate);
	}

	onMount(() => {
		document.body.style.overflow = '';
		const handleScroll = () => {
			const scrollable = document.documentElement.scrollHeight - window.innerHeight;
			const raw = scrollable > 0 ? (window.scrollY / scrollable) * MAX_PROGRESS : 0;
		rawProgress = clamp(raw);
		if (!raf) raf = requestAnimationFrame(tickSmooth);
		};
		const handleResize = () => handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);
		handleScroll();
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			if (raf) cancelAnimationFrame(raf);
		};
	});

	function tickSmooth() {
		const diff = rawProgress - progress;
		if (Math.abs(diff) < 0.0005) {
			progress = rawProgress;
			runPost();
			raf = null;
			return;
		}
		progress += diff * 0.12;
		runPost();
		raf = requestAnimationFrame(tickSmooth);
	}

	function runPost() {
		target = progress;
	}
</script>

<style>
	:global(body) {
		background: #000;
		margin: 0;
		min-height: 100vh;
		overflow-x: hidden;
		font-family: system-ui, sans-serif;
	}
	.scroll-span { height: calc(100vh * 2); width: 1px; pointer-events: none; }
	.scroll-span { height: calc(100vh * 3); }
	.center-text {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: clamp(3.5rem,10vw,6rem);
		font-family: monospace;
		letter-spacing: 0.1em;
		user-select: none;
		z-index: 10;
	}
	.stack {
		position: relative;
		width: 8ch;
		height: 1em;
		display: inline-block;
	}
	.layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		will-change: opacity, transform, filter;
	}
	.layer.gdsc {
		color: #fff;
	}
	.gdsc-word {
		display: flex;
		gap: 0.05em;
	}
	.gdsc-word span {
		font-weight: 600;
	}
	.gdsc-word .g {
		color: #4285F4;
	}
	.gdsc-word .d {
		color: #DB4437;
	}
	.gdsc-word .s {
		color: #F4B400;
	}
	.gdsc-word .c {
		color: #0F9D58;
	}
	.layer.code {
		color: #fff;
	}
	.scroll-cue {
		position: absolute;
		top: 115%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .35rem;
		font: 500 0.7rem/1 monospace;
		letter-spacing: .35em;
		text-transform: uppercase;
		color: #aaa;
		pointer-events: none;
	}
	.scroll-cue svg { width: 18px; height: 18px; stroke: #888; stroke-width: 2; fill: none; animation: bounce 1.8s ease-in-out infinite; }
	@keyframes bounce { 0%,100% { transform: translateY(0); opacity: .9; } 50% { transform: translateY(6px); opacity: .4; } }

	.paragraph-wrapper {
		position: fixed;
		top: 50%; left: 50%;
		max-width: 640px;
		width: min(90%, 640px);
		color: #eee;
		font: 400 1rem/1.55 system-ui, sans-serif;
		letter-spacing: 0.015em;
		text-align: center;
		z-index: 5;
		transition: opacity 800ms cubic-bezier(.16,.84,.31,1), filter 800ms cubic-bezier(.16,.84,.31,1);
		pointer-events: none;
	}
	.paragraph-wrapper p { margin: 0; }
	.paragraph-wrapper p::selection { background: #4285F480; }
</style>

<div class="center-text">
	<div class="stack" aria-live="polite" aria-label={showGDSC ? 'GDG' : 'Code Symbol'}>
		<span
			class="layer code"
			style="opacity:{(1 - morph) * (1 - stackFade)}; transform:scale({1 - morph * 0.18 - stackFade * 0.05}); filter:blur({(morph + stackFade) * 3}px);">
			&lt;/&gt;
		</span>
		<span
			class="layer gdsc"
			style="opacity:{(1 - stackFade) * morph}; transform:scale({0.82 + morph * 0.18 + stackFade * 0.12}); filter:blur({(1-morph) * 3 + stackFade * 6}px);">
			<span class="gdsc-word"><span class="g">G</span><span class="d">D</span><span class="s">S</span><span class="c">C</span></span>
		</span>
		<div class="scroll-cue" aria-hidden="true" style="opacity:{(1 - morph) * (1 - stackFade)}; filter:blur({(morph + stackFade) * 2}px);">
			<span>SCROLL</span>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
		</div>
	</div>
</div>
<div class="paragraph-wrapper" aria-hidden={paraProgress === 0}
	style="--p:{paraProgress}; opacity:{paraProgress}; transform:translate(-50%, calc(-50% + {22 - paraProgress * 22}px)); filter:blur({(1-paraProgress)*5}px);">
	<p style="font-size: clamp(1.25rem, 2.5vw, 1.5rem); line-height: 1.75; margin: 0.5em 0">
		GDG is a student-led community that builds and learns through code, creativity and collaboration. With core teams in Development, AI/ML, CP, Creative, Event Management and Marketing, we make tech fun and impactful on campus.
		Basically, it  is the tech club equivalent of viral labubu dubai chocolate crumbl cookie matcha latte in a stanley cup.
	</p>
</div>
<Nav visible={showNav} />

<div class="scroll-span" aria-hidden="true"></div>
