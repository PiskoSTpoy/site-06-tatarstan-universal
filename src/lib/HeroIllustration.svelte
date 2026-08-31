<script lang="ts">
	/*
	 * Hero-иллюстрация крана со схемными выносками (волна 19: восстановление визуального
	 * слоя). Волна 16 убрала её вместе с ценовым hero — вопрос сайта сменился с «сколько
	 * стоит» на «что оформить», и старая сцена с ценовым акцентом перестала подходить к
	 * первому экрану. Здесь — тот же инженерно-схемный язык (сетка, выноски СТРЕЛА /
	 * АУТРИГЕРЫ / ГРУЗ / ПРОТИВОВЕС), но чисто иллюстративный: ни одной цифры, которая
	 * могла бы устареть или разойтись с текстом.
	 *
	 * Послойный параллакс по глубине — та же математика волны 13-D, вынесенная в
	 * lib/motion.ts: дальние слои идут ВСТРЕЧНО ближним, поэтому композиция раскрывается
	 * в глубину, а не едет целиком в одну сторону. Полностью выключается при
	 * prefers-reduced-motion (слушатель на изменение настройки «на лету») и при
	 * отсутствии точного указателя (pointer: fine) — на тач-экране слои неподвижны.
	 */
	import { onMount } from 'svelte';
	import { lerp, normalizePointer, parallaxOffset, prefersReducedMotion, watchReducedMotion, type Point } from './motion';

	let container: HTMLDivElement | undefined = $state();
	let svgEl: SVGSVGElement | undefined = $state();

	const LAYERS: { selector: string; depth: number }[] = [
		{ selector: '.ill-grid', depth: 0.12 },
		{ selector: '.ill-base', depth: 0.42 },
		{ selector: '.ill-boom', depth: 0.7 },
		{ selector: '.ill-load', depth: 0.98 },
		{ selector: '.ill-callouts', depth: 1.3 },
	];
	const AMPLITUDE = 16;

	function applyOffset(point: Point) {
		if (!svgEl) return;
		for (const layer of LAYERS) {
			const el = svgEl.querySelector<SVGGElement>(layer.selector);
			if (!el) continue;
			const { x, y } = parallaxOffset(layer.depth, point, AMPLITUDE);
			el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
		}
	}

	function resetOffsets() {
		if (!svgEl) return;
		for (const layer of LAYERS) {
			const el = svgEl.querySelector<SVGGElement>(layer.selector);
			if (el) el.style.transform = '';
		}
	}

	onMount(() => {
		let raf = 0;
		let targetX = 0;
		let targetY = 0;
		let curX = 0;
		let curY = 0;
		let running = false;

		function onMove(e: PointerEvent) {
			if (!container || e.pointerType !== 'mouse') return;
			const rect = container.getBoundingClientRect();
			const p = normalizePointer(e.clientX, e.clientY, rect);
			targetX = p.x;
			targetY = p.y;
		}
		function onLeave() {
			targetX = 0;
			targetY = 0;
		}
		function tick() {
			curX = lerp(curX, targetX, 0.08);
			curY = lerp(curY, targetY, 0.08);
			applyOffset({ x: curX, y: curY });
			raf = requestAnimationFrame(tick);
		}
		function start() {
			if (running) return;
			running = true;
			window.addEventListener('pointermove', onMove);
			window.addEventListener('pointerleave', onLeave);
			raf = requestAnimationFrame(tick);
		}
		function stop() {
			running = false;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerleave', onLeave);
			cancelAnimationFrame(raf);
			targetX = targetY = curX = curY = 0;
			resetOffsets();
		}

		const finePointer = window.matchMedia('(pointer: fine)').matches;
		if (!prefersReducedMotion() && finePointer) start();

		const stopWatchingMotion = watchReducedMotion((reduced) => {
			if (reduced) stop();
			else if (window.matchMedia('(pointer: fine)').matches) start();
		});

		return () => {
			stop();
			stopWatchingMotion();
		};
	});
</script>

