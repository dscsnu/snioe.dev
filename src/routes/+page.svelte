<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';

	let progress = 0;
	let target = 0;
	let raf: number | null = null;
	let touchY = 0;
	let showGDSC = false;
	const MAX_PROGRESS = 2;
	const STACK_FADE_START = 1.0;
	const STACK_FADE_END = 1.18;

	const clamp = (v: number) => (v < 0 ? 0 : v > MAX_PROGRESS ? MAX_PROGRESS : v);
	let morph = 0;
	$: morph = progress > 1 ? 1 : progress;
	$: showGDSC = morph >= 0.5;
	let showNav = false;
	$: showNav = morph >= 0.62;
	let stackFade = 0;
	$: stackFade = progress <= STACK_FADE_START
		? 0
		: progress >= STACK_FADE_END
		? 1
		: (progress - STACK_FADE_START) / (STACK_FADE_END - STACK_FADE_START);

	let paraProgress = 0;
	$: paraProgress = progress <= STACK_FADE_END
		? 0
		: (progress - STACK_FADE_END) / (MAX_PROGRESS - STACK_FADE_END);
	let hintText = '';
	$: hintText = progress < 1
		? 'Scroll / Swipe to Morph'
		: stackFade < 1
		? 'Keep Scrolling'
		: (paraProgress < 1 ? 'Keep Scrolling' : '');

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
		document.body.style.overflow = 'hidden';
		const onWheel = (e: WheelEvent) => setTarget(target + e.deltaY * 0.0012);
		const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
		const onTouchMove = (e: TouchEvent) => {
			const y = e.touches[0].clientY;
			const dy = touchY - y;
			touchY = y;
			setTarget(target + dy * 0.003);
		};
		window.addEventListener('wheel', onWheel, { passive: true });
		window.addEventListener('touchstart', onTouchStart, { passive: true });
		window.addEventListener('touchmove', onTouchMove, { passive: true });
		return () => {
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
			if (raf) cancelAnimationFrame(raf);
			document.body.style.overflow = '';
		};
	});
</script>

<style>
	:global(body) {
		background: #000;
		margin: 0;
		min-height: 100vh;
		overflow: hidden;
		font-family: system-ui, sans-serif;
	}
	.center-text {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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
	.hint {
		position: fixed;
		bottom: 2.2rem;
		left: 50%;
		transform: translateX(-50%);
		font: 0.75rem/1.1 monospace;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #666;
		opacity: 0.55;
		pointer-events: none;
	}
	.hint::after {
		content: "";
		display: block;
		width: 60px;
		margin: 0.55rem auto 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, #444, transparent);
	}
	.hint[data-fadeout="true"] { opacity: 0; transition: opacity 600ms ease; }

	.paragraph-wrapper {
		position: fixed;
		top: 50%; left: 50%;
		max-width: 640px;
		width: min(90%, 640px);
		color: #eee;
		font: 400 clamp(0.95rem, 1.4vw, 1.05rem)/1.55 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
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
	<div class="stack" aria-live="polite" aria-label={showGDSC ? 'GDSC' : 'Code Symbol'}>
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
	</div>
</div>
{#if hintText}
	<div class="hint" data-fadeout={paraProgress >= 1}>{hintText}</div>
{/if}
<div class="paragraph-wrapper" aria-hidden={paraProgress === 0}
	style="--p:{paraProgress}; opacity:{paraProgress}; transform:translate(-50%, calc(-50% + {40 - paraProgress * 40}px)); filter:blur({(1-paraProgress)*6}px);">
	<p style="font-size: clamp(1.25rem, 2.5vw, 1.5rem); line-height: 1.75; margin: 0.5em 0">
		GDSC is a student-led community that builds and learns through code, creativity and collaboration. With core teams in Development, AI/ML, CP, Creative, Event Management and Marketing, we make tech fun and impactful on campus.
		Basically, it  is the tech club equivalent of viral labubu dubai chocolate crumbl cookie matcha latte in a stanley cup.
	</p>
</div>
<Nav visible={showNav} />
