<script lang="ts">
	/*
	 * Приборная сводка первого экрана (мобильная волна).
	 *
	 * Зачем. Замеры прошлых волн показывали чистую разметку, но на кадре 375×812 первый экран
	 * главной был стеной прозы: надзаголовок в две строки, h1 в три, лид в девять — и НИ ОДНОЙ
	 * цифры цены на всей странице (проверено grep по сборке: символа ₽ в index.html не было
	 * вовсе, ставки жили внутри <details> третьего шага чек-листа). Человек в руке за две
	 * секунды не узнавал ни что арендуем, ни за сколько.
	 *
	 * Что это. Тот же «прибор», что уже есть в языке сайта: металлическая ОБОЙМА (--surface)
	 * с вставленным ЭКРАНОМ (--screen), внутри — реестровые строки «лейбл → значение».
	 * Регистрационных меток (.marks) здесь СОЗНАТЕЛЬНО НЕТ: design-code.md разрешает им ровно
	 * два места на сайт (первый экран-панель и плашка проверенных цифр), третье повторение
	 * превратило бы приём в обои.
	 *
	 * Схемный силуэт (art) — сжатый вариант линии HeroIllustration.svelte: те же обводки
	 * (--accent на стреле, --line-strong на корпусе, пунктир --muted на канате), без выносок
	 * и без параллакса. Он нужен там, где на первом экране своего графического мотива нет
	 * вообще (главная): точка 4 брифа. На /park/ мотив уже есть — там art не включаем, чтобы
	 * не ставить два крана подряд.
	 *
	 * Цифры. Компонент НИЧЕГО не считает и не придумывает: всё приходит пропсами из данных,
	 * которые уже опубликованы на сайте (реестр парка на /park/, режимы допуска в /obekty-opo/*).
	 */
	type Row = { label: string; value: string; strong?: boolean };

	let {
		rows,
		art = false,
		note = '',
		noteHref = '',
		noteLink = '',
	}: {
		/** строки реестра: лейбл слева, значение справа; strong — денежная строка (акцент) */
		rows: Row[];
		/** показывать схемный силуэт крана слева (только там, где мотива на экране больше нет) */
		art?: boolean;
		/** оговорка под сводкой — по конвенции сайта цифра цены не ходит без источника */
		note?: string;
		noteHref?: string;
		noteLink?: string;
	} = $props();
</script>

