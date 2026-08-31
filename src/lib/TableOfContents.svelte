<script lang="ts">
	// Оглавление статьи. Один компонент — два варианта отображения:
	//   variant="mobile"  — <details> в начале статьи, свёрнутая по умолчанию
	//   variant="desktop" — sticky-aside в правой колонке, с подсветкой активного пункта
	// Компонент ничего не рисует, если заголовков < 3 — на короткой статье ToC не нужен
	// и только мешает.
	//
	// Прогрессивное улучшение: ссылки — обычные <a href="#id">, id проставлены прямо
	// в разметке статьи, поэтому якорная навигация работает и без JavaScript.
	// Подсветку активного пункта вешает static/enh.js по атрибуту data-toc-desktop:
	// он просто ставит класс is-active на уже отрисованный <li>, поэтому scoped-стиль ниже
	// к нему применяется. Мобильный вариант не подсвечивается (он свёрнут по умолчанию —
	// наблюдать заголовки впустую незачем). При prefers-reduced-motion подсветка остаётся:
	// это цвет, а не движение.

	type Heading = { id: string; text: string };
	let { headings, variant }: { headings: Heading[]; variant: 'mobile' | 'desktop' } = $props();

	// Стартовое состояние подсветки для серверной разметки: активного пункта ещё нет.
	// Директива class:is-active ниже нужна и как объявление — по ней Svelte понимает, что
	// селектор .is-active в <style> используется, и не вырезает его из CSS.
	const activeId: string | null = null;
</script>

{#if headings.length >= 3}
	{#if variant === 'mobile'}
		<details class="toc-m">
			<summary>
				<span class="toc-m__label">Содержание</span>
				<span class="toc-m__count">{headings.length} разделов</span>
			</summary>
			<ol class="toc-list toc-list--m">
				{#each headings as h (h.id)}
					<li>
						<a href={`#${h.id}`}>{h.text}</a>
					</li>
				{/each}
			</ol>
		</details>
	{:else}
		<!-- Оглавление — это набор внутренних ссылок, то есть навигация. <nav> даёт скринридеру
		     landmark, к которому можно перейти напрямую; <aside> объявлял бы его «дополнением». -->
		<nav class="toc-d" data-toc-desktop aria-label="Содержание статьи">
			<div class="toc-d__inner">
				<div class="toc-d__label">Содержание</div>
				<ol class="toc-list">
					{#each headings as h (h.id)}
						<li class:is-active={activeId === h.id}>
							<a href={`#${h.id}`}>{h.text}</a>
						</li>
					{/each}
				</ol>
			</div>
		</nav>
	{/if}
{/if}

<style>
	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: toc;
		font-family: var(--mono);
	}
	.toc-list li {
		counter-increment: toc;
		font-size: var(--fs-3);
		line-height: 1.45;
	}
	.toc-list li + li {
		margin-top: 8px;
	}
	.toc-list a {
		display: block;
		text-decoration: none;
		color: var(--muted);
		padding: 4px 10px 4px 10px;
		border-left: 2px solid var(--line);
		transition: color 0.12s ease, border-color 0.12s ease, background-color 0.12s ease;
	}
	.toc-list a::before {
		content: counter(toc, decimal-leading-zero);
		display: inline-block;
		margin-right: 8px;
		color: var(--accent);
		opacity: 0.55;
		font-size: var(--fs-1);
	}
	.toc-list a:hover {
		color: var(--ink);
		border-left-color: var(--accent);
	}
	.toc-list li.is-active > a {
		color: var(--ink);
		border-left-color: var(--accent);
		background: rgba(62, 207, 142, 0.08);
	}
	.toc-list li.is-active > a::before {
		opacity: 1;
	}

	/* Mobile — <details> в начале статьи */
	.toc-m {
		background: var(--surface);
		border: 1px solid var(--line);
		padding: 14px 16px;
		margin: 0 0 28px;
		font-family: var(--mono);
	}
	.toc-m > summary {
		list-style: none;
		cursor: pointer;
		min-height: 44px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		font-weight: 700;
		font-size: var(--fs-3);
	}
	.toc-m > summary::-webkit-details-marker {
		display: none;
	}
	.toc-m > summary::after {
		content: '+';
		color: var(--accent);
		font-size: var(--fs-7);
		font-weight: 700;
		transition: transform 0.16s ease;
		flex-shrink: 0;
	}
	.toc-m[open] > summary::after {
		transform: rotate(45deg);
	}
	.toc-m__count {
		color: var(--muted);
		font-weight: 500;
		font-size: var(--fs-2);
		margin-left: auto;
		margin-right: 12px;
	}
	.toc-list--m {
		margin-top: 14px;
	}

	/* Desktop — sticky sidebar */
	.toc-d__inner {
		position: sticky;
		top: 96px;
		max-height: calc(100vh - 120px);
		overflow-y: auto;
		padding-right: 4px;
	}
	.toc-d__label {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: var(--fs-1);
		color: var(--accent);
		font-weight: 700;
		font-family: var(--mono);
		margin-bottom: 12px;
	}

	/* Тап-таргет пункта мобильного оглавления: строка 0.82rem × 1.45 ≈ 19px, с паддингом 13px
	   сверху и снизу выходит ≈45px — выше порога WCAG 2.5.5 (44px). Десктопное оглавление
	   кликают мышью, там компактные отступы оставлены как есть. */
	.toc-list--m a {
		padding-top: 13px;
		padding-bottom: 13px;
	}

	@media (prefers-reduced-motion: reduce) {
		.toc-list a,
		.toc-m > summary::after {
			transition: none;
		}
	}

	/* Декоративная нумерация и маркер «+» не должны читаться скринридером: список и так <ol>,
	   а состояние раскрытия сообщает нативный <details>. */
	@supports (content: "x" / "y") {
		.toc-list a::before {
			content: counter(toc, decimal-leading-zero) / "";
		}
		.toc-m > summary::after {
			content: '+' / '';
		}
	}
</style>
