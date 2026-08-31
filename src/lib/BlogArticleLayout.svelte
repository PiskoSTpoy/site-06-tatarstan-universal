<script lang="ts">
	import type { Snippet } from 'svelte';
	import ReadingProgress from './ReadingProgress.svelte';
	import TableOfContents from './TableOfContents.svelte';
	import RelatedPosts from './RelatedPosts.svelte';

	// Общая обёртка статьи блога:
	//  1. Тонкая полоса прогресса чтения вверху экрана.
	//  2. Оглавление — мобильный <details> в начале статьи, десктопный sticky-aside справа.
	//  3. Тело статьи (children) в колонке фиксированной ширины.
	//  4. Блок "Похожие материалы" — 3 карточки из реального списка статей.
	//  5. Финальный CTA (кнопка).
	//
	// Все декоративные механизмы прогрессивные: без JS reading-progress не появляется,
	// оглавление работает как обычная якорная навигация, подсветка активного пункта —
	// enhancement.

	type Heading = { id: string; text: string };

	let {
		title,
		subtitle,
		eyebrow = 'Разбор для заказчика',
		crumbLabel,
		headings,
		currentSlug,
		ctaText,
		ctaHref,
		children,
	}: {
		title: string;
		subtitle: string;
		eyebrow?: string;
		crumbLabel: string;
		headings: Heading[];
		currentSlug: string;
		ctaText: string;
		ctaHref: string;
		children: Snippet;
	} = $props();
</script>

<ReadingProgress articleSelector="article[data-blog-article]" />

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><a href="/blog/">Блог</a><span>/</span><span>{crumbLabel}</span>
	</nav>

	<div class="blog-shell wrap">
		<div class="blog-shell__article">
			<article class="section prose" data-blog-article style="padding-top:8px">
				<span class="eyebrow">{eyebrow}</span>
				<h1 class="blog-title">{title}</h1>
				<p class="blog-subtitle">{subtitle}</p>

				<TableOfContents {headings} variant="mobile" />

				{@render children()}
			</article>
		</div>

		<div class="blog-shell__toc">
			<TableOfContents {headings} variant="desktop" />
		</div>
	</div>

	<RelatedPosts {currentSlug} />

	<section class="section wrap" style="padding-top:12px">
		<a class="btn" href={ctaHref}>{ctaText}</a>
	</section>
</main>

<style>
	.blog-shell {
		display: block;
	}
	.blog-shell__article {
		max-width: 820px;
		margin: 0 auto;
	}
	.blog-shell__toc {
		display: none;
	}
	.blog-title {
		font-size: clamp(1.5rem, 3.4vw, 2.1rem);
		margin: 14px 0 8px;
	}
	.blog-subtitle {
		color: var(--muted);
		font-size: var(--fs-3);
		margin-bottom: 28px;
	}

	/* Десктоп — двухколоночная сетка: статья слева (макс 820px), sticky-оглавление справа */
	@media (min-width: 1100px) {
		.blog-shell {
			display: grid;
			grid-template-columns: minmax(0, 820px) 220px;
			gap: 48px;
			justify-content: center;
			align-items: start;
		}
		.blog-shell__article {
			margin: 0;
		}
		.blog-shell__toc {
			display: block;
			padding-top: 32px;
		}
	}
</style>
