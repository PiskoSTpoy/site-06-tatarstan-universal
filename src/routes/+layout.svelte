<script lang="ts">
	import { page } from '$app/state';
	import '$lib/app.css';

	let { children } = $props();

	// Телефон сайта — один источник правды на шапку, футер и мобильную CTA-панель,
	// чтобы номер физически не мог разъехаться между блоками.
	const PHONE_HREF = 'tel:+79690849790';
	const PHONE_TEXT = '+7 (969) 084-97-90';

	// Мобильное меню — нативный <details>: разворачивается и закрывается без JavaScript,
	// сам сообщает скринридеру роль button и состояние expanded. Единственное удобство поверх
	// (Escape закрывает панель с возвратом фокуса на кнопку) живёт в static/enh.js — там же,
	// где scroll-reveal: оба механизма нужны на всех 38 страницах, а гидрируется только эта,
	// главная. Закрывать меню после навигации больше не нужно: переходы по ссылкам — обычная
	// навигация браузера (data-sveltekit-reload), лейаут строится заново.

	const SITE = 'https://kran-rt.ru';
	const BRAND = 'KRAN-RT';

	// Yandex.Metrika: собран как переменная, а не инлайн-разметка в svelte:head — литеральный
	// <script> внутри svelte:head/{@html} путает наивный парсер тегов Svelte (двойной подсчёт
	// фигурных скобок внутри IIFE ломает границу мустаща {@html ...}).
	const METRIKA_ID = 112124215;
	const metrikaSnippet =
		'<scr' + 'ipt type="text/javascript">' +
		"(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};" +
		"m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}" +
		"k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})" +
		`(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');` +
		`ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});` +
		'<' + '/scr' + 'ipt>' +
		`<noscript><div><img src="https://mc.yandex.ru/watch/${METRIKA_ID}" width="1" height="1" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`;

	// Указатель текущей страницы (волна 129). Раньше его не было ни в одном из двух меню:
	// человек, открывший «Парк техники», не видел в шапке никакого следа того, где он
	// находится, и скринридер тоже — атрибут aria-current на сайте не встречался ни разу.
	// Сравнение по ПРЕФИКСУ, а не по точному совпадению: раздел /park/ должен оставаться
	// отмеченным и на /park/xcmg-quy150/, иначе указатель гаснет ровно там, где ориентироваться
	// труднее всего — на третьем уровне вложенности. Главную в меню не отмечаем вовсе: её
	// префикс «/» совпал бы с любым адресом. Возвращается значение атрибута, а не булево, —
	// на неактивных ссылках атрибут не печатается вообще (Svelte опускает undefined).
	const cur = (href: string): 'page' | undefined =>
		page.url.pathname.startsWith(href) ? 'page' : undefined;

	// og:type. Статьи блога — article, всё остальное (включая сам список /blog/) — website.
	// Тип и адрес считаются из текущего пути, а не дублируются в 38 файлах: разъехаться
	// с canonical, который каждая страница пишет сама, тут нечему.
	const ogType = $derived(
		page.url.pathname.startsWith('/blog/') && page.url.pathname !== '/blog/' ? 'article' : 'website'
	);

	// Один узел организации на страницу и один общий @id на весь сайт. Раньше рядом жили
	// LocalBusiness (#business) и отдельный Organization (#organization) — для парсера это
	// две РАЗНЫЕ организации на одной странице, а блоговые статьи ссылались publisher/author
	// на #organization, то есть на узел, не связанный с карточкой бизнеса. LocalBusiness сам
	// является подтипом Organization, поэтому отдельный узел не нужен: остался один,
	// с тем @id, на который уже ссылаются статьи.
	const businessLd = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': SITE + '/#organization',
		name: BRAND,
		telephone: '+79690849790',
		email: 'info@kran-rt.ru',
		url: SITE,
		priceRange: '₽₽',
		address: { '@type': 'PostalAddress', addressRegion: 'Республика Татарстан', addressCountry: 'RU' },
		geo: { '@type': 'GeoCoordinates', latitude: 55.7963, longitude: 49.1088 },
		areaServed: 'Республика Татарстан',
		openingHours: 'Mo-Su 00:00-24:00',
	};
	// WebSite описывает сайт целиком, а не страницу, поэтому его место — только на главной
	// (см. src/routes/+page.svelte). В лейауте он повторялся на каждой из 37 страниц: для
	// парсера это 37 объявлений одного и того же объекта, полезного сигнала в них ноль.
</script>

<svelte:head>
	<!--
		Превью ссылки. og:title и og:description задаёт каждая страница сама (они у всех разные),
		а здесь — то, что одинаково на всём сайте. Картинка одна на сайт и намеренно без цифр:
		парк, стаж и телефон на ней появиться не могут, пока их не подтвердил заказчик.

		og:image:alt раньше был здесь как одна статичная строка на все страницы — альтернативный
		текст обязан описывать саму картинку, а не переписывать её на 38 разных ладов. Теперь он
		живёт в svelte:head каждой страницы рядом с её og:title (той же переменной title) — ровно
		там, где уже видно, что title у страницы свой. twitter:title/description по той же причине
		переехали туда же, к своим og-парам; здесь остаётся только twitter:image — он, как и
		og:image, один и тот же на весь сайт, поэтому дублировать его на 38 страницах незачем.
	-->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={SITE + page.url.pathname} />
	<meta property="og:site_name" content={BRAND} />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:image" content="{SITE}/og-cover.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="{SITE}/og-cover.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(businessLd)}<\/script>`}
	{@html metrikaSnippet}
