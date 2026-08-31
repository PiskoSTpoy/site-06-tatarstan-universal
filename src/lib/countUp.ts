import { prefersReducedMotion } from './motion';

type CountUpParams = { duration?: number };

/**
 * Действие count-up для честных цифр (плашка метрик, волна 19). Не знает никаких чисел
 * заранее: берёт готовый текст узла (то, что уже написано в разметке — единственный
 * источник правды), разбивает его на числовые и нечисловые куски и прокручивает от 0
 * только числа. В конце в узел пишется ИСХОДНАЯ строка целиком — итог совпадает с
 * разметкой символ в символ, даже если анимация была прервана досрочно.
 *
 * При prefers-reduced-motion действие не трогает текст и не создаёт IntersectionObserver
 * вообще — 0 запрошенных кадров, число в DOM с самого начала финальное.
 */
export function countUp(node: HTMLElement, params: CountUpParams = {}) {
	if (prefersReducedMotion()) return {};

	const original = node.textContent ?? '';
	// Чередование: нечисловой кусок, число, нечисловой кусок, число… (пустые строки
	// на границах — тоже нечисловые куски, регэксп на цифры их не тронет).
	const parts = original.split(/(\d+)/);
	const duration = params.duration ?? 900;
	let raf = 0;
	let cancelled = false;

	function render(t: number) {
		node.textContent = parts.map((part) => (/^\d+$/.test(part) ? String(Math.round(Number(part) * t)) : part)).join('');
	}

	function run() {
		const start = performance.now();
		function tick(now: number) {
			if (cancelled) return;
			const elapsed = now - start;
			const t = clamp01(elapsed / duration);
			// easeOutQuad — быстрый старт, плавное замедление к финалу.
			render(1 - (1 - t) * (1 - t));
			if (t < 1) {
				raf = requestAnimationFrame(tick);
			} else {
				node.textContent = original;
			}
		}
		raf = requestAnimationFrame(tick);
	}

	function clamp01(v: number): number {
		return Math.min(1, Math.max(0, v));
	}

	render(0);
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					run();
					io.disconnect();
				}
			}
		},
		{ threshold: 0.4 }
	);
	io.observe(node);

	return {
		destroy() {
			cancelled = true;
			if (raf) cancelAnimationFrame(raf);
			io.disconnect();
		},
	};
}
