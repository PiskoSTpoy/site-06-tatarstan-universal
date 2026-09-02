<script lang="ts">
	import Pairs from '$lib/Pairs.svelte';
	import Sources from '$lib/Sources.svelte';

	const SITE = 'https://kran-rt.ru';
	const CHECKED = '19.08.2026';

	const title = 'Формы и бланки допуска: наряд-допуск, журналы, пропуск';
	const description =
		'Карта форм из ФНП №528 и №531: наряд-допуск на газоопасные, огневые и ремонтные работы, перечень работ, журналы. Кто подписывает и сколько хранится.';
	const forms = [
		{
			href: '/formy/naryad-dopusk-blank/',
			name: 'Наряд-допуск на проведение газоопасных работ',
			what: 'Кто подписывает и утверждает, сколько экземпляров, срок действия и продление, хранение',
		},
		{
			href: '/formy/naryad-i-propusk/',
			name: 'Наряд-допуск, наряд-допуск и пропуск — три разных документа',
			what: 'Чем допуск на работу отличается от допуска на территорию и от наряда по охране труда',
		},
		{
			href: '/formy/oshibki-zapolneniya/',
			name: 'Типовые ошибки заполнения и оформления',
			what: 'Один наряд на весь объект, карандаш, устаревшая редакция, акт без ссылки на номер',
		},
		{
			href: '/formy/naryad-dopusk-ognevye-raboty/',
			name: 'Наряд-допуск на огневые работы — второй документ из того же приказа',
			what: 'Другое согласование, свой контроль места после завершения работ, когда нужен вместе с газоопасным',
		},
		{
			href: '/formy/naryad-dopusk-remontnye-raboty/',
			name: 'Наряд-допуск на ремонтные работы — третий документ из того же приказа',
			what: 'Действует весь период ремонта, а не смену; один экземпляр получает подрядчик',
		},
		{
			href: '/formy/gruppa-ii-zhurnal-bez-naryada/',
			name: 'Группа II — когда наряд-допуск не нужен, а хватает журнала',
			what: 'Чем группа I отличается от группы II и почему кран почти всегда попадает в первую',
		},
		{
			href: '/formy/naryad-dopusk-gazoraspredelenie-531/',
			name: 'Наряд-допуск для сетей газораспределения — форма другого приказа, ФНП №531',
			what: 'Кто выдаёт и получает, срок хранения, когда наряд можно вести только в электронном виде',
		},
	];

	const map528 = [
		{ k: 'Приложение №1 к ФНП №528', v: 'Перечень газоопасных работ — рекомендуемый образец. Утверждает руководитель эксплуатирующей организации, пересматривается не реже одного раза в год. Именно этот документ отвечает на вопрос, нужен ли на вашей точке наряд-допуск.' },
		{ k: 'Приложение №2 к ФНП №528', v: 'Наряд-допуск на проведение газоопасных работ. Оформляется на работы I группы, в двух экземплярах, действует одну смену.' },
		{ k: 'Приложение №3 к ФНП №528', v: 'Журнал учёта газоопасных работ, проводимых без оформления наряда-допуска, — для работ II группы. Регистрация обязательна перед началом каждой работы.' },
		{ k: 'Приложение №4 к ФНП №528', v: 'Наряд-допуск на выполнение огневых работ. Отдельный документ: сварка и резка на объекте оформляются не тем же бланком, что подъём груза в газоопасной зоне.' },
		{ k: 'Приложение №5 к ФНП №528', v: 'Наряд-допуск на проведение ремонтных работ. Если газоопасные работы идут в составе планового ремонта, наряд выдаётся на весь период ремонта с ежедневным продлением не более чем на одну рабочую смену.' },
		{ k: 'Приложение №1 к ФНП №531', v: 'Наряд-допуск на производство газоопасных работ на сетях газораспределения и газопотребления — другая форма для другого типа объектов. Приложение №2 к тем же правилам — журнал регистрации таких нарядов.' },
	];

	const sources = [
		{
			label: 'Приказ Ростехнадзора от 15.12.2020 №528 — приложения №1–5 (перечень, наряды-допуски, журнал)',
			href: 'https://www.consultant.ru/document/cons_doc_LAW_372483/',
		},
		{
			label: 'Приказ Ростехнадзора от 15.12.2020 №531 — приложения №1 и №2 (наряд-допуск и журнал регистрации)',
			href: 'https://www.consultant.ru/document/cons_doc_LAW_373425/',
		},
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Формы и бланки', item: `${SITE}/formy/` },
		],
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/formy/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image:alt" content={title} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
</svelte:head>

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><span>Формы и бланки</span>
	</nav>

	<section class="section wrap" style="padding-top:8px">
		<div class="section-head">
			<span class="eyebrow">Формы и бланки</span>
			<h1>Какая бумага чем является</h1>
			<p>
				Слово «допуск» на промышленной площадке означает минимум 3 разных документа, и путаница между ними —
				самая частая причина, по которой кран простаивает у ворот.</p>
			<p>Здесь разобрано, какая форма к какому случаю
				относится, кто её подписывает и сколько она действует. Сами бланки построчно мы не воспроизводим:
				рекомендуемые образцы опубликованы в приказах, и неточная перепечатка была бы хуже ссылки на оригинал.
			</p>
		</div>

		<ul class="flist">
			{#each forms as f (f.href)}
				<li>
					<a class="flist__link" href={f.href}>
						<span class="flist__name">{f.name}</span>
						<span class="flist__what">{f.what}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="section wrap" style="padding-top:0">
		<div class="section-head">
			<span class="eyebrow">Карта приложений</span>
			<h2>Шесть форм, между которыми выбирают</h2>
			<p>
				Два приказа Ростехнадзора от одной даты, 15 декабря 2020 года, содержат шесть разных рекомендуемых
				образцов. Ниже — что где лежит, чтобы не искать наряд-допуск на огневые работы в правилах для
				газораспределительных сетей.
			</p>
		</div>
		<div style="max-width:880px">
			<Pairs items={map528} keyHead="Форма" valueHead="Когда применяется" label="Формы из ФНП №528 и №531" />
		</div>
	</section>

	<section class="section wrap prose" style="padding-top:0;max-width:840px">
		<h2 style="margin-bottom:16px">Почему «рекомендуемый образец» — это не «необязательный»</h2>
		<p>
			Формулировка в приказах именно такая: рекомендуемый образец. На практике это значит, что предприятие вправе
			вести собственный бланк, если в нём есть всё, что требуют правила, — и крупные производства этим
			пользуются, дополняя форму своими графами.</p>
		<p>Для подрядчика по крану вывод простой: не удивляться, что бланк
			на площадке отличается от того, что опубликован в приказе, и не спорить о форме. Спорить имеет смысл только
			о содержании: группа работ, срок действия, состав бригады, подписи — это уже не рекомендация.
		</p>

		<h2 style="margin:36px 0 16px">Что со стороны крановой службы попадает в документы</h2>
		<p>
			Мы не подписываем наряд-допуск: его подписывает руководитель структурного подразделения предприятия,
			согласовывает газоспасательная служба и утверждает руководитель эксплуатирующей организации.</p>
		<p>Со своей
			стороны мы передаём то, без чего документ не заполнить: данные о технике и операторе, характер планируемой
			работы, состав бригады и средства защиты, которые будут применяться. Отсюда практическое следствие: чем
			раньше названы адрес и тип объекта, тем раньше эти данные уходят на площадку — и тем меньше вероятность, что
			дата сдвинется из-за неполного пакета.
		</p>

		<p style="margin-top:24px">
			Что оформляется по шагам — в <a href="/dopusk/" style="color:var(--accent)">чек-листе допуска</a>. По какому
			из двух регламентов работает конкретная площадка — в статье
			<a href="/blog/fnp-531-ili-528-naryad-dopusk/" style="color:var(--accent)">«ФНП №531 или приказ №528»</a>.
		</p>

		<Sources items={sources} date={CHECKED} />
	</section>

	<section class="section wrap" style="padding-top:0">
		<a class="btn" href="/#order">Прислать бланк с площадки — разберём вместе →</a>
	</section>
</main>

<style>
	/* Список форм — не карточки: строки описи с именем документа и подписью, что внутри.
	   Отличается от реестра объектов отсутствием кода и счётчика: у форм нет иерархии. */
	.flist {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
	}
	.flist li {
		border-bottom: 1px solid var(--line);
	}
	.flist li:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.flist__link {
		display: grid;
		gap: 6px;
		padding: 20px 8px 20px 22px;
		position: relative;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.flist__link::before {
		content: '›';
		position: absolute;
		left: 0;
		top: 19px;
		font-family: var(--mono);
		font-size: var(--fs-6);
		font-weight: 700;
		color: var(--accent);
	}
	.flist__link:hover {
		background: var(--surface);
	}
	.flist__link:hover .flist__name {
		color: var(--accent);
	}
	.flist__name {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-5);
		line-height: 1.35;
		transition: color 0.16s ease;
	}
	.flist__what {
		font-size: var(--fs-3);
		line-height: 1.5;
		color: var(--muted);
	}
	@supports (content: 'x' / 'y') {
		.flist__link::before {
			content: '›' / '';
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.flist__link,
		.flist__name {
			transition: none;
		}
	}
</style>