<div class="ill" bind:this={container} aria-hidden="true">
	<svg
		bind:this={svgEl}
		class="ill__svg"
		viewBox="0 0 600 420"
		xmlns="http://www.w3.org/2000/svg"
		focusable="false"
	>
		<g class="ill-layer ill-grid">
			<line x1="-40" y1="0" x2="-40" y2="420" class="ill__gridline" />
			{#each Array(19) as _, i}
				<line x1={-40 + i * 40} y1="-40" x2={-40 + i * 40} y2="460" class="ill__gridline" />
			{/each}
			{#each Array(13) as _, i}
				<line x1="-40" y1={-40 + i * 40} x2="640" y2={-40 + i * 40} class="ill__gridline" />
			{/each}
		</g>

		<g class="ill-layer ill-base">
			<!-- аутригеры -->
			<line x1="40" y1="300" x2="92" y2="300" class="ill__stroke" />
			<circle cx="40" cy="300" r="5" class="ill__pad" />
			<line x1="308" y1="300" x2="360" y2="300" class="ill__stroke" />
			<circle cx="360" cy="300" r="5" class="ill__pad" />
			<!-- шасси -->
			<rect x="92" y="252" width="216" height="52" rx="3" class="ill__body" />
			<rect x="98" y="212" width="52" height="46" rx="3" class="ill__body" />
			<!-- противовес -->
			<rect x="272" y="228" width="34" height="46" class="ill__counter" />
			<!-- колёса -->
			<circle cx="132" cy="312" r="17" class="ill__wheel" />
			<circle cx="188" cy="312" r="17" class="ill__wheel" />
			<circle cx="252" cy="312" r="17" class="ill__wheel" />
			<circle cx="290" cy="312" r="17" class="ill__wheel" />
		</g>

		<g class="ill-layer ill-boom">
			<line x1="150" y1="222" x2="452" y2="96" class="ill__boom" />
		</g>

		<g class="ill-layer ill-load">
			<line x1="452" y1="96" x2="452" y2="210" class="ill__cable" />
			<path d="M446 210 q-8 14 6 20" class="ill__hook" />
			<rect x="428" y="230" width="52" height="36" class="ill__load" />
		</g>

		<g class="ill-layer ill-callouts">
			<line x1="452" y1="96" x2="452" y2="56" class="ill__leader" />
			<line x1="452" y1="56" x2="500" y2="56" class="ill__leader" />
			<circle cx="452" cy="96" r="2.5" class="ill__leader-dot" />
			<text x="504" y="59" class="ill__label">СТРЕЛА</text>

			<line x1="360" y1="300" x2="404" y2="330" class="ill__leader" />
			<line x1="404" y1="330" x2="452" y2="330" class="ill__leader" />
			<circle cx="360" cy="300" r="2.5" class="ill__leader-dot" />
			<text x="456" y="333" class="ill__label">АУТРИГЕРЫ</text>

			<line x1="454" y1="248" x2="500" y2="272" class="ill__leader" />
			<circle cx="454" cy="248" r="2.5" class="ill__leader-dot" />
			<text x="504" y="275" class="ill__label">ГРУЗ</text>

			<line x1="289" y1="251" x2="289" y2="200" class="ill__leader" />
			<line x1="289" y1="200" x2="240" y2="200" class="ill__leader" />
			<circle cx="289" cy="251" r="2.5" class="ill__leader-dot" />
			<text x="236" y="196" class="ill__label ill__label--right">ПРОТИВОВЕС</text>
		</g>
	</svg>
</div>

<style>
	.ill {
		position: relative;
		overflow: hidden;
		aspect-ratio: 600 / 420;
		width: 100%;
		background: radial-gradient(circle at 62% 38%, rgba(62, 207, 142, 0.1), transparent 62%);
	}
	.ill__svg {
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}
	.ill-layer {
		transition: transform 0.05s linear;
	}
	.ill__gridline {
		stroke: var(--line);
		stroke-width: 1;
	}
	.ill__stroke {
		stroke: var(--line-strong);
		stroke-width: 3;
		fill: none;
	}
	.ill__pad {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.ill__body {
		fill: var(--surface);
		stroke: var(--line-strong);
		stroke-width: 1.5;
	}
	.ill__counter {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.ill__wheel {
		fill: var(--bg);
		stroke: var(--line-strong);
		stroke-width: 2;
	}
	.ill__boom {
		stroke: var(--accent);
		stroke-width: 7;
		stroke-linecap: round;
	}
	.ill__cable {
		stroke: var(--muted);
		stroke-width: 1.5;
		stroke-dasharray: 3 3;
	}
	.ill__hook {
		fill: none;
		stroke: var(--muted);
		stroke-width: 2;
	}
	.ill__load {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.ill__leader {
		stroke: var(--line-strong);
		stroke-width: 1;
		stroke-dasharray: 2 3;
		fill: none;
	}
	.ill__leader-dot {
		fill: var(--accent);
	}
	.ill__label {
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.05em;
		fill: var(--muted);
	}
	.ill__label--right {
		text-anchor: end;
	}

	@media (prefers-reduced-motion: reduce) {
		.ill-layer {
			transition: none;
		}
	}
</style>
