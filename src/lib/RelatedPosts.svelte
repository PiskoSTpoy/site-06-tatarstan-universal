<script lang="ts">
	import { posts, type Post } from './posts';

	// Похожие материалы. Простая честная логика: все статьи блога кроме текущей,
	// в исходном порядке. Ограничение — не больше 3-х карточек.
	// После волны 22 в блоге 4 статьи одной темы (наряд-допуск на газоопасные работы) — блок
	// показывает три другие карточки на каждой странице, заголовок учитывает число
	// ("Ещё материалы по теме" во множественном). Врать про "релевантность" не нужно: все
	// статьи про наряд-допуск и связаны напрямую.

	let { currentSlug }: { currentSlug: string } = $props();
	const related: Post[] = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
</script>

{#if related.length > 0}
	<section class="related section wrap" aria-labelledby="related-heading">
		<div class="related__head">
			<span class="related__eyebrow">Читать дальше</span>
			<h2 id="related-heading" class="related__title">
				{related.length === 1 ? 'Ещё материал по теме' : 'Ещё материалы по теме'}
			</h2>
		</div>
		<div class="related__grid" data-count={related.length}>
			{#each related as p (p.slug)}
				<a class="related__card" href={p.href}>
					<span class="related__tag">{p.tag}</span>
					<h3 class="related__cardtitle">{p.title}</h3>
					<p class="related__excerpt">{p.excerpt}</p>
					<span class="related__more">Открыть →</span>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.related {
		border-top: 1px solid var(--line);
	}
	.related__head {
		margin-bottom: 24px;
	}
	.related__eyebrow {
		color: var(--accent);
		font-weight: 700;
		font-size: var(--fs-1);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-family: var(--mono);
	}
	.related__title {
		margin-top: 8px;
		font-size: clamp(1.2rem, 2.4vw, 1.6rem);
	}
	.related__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
	}
	.related__card {
		position: relative;
		display: block;
		text-decoration: none;
		padding: 22px;
		background: var(--surface);
		border: 1px solid var(--line);
		transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
	}
	.related__card::before,
	.related__card::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border: 1px solid var(--accent);
		opacity: 0.6;
	}
	.related__card::before {
		top: -1px;
		left: -1px;
		border-right: none;
		border-bottom: none;
	}
	.related__card::after {
		bottom: -1px;
		right: -1px;
		border-left: none;
		border-top: none;
	}
	.related__card:hover {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent), 0 0 22px -6px rgba(62, 207, 142, 0.55);
		transform: translateY(-2px);
	}
	.related__tag {
		display: inline-block;
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.related__cardtitle {
		margin-top: 10px;
		font-size: var(--fs-5);
		font-family: var(--mono);
		line-height: 1.3;
	}
	.related__excerpt {
		margin-top: 10px;
		color: var(--muted);
		font-size: var(--fs-3);
		font-family: var(--sans);
		line-height: 1.5;
	}
	.related__more {
		display: inline-block;
		margin-top: 14px;
		color: var(--accent);
		font-weight: 700;
		font-size: var(--fs-3);
		font-family: var(--mono);
	}
	@media (prefers-reduced-motion: reduce) {
		.related__card {
			transition: none;
		}
		.related__card:hover {
			transform: none;
		}
	}
</style>