</svelte:head>

<a href="#main-content" class="skip-link">Перейти к основному содержимому</a>

<header class="nav">
	<div class="nav__row">
		<a class="brand" href="/">KRAN<span>-RT</span></a>
		<nav class="nav__links" aria-label="Основная навигация">
			<a href="/dopusk/" aria-current={cur('/dopusk/')}>Чек-лист допуска</a>
			<a href="/obekty-opo/" aria-current={cur('/obekty-opo/')}>Объекты</a>
			<a href="/park/" aria-current={cur('/park/')}>Парк техники</a>
			<a href="/formy/" aria-current={cur('/formy/')}>Формы</a>
			<a href="/documents/" aria-current={cur('/documents/')}>Согласования</a>
			<a href="/faq/" aria-current={cur('/faq/')}>Вопросы</a>
			<a href={PHONE_HREF}>{PHONE_TEXT}</a>
		</nav>
		<!--
			Волна приёмки (31.08.2026). На десктопе шапка заканчивалась просто номером
			телефона — та же кнопка «Заказать кран», что и в мобильной ctabar-панели
			(ctabar__btn--primary, тот же якорь /#order), теперь видна и на широком экране.
		-->
		<a class="nav__order-btn" href="/#order">Заказать кран</a>

		<details class="mnav">
			<summary class="mnav__toggle">
				<span class="mnav__bars" aria-hidden="true"></span>
				Меню
			</summary>
			<nav class="mnav__panel" aria-label="Мобильная навигация">
				<a href="/dopusk/" aria-current={cur('/dopusk/')}>Чек-лист допуска</a>
				<a href="/obekty-opo/" aria-current={cur('/obekty-opo/')}>Объекты и режимы</a>
				<a href="/park/" aria-current={cur('/park/')}>Парк техники</a>
				<a href="/formy/" aria-current={cur('/formy/')}>Формы и бланки</a>
				<a href="/geo/kazan/" aria-current={cur('/geo/')}>География</a>
				<a href="/blog/" aria-current={cur('/blog/')}>Блог</a>
				<a href="/documents/" aria-current={cur('/documents/')}>Согласования</a>
				<a href="/faq/" aria-current={cur('/faq/')}>Вопросы</a>
				<a href="/kontakty/" aria-current={cur('/kontakty/')}>Контакты</a>
				<a href={PHONE_HREF}>{PHONE_TEXT}</a>
			</nav>
		</details>
	</div>
</header>

<div id="main-content" tabindex="-1">{@render children()}</div>

<!--
	Подвал сквозной: ссылки на политику и на согласие обязаны быть на КАЖДОЙ странице, а не
	только рядом с формой. Это два разных документа на двух разных URL — с 01.09.2025 согласие
	не может быть разделом политики, и склеивать их в одну ссылку нельзя.
-->
<footer class="footer wrap">
	<span>© 2026 {BRAND} · kran-rt.ru</span>
	<nav class="footer__legal" aria-label="Контакты и правовые документы">
		<a href="/kontakty/">Контакты</a>
		<a href="/politika-obrabotki-personalnyh-dannyh/">Политика обработки ПД</a>
		<a href="/soglasie-na-obrabotku-personalnyh-dannyh/">Согласие на обработку ПД</a>
	</nav>
	<a href={PHONE_HREF}>{PHONE_TEXT}</a>
</footer>

<!--
	Мобильная CTA-панель. Две обычные ссылки — работает полностью без JavaScript.
	Видна только до 760px (на десктопе display:none, из дерева доступности исчезает вместе с
	отображением). Тап-таргеты 48px по высоте и не менее 44px по ширине. Никакой анимации —
	показывать/скрывать нечего, поэтому prefers-reduced-motion выполняется по построению.
	В DOM стоит последней: визуально это «последний» элемент экрана, и порядок табуляции
	(WCAG 2.4.3) совпадает с этим.
-->
<nav class="ctabar" aria-label="Быстрые действия">
	<a class="ctabar__btn ctabar__btn--primary" href="/#order">Заказать кран</a>
	<a class="ctabar__btn ctabar__btn--ghost" href={PHONE_HREF}>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5C11.4 18.3 5.7 12.6 5 4.7A1.5 1.5 0 0 1 6.5 3.5Z"/></svg>
		Позвонить
	</a>
</nav>

<style>
	/* ---------- правовые ссылки в подвале ---------- */
	.footer__legal {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
	}
	.footer__legal a {
		/* тап-таргет по высоте — подвал остаётся кликабельным пальцем на телефоне */
		display: inline-flex;
		align-items: center;
		min-height: 32px;
		text-decoration: none;
		border-bottom: 1px solid var(--line-strong);
	}
	.footer__legal a:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	/* ---------- мобильное меню (гамбургер на <details>) ---------- */
	.mnav {
		display: none;
	}
	.mnav__toggle {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		min-width: 44px;
		padding: 0 4px;
		cursor: pointer;
		list-style: none;
		font-family: var(--mono);
		font-size: var(--fs-3);
		/* PT Mono существует только в 400; вес как средство выделения заменён трекингом */
		font-weight: 400;
		letter-spacing: 0.04em;
	}
	.mnav__toggle::-webkit-details-marker {
		display: none;
	}
	.mnav__bars {
		position: relative;
		display: block;
		width: 20px;
		height: 2px;
		background: var(--accent);
	}
	.mnav__bars::before,
	.mnav__bars::after {
		content: '';
		position: absolute;
		left: 0;
		width: 20px;
		height: 2px;
		background: var(--accent);
	}
	.mnav__bars::before {
		top: -6px;
	}
	.mnav__bars::after {
		top: 6px;
	}
	.mnav[open] .mnav__bars {
		background: transparent;
	}
	.mnav[open] .mnav__bars::before {
		top: 0;
		transform: rotate(45deg);
	}
	.mnav[open] .mnav__bars::after {
		top: 0;
		transform: rotate(-45deg);
	}
	.mnav__panel {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 25;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		border-bottom: 1px solid var(--line-strong);
		/* На низком экране (мобильный ландшафт) список из 8 пунктов не должен уезжать под
		   закреплённую CTA-панель: ограничиваем высоту и включаем прокрутку внутри панели. */
		max-height: calc(100vh - 165px);
		max-height: calc(100dvh - 165px);
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 6px var(--pad) 12px;
		font-family: var(--mono);
		font-size: var(--fs-4);
		font-weight: 400;
		letter-spacing: 0.02em;
	}
	.mnav__panel a {
		display: flex;
		align-items: center;
		min-height: 48px;
		text-decoration: none;
		border-bottom: 1px solid var(--line);
	}
	.mnav__panel a:last-child {
		border-bottom: none;
		color: var(--accent);
	}
	.mnav__panel a:active {
		background: var(--screen);
	}
	/* Текущий раздел в мобильном меню. Здесь указатель — вертикальная рейка слева и заливка
	   строки, а не подчёркивание: в вертикальном списке подчёркивание сливается с разделителями
	   строк, которые уже стоят. Два признака помимо цвета — рейка и фон. */
	.mnav__panel a[aria-current='page'] {
		color: var(--accent);
		background: var(--screen);
		box-shadow: inset 2px 0 0 var(--accent);
		padding-left: 10px;
	}
	@media (max-width: 760px) {
		.mnav {
			display: block;
		}
	}

	/* ---------- закреплённая снизу CTA-панель (только мобильные) ---------- */
	.ctabar {
		display: none;
	}
	@media (max-width: 760px) {
		.ctabar {
			display: grid;
			grid-template-columns: 1.3fr 1fr;
			gap: 10px;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			/* выше контента, шапки (20) и полосы прогресса чтения (30); ниже skip-ссылки (100) */
			z-index: 40;
			padding: 12px 14px;
			padding-bottom: max(12px, env(safe-area-inset-bottom));
			background: rgba(15, 21, 18, 0.97);
			backdrop-filter: blur(8px);
			border-top: 1px solid var(--line-strong);
		}
	}
	.ctabar__btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		/* тап-таргет: 48px по высоте, минимум 44px по ширине — с запасом к WCAG 2.5.5 (44×44) */
		min-height: 48px;
		min-width: 44px;
		padding: 0 12px;
		font-family: var(--mono);
		font-size: var(--fs-4);
		font-weight: 400;
		letter-spacing: 0.03em;
		text-decoration: none;
		text-align: center;
	}
	.ctabar__btn svg {
		width: 17px;
		height: 17px;
		flex-shrink: 0;
	}
	/* контраст замерен: тёмный текст на --accent = 9.26:1, --accent на --surface = 8.60:1,
	   рамка --accent к фону = 8.60:1 (WCAG 1.4.3 и 1.4.11 с большим запасом) */
	.ctabar__btn--primary {
		background: var(--accent);
		color: #0f1512;
	}
	.ctabar__btn--ghost {
		background: var(--surface);
		color: var(--accent);
		border: 1px solid var(--accent);
	}
	/* Нажатие на закреплённой панели. Это единственные две кнопки, которые на телефоне видны
	   всегда, и до этой волны они не отзывались на палец ничем. */
	.ctabar__btn--primary:active {
		background: var(--accent-deep);
	}
	.ctabar__btn--ghost:active {
		background: var(--screen);
		border-color: var(--accent-deep);
		color: var(--accent-deep);
	}
	/* На зелёной кнопке глобальная зелёная обводка фокуса была бы не видна — рисуем тёмное
	   кольцо внутри (контраст к --accent 9.26:1). У «призрачной» кнопки фон тёмный, поэтому
	   глобальной зелёной обводки достаточно (8.6:1 к фону панели). */
	.ctabar__btn--primary:focus-visible {
		outline: 3px solid #0f1512;
		outline-offset: -5px;
	}
</style>
