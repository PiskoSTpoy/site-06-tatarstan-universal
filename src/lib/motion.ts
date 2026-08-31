/**
 * motion.ts — чистая математика движения для hero-иллюстрации (волна 19: восстановление
 * визуального слоя после волны 16, где сетевой модуль был признан мёртвым кодом и удалён
 * вместе с секциями, которые он обслуживал — hero-сцена, marquee, stat-bar).
 *
 * Модуль намеренно не трогает DOM: функции принимают числа и возвращают числа/точки,
 * поэтому их можно прогнать в изоляции (без браузера) и получить тот же результат, что
 * и на реальной странице — тот самый приём, которым в волне 13-D проверялась математика
 * параллакса при недоступном Browser pane.
 */

export type Point = { x: number; y: number };

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Смещение слоя параллакса по глубине. depth ниже базовой линии (0.6) двигается
 * ВСТРЕЧНО более глубоким слоям — композиция раскрывается в глубину, а не едет целиком
 * в одну сторону. amplitude — множитель в пикселях на единицу нормализованного ввода.
 */
export function parallaxOffset(depth: number, pointer: Point, amplitude: number): Point {
	const factor = (depth - 0.6) * amplitude;
	return { x: pointer.x * factor, y: pointer.y * factor };
}

/** Нормализует координату курсора в диапазон [-1, 1] относительно центра прямоугольника. */
export function normalizePointer(clientX: number, clientY: number, rect: DOMRect): Point {
	if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
	const x = ((clientX - rect.left) / rect.width) * 2 - 1;
	const y = ((clientY - rect.top) / rect.height) * 2 - 1;
	return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
}

/** lerp текущего значения к цели с коэффициентом сглаживания (демпфирование по кадру). */
export function lerp(current: number, target: number, factor: number): number {
	return current + (target - current) * factor;
}

export function prefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersFinePointer(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

/**
 * Подписка на изменение системной настройки «уменьшить движение» на лету (а не только
 * при монтировании) — переключение в системных настройках должно немедленно остановить
 * или включить эффект без перезагрузки страницы.
 */
export function watchReducedMotion(onChange: (matches: boolean) => void): () => void {
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	const handler = () => onChange(mq.matches);
	mq.addEventListener('change', handler);
	return () => mq.removeEventListener('change', handler);
}
