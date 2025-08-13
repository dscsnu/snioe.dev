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

	const WHEEL_COEFF = 0.0012;
	const PLATEAU_PROGRESS = 1.0;
	const UNLOCK_PROGRESS_THRESHOLD = 0.99;
	const UNLOCK_REQUIRED_ACCUM = 0.05;
	let unlockedBeyondMorph = false;
	let unlockAccum = 0;
	let touchCoeff = 0.003;
	let lastTouchTime = 0;
	let lastTouchY = 0;
	let touchVelocity = 0;
	const INERTIA_FACTOR = 260;

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
		touchCoeff = 0.0045 * (800 / Math.min(window.innerHeight, 800));

		const onWheel = (e: WheelEvent) => {
			const delta = e.deltaY * WHEEL_COEFF;
			if (!unlockedBeyondMorph) {
				if (progress >= UNLOCK_PROGRESS_THRESHOLD) {
					if (delta > 0) {
						unlockAccum += delta;
						if (unlockAccum >= UNLOCK_REQUIRED_ACCUM) {
							unlockedBeyondMorph = true;
						} else {
							setTarget(PLATEAU_PROGRESS);
							return;
						}
					}
				}
			}
			setTarget(target + delta);
		};
		const onTouchStart = (e: TouchEvent) => {
			touchY = e.touches[0].clientY;
			lastTouchY = touchY;
			lastTouchTime = performance.now();
			touchVelocity = 0;
		};
		const onTouchMove = (e: TouchEvent) => {
			const y = e.touches[0].clientY;
			const dy = touchY - y;
			touchY = y;
			const now = performance.now();
			const dt = now - lastTouchTime;
			if (dt > 0) {
				const instV = (lastTouchY - y) / dt;
				touchVelocity = touchVelocity * 0.6 + instV * 0.4;
				lastTouchTime = now;
				lastTouchY = y;
			}
			const progDelta = dy * touchCoeff;
			if (!unlockedBeyondMorph) {
				if (progress >= UNLOCK_PROGRESS_THRESHOLD) {
					if (progDelta > 0) {
						unlockAccum += progDelta;
						if (unlockAccum >= UNLOCK_REQUIRED_ACCUM) {
							unlockedBeyondMorph = true;
						} else {
							setTarget(PLATEAU_PROGRESS);
							return;
						}
					}
				}
			}
			setTarget(target + progDelta);
		};
		const onTouchEnd = () => {
			const v = touchVelocity;
			const THRESH = 0.18;
			if (Math.abs(v) > THRESH) {
				let intended = target + (v * INERTIA_FACTOR * touchCoeff);
				if (!unlockedBeyondMorph) {
					intended = Math.min(intended, PLATEAU_PROGRESS);
				}
				setTarget(intended);
			}
		};
		window.addEventListener('wheel', onWheel, { passive: true });
		window.addEventListener('touchstart', onTouchStart, { passive: true });
		window.addEventListener('touchmove', onTouchMove, { passive: true });
		window.addEventListener('touchend', onTouchEnd, { passive: true });
		return () => {
			window.removeEventListener('wheel', onWheel);
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
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
		<div class="scroll-cue" aria-hidden="true" style="opacity:{(1 - morph) * (1 - stackFade)}; filter:blur({(morph + stackFade) * 2}px);">
			<span>SCROLL</span>
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
		</div>
	</div>
</div>
<div class="paragraph-wrapper" aria-hidden={paraProgress === 0}
	style="--p:{paraProgress}; opacity:{paraProgress}; transform:translate(-50%, calc(-50% + {40 - paraProgress * 40}px)); filter:blur({(1-paraProgress)*6}px);">
	<p style="font-size: clamp(1.25rem, 2.5vw, 1.5rem); line-height: 1.75; margin: 0.5em 0">
		GDSC is a student-led community that builds and learns through code, creativity and collaboration. With core teams in Development, AI/ML, CP, Creative, Event Management and Marketing, we make tech fun and impactful on campus.
		Basically, it  is the tech club equivalent of viral labubu dubai chocolate crumbl cookie matcha latte in a stanley cup.
	</p>
</div>
<Nav visible={showNav} />
