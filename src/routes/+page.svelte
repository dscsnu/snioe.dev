<script lang="ts">
	import { onMount } from 'svelte';

	let progress = 0;
	let target = 0;
	let raf: number | null = null;
	let touchY = 0;
	let showGDSC = false;

	const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
	$: showGDSC = progress >= 0.5;

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
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
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
	.stack { position: relative; width: 8ch; height: 1em; display: inline-block; }
	.layer { position: absolute; inset:0; display:flex; align-items:center; justify-content:center; font-weight:600; will-change: opacity, transform, filter; }
	.layer.gdsc { color:#fff; }
	.gdsc-word { display:flex; gap:0.05em; }
	.gdsc-word span { font-weight:600; }
	.gdsc-word .g { color:#4285F4; }
	.gdsc-word .d { color:#DB4437; }
	.gdsc-word .s { color:#F4B400; }
	.gdsc-word .c { color:#0F9D58; }
	.layer.code { color: #fff; }
	.hint { position: fixed; bottom:2.2rem; left:50%; transform:translateX(-50%); font: 0.75rem/1.1 monospace; letter-spacing:.2em; text-transform:uppercase; color:#666; opacity:.55; pointer-events:none; }
	.hint::after { content:""; display:block; width:60px; margin:.55rem auto 0; height:2px; background:linear-gradient(90deg,transparent,#444,transparent); }
</style>

<div class="center-text">
	<div class="stack" aria-live="polite" aria-label={showGDSC ? 'GDSC' : 'Code Symbol'}>
		<span
			class="layer code"
			style="opacity:{1 - progress}; transform:scale({1 - progress * 0.18}); filter:blur({progress * 3}px);">
			&lt;/&gt;
		</span>
		<span
			class="layer gdsc"
			style="opacity:{progress}; transform:scale({0.82 + progress * 0.18}); filter:blur({(1-progress) * 3}px);">
			<span class="gdsc-word"><span class="g">G</span><span class="d">D</span><span class="s">S</span><span class="c">C</span></span>
		</span>
	</div>
</div>
<div class="hint">Scroll / Swipe to Morph</div>
