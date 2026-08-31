<script lang="ts">
	// Прогресс чтения статьи — тонкая полоса вверху экрана, ширина = доля прочитанного
	// внутри <article>.
	//
	// Компонент отдаёт только разметку: полоса приходит с сервера со scaleX(0) и честным
	// aria-valuenow="0", то есть при выключенном JS она физически есть в DOM, но не видна и
	// ничего не обещает. Двигает её static/enh.js по атрибуту data-rp-target — страницы блога
	// не гидрируются, и держать ради полосы 118 КБ клиентского рантайма на статью не за что.
	// При prefers-reduced-motion анимации ширины нет (см. медиазапрос ниже) — полоса просто
	// перескакивает в новое положение.

	let { articleSelector = 'article' }: { articleSelector?: string } = $props();
</script>

<div
	class="rp"
	data-rp-target={articleSelector}
	role="progressbar"
	aria-label="Прогресс чтения статьи"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow="0"
>
	<div class="rp__bar"></div>
</div>

<style>
	.rp {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		z-index: 30;
		background: transparent;
		pointer-events: none;
	}
	.rp__bar {
		height: 100%;
		width: 100%;
		background: var(--accent);
		transform-origin: 0 50%;
		transform: scaleX(0);
		transition: transform 0.08s linear;
		box-shadow: 0 0 8px rgba(62, 207, 142, 0.55);
	}
	@media (prefers-reduced-motion: reduce) {
		.rp__bar {
			transition: none;
		}
	}
</style>
