<script lang="ts">
	/*
	 * Блок «Источники · проверено <дата>» (волна 16).
	 *
	 * Смысл не косметический. Нормативка протухает: приказ №528 уже пережил редакцию от 03.03.2026,
	 * ПП №2464 меняется с 31.08.2026, границы зон охраны Казанского кремля переустанавливались
	 * трижды. Страница без даты проверки не даёт читателю понять, к какому моменту относится текст,
	 * и через год врёт молча. Дата стоит рядом со ссылками, а не в подвале сайта.
	 */
	type SourceItem = { label: string; href: string };

	let { items, date, note }: { items: SourceItem[]; date: string; note?: string } = $props();
</script>

<aside class="src" aria-label="Источники и дата проверки">
	<p class="src__head">Источники · проверено {date}</p>
	<ul class="src__list">
		{#each items as s (s.href)}
			<li>
				<a href={s.href} target="_blank" rel="noopener"
					>{s.label}<span class="sr-only"> (откроется в новой вкладке)</span></a
				>
			</li>
		{/each}
	</ul>
	{#if note}<p class="src__note">{note}</p>{/if}
</aside>

<style>
	.src {
		margin-top: clamp(28px, 4vw, 40px);
		border-top: 1px solid var(--line-strong);
		padding-top: 16px;
		max-width: 74ch;
	}
	.src__head {
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.src__list {
		margin: 10px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 6px;
	}
	.src__list li {
		font-size: var(--fs-2);
		line-height: 1.5;
		color: var(--muted);
		padding-left: 16px;
		position: relative;
	}
	.src__list li::before {
		content: '—';
		position: absolute;
		left: 0;
		color: var(--line-strong);
	}
	/* Подчёркивание оставлено намеренно: цвет не может быть единственным признаком ссылки
	   (WCAG 1.4.1), а ссылки здесь стоят внутри плотного мелкого текста. */
	.src__list a {
		color: var(--muted);
		text-underline-offset: 2px;
	}
	.src__list a:hover {
		color: var(--accent);
	}
	.src__note {
		margin-top: 10px;
		font-size: var(--fs-2);
		line-height: 1.5;
		color: var(--muted);
	}
	@supports (content: 'x' / 'y') {
		.src__list li::before {
			content: '—' / '';
		}
	}
</style>
