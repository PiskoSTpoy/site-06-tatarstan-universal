<script lang="ts">
	/*
	 * Двухколоночный разбор «термин → значение» для раздела форм (волна 16).
	 *
	 * У раздела /formy/ своя оптика: не «что нужно оформить» (это /dopusk/ и /obekty-opo/, там
	 * четырёхполевая строка требования), а «как устроен сам документ». Слева — свойство бланка,
	 * справа — что оно означает на практике. Без нумерации: у свойств документа нет обязательного
	 * порядка, в отличие от шагов чек-листа.
	 *
	 * Разметка — <table>, а не <dl>, как было раньше. Это ровно таблица параметров: одна и та же
	 * пара колонок повторяется на всех страницах раздела, у колонок есть общие заголовки. Для
	 * человека изменилось только то, что у колонок появились подписи (визуально блок тот же —
	 * та же сетка, те же отбивки). Для машинного чтения разница принципиальная: из <dl> пара
	 * «свойство — значение» вытаскивается догадкой, из строки таблицы с <th scope> — однозначно.
	 */
	type Pair = { k: string; v: string };

	let { items, label, keyHead = 'Свойство', valueHead = 'Что это значит на практике' }: {
		items: Pair[];
		label: string;
		keyHead?: string;
		valueHead?: string;
	} = $props();
</script>

<table class="pairs">
	<caption class="sr-only">{label}</caption>
	<thead>
		<tr><th scope="col">{keyHead}</th><th scope="col">{valueHead}</th></tr>
	</thead>
	<tbody>
		{#each items as p (p.k)}
			<tr>
				<th scope="row">{p.k}</th>
				<td>{p.v}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.pairs {
		width: 100%;
		margin: 0;
		border-collapse: collapse;
		text-align: left;
		table-layout: fixed;
	}
	.pairs thead th {
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 400;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 0 0 8px;
		border-bottom: 1px solid var(--line-strong);
		vertical-align: bottom;
	}
	.pairs thead th:first-child {
		width: 30%;
		min-width: 180px;
	}
	.pairs tbody th,
	.pairs tbody td {
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}
	.pairs tbody th {
		padding-right: 28px;
		font-family: var(--mono);
		font-size: var(--fs-3);
		font-weight: 700;
		line-height: 1.4;
		color: var(--accent);
	}
	.pairs tbody td {
		font-size: var(--fs-4);
		line-height: 1.6;
		color: var(--ink-2);
	}
	.pairs tbody tr:last-child th,
	.pairs tbody tr:last-child td {
		border-bottom: 1px solid var(--line-strong);
	}

	/* На узком экране две колонки не помещаются — строка разворачивается в блок, как и раньше:
	   свойство сверху, значение под ним. Шапка таблицы при этом не нужна (подписи колонок теряют
	   смысл, когда колонок нет), но из дерева доступности она не исчезает: <caption> остаётся. */
	@media (max-width: 640px) {
		.pairs,
		.pairs tbody,
		.pairs tbody tr,
		.pairs tbody th,
		.pairs tbody td {
			display: block;
			width: auto;
		}
		.pairs thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
		}
		.pairs tbody tr {
			padding: 16px 0;
			border-bottom: 1px solid var(--line);
		}
		.pairs tbody tr:first-child {
			border-top: 1px solid var(--line-strong);
		}
		.pairs tbody tr:last-child {
			border-bottom: 1px solid var(--line-strong);
		}
		.pairs tbody th,
		.pairs tbody td {
			padding: 0;
			border: 0;
		}
		.pairs tbody td {
			margin-top: 6px;
		}
	}
</style>