<div class="rig" class:rig--art={art}>
	{#if art}
		<!-- Полоса-экран во всю ширину сводки, а не колонка слева. Колонкой силуэт вставал
		     рядом с двумя строками реестра и растягивался по их высоте: крохотный кран
		     посреди пустой рамки в 200px, а денежная строка в оставшейся ширине ломалась
		     на «от 20 000 / ₽». Широкая полоса в пропорции 480×110 даёт крану нормальный
		     масштаб, стоит 64px высоты на 375px и оставляет реестру всю ширину. -->
		<div class="rig__screen" aria-hidden="true">
			<svg class="rig__svg" viewBox="0 0 480 110" xmlns="http://www.w3.org/2000/svg" focusable="false">
				<g>
					{#each Array(13) as _, i}
						<line x1={i * 40} y1="0" x2={i * 40} y2="110" class="rig__gridline" />
					{/each}
					{#each Array(6) as _, i}
						<line x1="0" y1={i * 22} x2="480" y2={i * 22} class="rig__gridline" />
					{/each}
				</g>
				<line x1="16" y1="96" x2="464" y2="96" class="rig__ground" />
				<!-- аутригеры -->
				<line x1="142" y1="85" x2="167" y2="85" class="rig__stroke" />
				<circle cx="142" cy="85" r="2.5" class="rig__pad" />
				<line x1="251" y1="85" x2="277" y2="85" class="rig__stroke" />
				<circle cx="277" cy="85" r="2.5" class="rig__pad" />
				<!-- шасси и кабина -->
				<rect x="167" y="66" width="84" height="19" rx="2" class="rig__body" />
				<rect x="170" y="51" width="21" height="16" rx="2" class="rig__body" />
				<!-- противовес -->
				<rect x="237" y="56" width="12" height="13" class="rig__counter" />
				<!-- колёса -->
				<circle cx="183" cy="88" r="6" class="rig__wheel" />
				<circle cx="201" cy="88" r="6" class="rig__wheel" />
				<circle cx="227" cy="88" r="6" class="rig__wheel" />
				<circle cx="242" cy="88" r="6" class="rig__wheel" />
				<!-- стрела, канат, груз -->
				<line x1="191" y1="54" x2="278" y2="23" class="rig__boom" />
				<line x1="278" y1="23" x2="278" y2="49" class="rig__cable" />
				<rect x="270" y="49" width="17" height="12" class="rig__load" />
			</svg>
		</div>
	{/if}

	<dl class="rig__rows">
		{#each rows as r (r.label)}
			<div class="rig__row">
				<dt class="rig__label">{r.label}</dt>
				<dd class="rig__value" class:is-money={r.strong}>{r.value}</dd>
			</div>
		{/each}
	</dl>
</div>

{#if note}
	<p class="rig__note">
		{note}{#if noteHref && noteLink}&nbsp;<a href={noteHref}>{noteLink}</a>{/if}
	</p>
{/if}

<style>
	/* Обойма: металл снаружи, экран внутри — устройство панели по design-code.md. */
	.rig {
		margin-top: 18px;
		border: 1px solid var(--line-strong);
		background: var(--surface);
		padding: 10px;
		display: grid;
		gap: 10px;
	}
	.rig__screen {
		background: var(--screen);
		border: 1px solid var(--line);
		display: block;
		min-width: 0;
	}
	.rig__svg {
		width: 100%;
		height: auto;
		display: block;
	}
	.rig__gridline {
		stroke: var(--line);
		stroke-width: 1;
	}
	.rig__stroke {
		stroke: var(--line-strong);
		stroke-width: 2;
		fill: none;
	}
	.rig__ground {
		stroke: var(--line);
		stroke-width: 1.2;
	}
	.rig__pad {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.2;
	}
	.rig__body {
		fill: var(--surface);
		stroke: var(--line-strong);
		stroke-width: 1.2;
	}
	.rig__counter {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.2;
	}
	.rig__wheel {
		fill: var(--screen);
		stroke: var(--line-strong);
		stroke-width: 1.4;
	}
	.rig__boom {
		stroke: var(--accent);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.rig__cable {
		stroke: var(--muted);
		stroke-width: 1.2;
		stroke-dasharray: 3 3;
	}
	.rig__load {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 1.2;
	}

	/* Экран со строками реестра. Строка — лейбл сверху, значение снизу: на 320px пара
	   «лейбл ← → значение» в одну линию упирается в ширину и рвёт денежную строку. */
	.rig__rows {
		margin: 0;
		background: var(--screen);
		border: 1px solid var(--line);
		display: grid;
		grid-template-columns: 1fr;
	}
	.rig__row {
		padding: 9px 12px;
		display: grid;
		gap: 2px;
		min-width: 0;
	}
	.rig__row + .rig__row {
		border-top: 1px solid var(--line);
	}
	.rig__label {
		font-family: var(--mono);
		font-size: var(--fs-1);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.rig__value {
		margin: 0;
		font-family: var(--mono);
		font-size: var(--fs-4);
		line-height: 1.35;
		color: var(--ink);
		overflow-wrap: break-word;
	}
	/* Денежная строка — единственная, которой разрешён крупный кегль: она и есть ответ
	   на вопрос, ради которого человек открыл страницу. */
	.rig__value.is-money {
		font-size: var(--fs-7);
		color: var(--accent);
		letter-spacing: 0.01em;
	}
	.rig__note {
		margin-top: 8px;
		font-size: var(--fs-1);
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
	}
	.rig__note a {
		color: var(--accent);
		text-underline-offset: 2px;
	}

	/* На широком экране сводка становится горизонтальной лентой: колонки в ряд, силуэт
	   слева. Первый экран десктопа этой волной не переделывается — лента просто не должна
	   растягивать три строки на всю ширину 1160px. */
	@media (min-width: 620px) {
		.rig__rows {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		}
		.rig__row + .rig__row {
			border-top: none;
			border-left: 1px solid var(--line);
		}
	}
	@media (min-width: 900px) {
		.rig {
			max-width: 720px;
		}
	}
</style>
