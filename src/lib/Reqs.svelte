<script lang="ts">
	/*
	 * Строка требования — базовый компонент раздела допуска (волна 16).
	 *
	 * Страницы этого сайта устроены не как «услуга» (заголовок → продающий абзац → кнопка), а как
	 * документ: каждое требование раскладывается на четыре поля — ЧТО нужно, НА КАКОМ основании,
	 * КТО оформляет и ЧТО СО СРОКОМ. Это ровно те четыре вопроса, на которые заказчик всё равно
	 * будет искать ответ, только обычно — по телефону и в день выезда техники.
	 *
	 * Разметка — <table>. Четыре поля с одинаковыми подписями, повторённые на каждой строке, это
	 * определение таблицы параметров; прежняя пара <ol> + <dl> описывала то же самое, но подписи
	 * колонок при этом печатались заново в каждой строке, а связь «эта ячейка относится вот к
	 * этому требованию» существовала только визуально. В таблице она выражена: заголовок строки
	 * (<th scope="row">) — само требование, заголовки колонок — четыре поля.
	 *
	 * Визуально на широком экране это ощутимо плотнее прежнего: подписи «Основание / Кто
	 * оформляет / Срок» теперь стоят один раз в шапке, а не по три раза на каждое требование.
	 * Нумерация сохранена (по номеру пункта ссылаются в разговоре с заказчиком) и осталась
	 * декоративной — она рисуется CSS-счётчиком, в текст ячеек не попадает.
	 *
	 * На узком экране таблица разворачивается в прежний вид: требование сверху, три подписанных
	 * поля под ним — там подписи в каждой строке действительно нужны, потому что колонок нет.
	 */

	import type { ReqItem } from './req';

	let { items, label }: { items: ReqItem[]; label: string } = $props();
</script>

<table class="reqs">
	<caption class="sr-only">{label}</caption>
	<thead>
		<tr>
			<th scope="col">Что нужно</th>
			<th scope="col">Основание</th>
			<th scope="col">Кто оформляет</th>
			<th scope="col">Срок</th>
		</tr>
	</thead>
	<tbody>
		{#each items as r (r.what)}
			<tr class="req">
				<th scope="row" class="req__what">{r.what}</th>
				<td data-f="Основание">{r.basis}</td>
				<td data-f="Кто оформляет">{r.who}</td>
				<td data-f="Срок">{r.term}</td>
			</tr>
			{#if r.note}
				<tr class="req__noterow"><td colspan="4"><span class="req__note">{r.note}</span></td></tr>
			{/if}
		{/each}
	</tbody>
</table>

<style>
	.reqs {
		width: 100%;
		margin: 0;
		border-collapse: collapse;
		text-align: left;
		counter-reset: req;
	}
	.reqs thead th {
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		padding: 0 22px 8px 0;
		border-bottom: 1px solid var(--line-strong);
		vertical-align: bottom;
	}
	.reqs thead th:first-child {
		width: 34%;
		padding-left: 46px;
	}
	.req > * {
		padding: 20px 22px 20px 0;
		vertical-align: top;
	}
	/* Номер требования — не декор: по нему в разговоре с заказчиком ссылаются на пункт списка.
	   Счётчик увеличивается на строке требования и не увеличивается на строке сноски. */
	.req {
		counter-increment: req;
	}
	.req__what {
		position: relative;
		padding-left: 46px;
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-5);
		line-height: 1.35;
		color: var(--ink);
	}
	.req__what::before {
		content: counter(req, decimal-leading-zero);
		position: absolute;
		left: 0;
		top: 20px;
		font-family: var(--mono);
		font-size: var(--fs-3);
		font-weight: 400;
		letter-spacing: 0.06em;
		color: var(--accent);
	}
	.req td {
		font-size: var(--fs-3);
		line-height: 1.5;
		color: var(--ink-2);
	}
	.reqs tbody tr:not(.req__noterow) > * {
		border-bottom: 1px solid var(--line);
	}
	.req__noterow > td {
		padding: 0 0 20px 46px;
		border-bottom: 1px solid var(--line);
	}
	/* Сноска относится к требованию над ней, а не к колонке «Что нужно»: строка сноски идёт
	   сразу за строкой требования, растянута на все четыре колонки, и линия между ними не
	   рисуется — иначе сноска выглядела бы отдельным пунктом. */
	.reqs tbody tr:not(.req__noterow):has(+ .req__noterow) > * {
		border-bottom: 0;
	}
	.req__note {
		display: block;
		font-size: var(--fs-3);
		line-height: 1.55;
		color: var(--muted);
		border-left: 2px solid var(--line-strong);
		padding-left: 12px;
	}
	.reqs tbody tr:last-child > * {
		border-bottom: 1px solid var(--line-strong);
	}

	/* Узкий экран — прежняя раскладка: требование, под ним три подписанных поля, ниже сноска.
	   Подписи полей возвращаются в строки из data-f, потому что колонок здесь уже нет. */
	@media (max-width: 720px) {
		.reqs,
		.reqs tbody,
		.reqs tbody tr,
		.reqs tbody th,
		.reqs tbody td {
			display: block;
			width: auto;
		}
		.reqs thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
		}
		.req {
			padding: 20px 0 20px 34px;
			border-bottom: 1px solid var(--line);
		}
		.req:has(+ .req__noterow) {
			border-bottom: 0;
			padding-bottom: 12px;
		}
		.req > * {
			padding: 0;
			border-bottom: 0 !important;
		}
		.req__what {
			padding-left: 0;
		}
		.req__what::before {
			left: -34px;
			top: 2px;
		}
		.req td {
			margin-top: 10px;
		}
		.req td::before {
			content: attr(data-f);
			display: block;
			margin-bottom: 4px;
			font-family: var(--mono);
			font-size: var(--fs-1);
			font-weight: 400;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--accent);
		}
		.req__noterow > td {
			padding: 0 0 20px 34px;
		}
		.reqs tbody tr:last-child > * {
			border-bottom: 0 !important;
		}
		.reqs tbody tr:last-child {
			border-bottom: 1px solid var(--line-strong);
		}
	}
</style>
