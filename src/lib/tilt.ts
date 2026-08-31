/**
 * tilt.ts — 3D-наклон при наведении для карточек парка техники на главной (волна 128).
 *
 * ВАЖНО: наклон живёт ТОЛЬКО на карточках классов парка. Строки-реестры
 * (.kind/.links/.cities) отвечают на наведение терминальным маркером «>» — это
 * взаимоисключающие метафоры для одного и того же элемента, и смешивать их нельзя.
 * Карточки классов парка появились позже и отдельно, поэтому конфликта между двумя
 * языками hover-реакции здесь не возникает.
 *
 * Математика — не новая: normalizePointer/clamp уже есть в motion.ts и используются
 * HeroIllustration.svelte для параллакса. Здесь та же нормализация координаты курсора в
 * [-1, 1], applied как угол rotateX/rotateY (ТЗ: 5–10°, взято 8° — середина диапазона).
 */
import { clamp, normalizePointer, prefersFinePointer, prefersReducedMotion, watchReducedMotion } from './motion';

const MAX_DEG = 8;

export function tilt(node: HTMLElement) {
	let listening = false;

	function onMove(e: PointerEvent) {
		// Второй, независимый гейт от touch — на случай гибридных устройств (ноутбук с
		// сенсорным экраном), где matchMedia('(pointer: fine)') на уровне attach() уже
		// true (есть мышь), но конкретное касание пришло пальцем.
		if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
		const rect = node.getBoundingClientRect();
		const p = normalizePointer(e.clientX, e.clientY, rect);
		// Наклон вперёд к курсору: курсор сверху (p.y < 0) — верх карточки уходит НАЗАД
		// (rotateX положительный клонит верх от зрителя при обычной ориентации осей CSS),
		// поэтому знак инвертирован для rX, а не для rY.
		const rX = clamp(-p.y * MAX_DEG, -MAX_DEG, MAX_DEG);
		const rY = clamp(p.x * MAX_DEG, -MAX_DEG, MAX_DEG);
		node.style.setProperty('--tilt-x', `${rX.toFixed(2)}deg`);
		node.style.setProperty('--tilt-y', `${rY.toFixed(2)}deg`);
	}

	function onLeave() {
		node.style.setProperty('--tilt-x', '0deg');
		node.style.setProperty('--tilt-y', '0deg');
	}

	function attach() {
		if (listening) return;
		listening = true;
		node.addEventListener('pointermove', onMove);
		node.addEventListener('pointerleave', onLeave);
	}

	function detach() {
		if (!listening) return;
		listening = false;
		node.removeEventListener('pointermove', onMove);
		node.removeEventListener('pointerleave', onLeave);
		onLeave();
	}

	function evaluate() {
		if (!prefersReducedMotion() && prefersFinePointer()) attach();
		else detach();
	}

	evaluate();
	const stopWatchingMotion = watchReducedMotion(evaluate);
	const pointerQuery = typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)') : null;
	pointerQuery?.addEventListener('change', evaluate);

	return {
		destroy() {
			detach();
			stopWatchingMotion();
			pointerQuery?.removeEventListener('change', evaluate);
		},
	};
}
