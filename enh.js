/*
 * enh.js — прогрессивные улучшения, общие для всех страниц сайта.
 *
 * Зачем отдельным файлом, а не компонентами Svelte. Содержательная часть сайта — 37 страниц
 * статического текста: чек-листы, разборы норм, реестр парка. Гидрация им не нужна ни для
 * чего, но SvelteKit по умолчанию отдаёт каждой из них собственный чанк с копией всей
 * разметки страницы в виде JS (15–26 КБ) плюс общий рантайм — 103–133 КБ на страницу ради
 * четырёх декоративных механизмов. Поэтому клиентский рендер оставлен ровно там, где без него
 * не работает функциональность (главная: калькулятор допуска и форма заявки), а эти четыре
 * механизма переписаны здесь на обычном DOM API — 4 КБ на весь сайт.
 *
 * Все четыре — именно улучшения: без этого файла страница остаётся полностью читаемой,
 * оглавление работает якорями, цифры показывают финальные значения, меню открывается
 * нативным <details>. Ничего не создаётся с нуля: скрипт только переключает классы на
 * разметке, которая уже пришла с сервера, — поэтому scoped-стили Svelte к ней применяются.
 */
(function () {
	'use strict';

	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ── 1. scroll-reveal для .section ────────────────────────────────────────
	   Класс js-reveal на <html> включает стартовое состояние (см. app.css). Он ставится
	   только отсюда: при выключенном JS или при prefers-reduced-motion правило не действует
	   вовсе и весь контент виден сразу. Таймаут-фолбэк — предохранитель на случай, когда
	   IntersectionObserver придушен в фоновой вкладке: контент не должен остаться невидимым. */
	function reveal() {
		if (reduce) return;
		var sections = document.querySelectorAll('.section');
		if (!sections.length) return;
		document.documentElement.classList.add('js-reveal');
		var io = new IntersectionObserver(
			function (entries) {
				for (var i = 0; i < entries.length; i++) {
					if (entries[i].isIntersecting) {
						entries[i].target.classList.add('is-visible');
						io.unobserve(entries[i].target);
					}
				}
			},
			/* Волна 133. Порог был 0.12 — ДОЛЯ ПЛОЩАДИ секции в кадре. Для секции высотой в
			   несколько экранов такая доля физически недостижима: /dopusk/ держит весь чек-лист
			   из девяти пунктов в одной секции высотой 5262px, в кадре 375×812 её видно
			   609px (812 минус шапка и минус 60px rootMargin) — это 11,6%, то есть НИЖЕ порога.
			   Наблюдатель не срабатывал ни разу, и первый экран страницы оставался пустым до
			   срабатывания таймаут-предохранителя — 2,5 секунды белого... точнее, чёрного
			   ничего в руке. Порог зависел от высоты страницы, то есть ломался от любой правки
			   контента: /dopusk/ перешагнул границу, когда секция выросла на 300px.
			   threshold: 0 снимает зависимость от высоты вовсе — секция проявляется, как
			   только вошла в кадр на 60px (это и есть смысл rootMargin ниже). */
			{ threshold: 0, rootMargin: '0px 0px -60px 0px' }
		);
		for (var i = 0; i < sections.length; i++) io.observe(sections[i]);
		setTimeout(function () {
			for (var j = 0; j < sections.length; j++) sections[j].classList.add('is-visible');
		}, 2500);
	}

	/* ── 2. Escape закрывает мобильное меню ──────────────────────────────────
	   Меню — нативный <details>, открывается и закрывается без скрипта и само сообщает
	   скринридеру роль и состояние. Здесь добавлено единственное удобство поверх: Escape
	   закрывает панель и возвращает фокус на кнопку, которая её открыла. */
	function escapeClosesMenu() {
		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Escape') return;
			var menu = document.querySelector('details.mnav[open]');
			if (!menu) return;
			menu.open = false;
			var summary = menu.querySelector('summary');
			if (summary) summary.focus();
		});
	}

	/* ── 3. Полоса прогресса чтения статьи ───────────────────────────────────
	   Разметка полосы приходит с сервера со scaleX(0) — то есть при выключенном JS она есть
	   в DOM, но не видна и честно сообщает aria-valuenow="0". Скрипт двигает её по доле
	   прочитанного внутри <article>. Пересчёт напрямую на scroll/resize, без rAF-троттлинга:
	   расчёт дешёвый (один getBoundingClientRect), а rAF засыпает в фоновой вкладке и полоса
	   не догоняла бы фактический скролл при возврате на неё. */
	function readingProgress() {
		var rp = document.querySelector('[data-rp-target]');
		if (!rp) return;
		var article = document.querySelector(rp.getAttribute('data-rp-target'));
		var bar = rp.querySelector('.rp__bar');
		if (!article || !bar) return;

		function compute() {
			var rect = article.getBoundingClientRect();
			var vh = window.innerHeight || document.documentElement.clientHeight;
			var total = Math.max(1, rect.height - vh);
			var scrolled = Math.min(total, Math.max(0, -rect.top));
			var p = Math.min(1, Math.max(0, scrolled / total));
			bar.style.transform = 'scaleX(' + p + ')';
			rp.setAttribute('aria-valuenow', String(Math.round(p * 100)));
		}
		compute();
		window.addEventListener('scroll', compute, { passive: true });
		window.addEventListener('resize', compute, { passive: true });
	}

	/* ── 4. Подсветка активного пункта оглавления ────────────────────────────
	   Только десктопный вариант оглавления (мобильный обычно свёрнут — наблюдать впустую
	   незачем). Сами ссылки — обычные <a href="#id">, якорная навигация работает и без
	   скрипта; подсветка это цвет, а не движение, поэтому она остаётся и при
	   prefers-reduced-motion. */
	function tocSpy() {
		var toc = document.querySelector('[data-toc-desktop]');
		if (!toc) return;
		var links = toc.querySelectorAll('a[href^="#"]');
		if (links.length < 3) return;

		var items = [];
		for (var i = 0; i < links.length; i++) {
			var el = document.getElementById(decodeURIComponent(links[i].getAttribute('href').slice(1)));
			if (el) items.push({ heading: el, li: links[i].parentElement });
		}
		if (!items.length) return;

		function setActive(li) {
			for (var i = 0; i < items.length; i++) {
				items[i].li.classList.toggle('is-active', items[i].li === li);
			}
		}

		var io = new IntersectionObserver(
			function (entries) {
				var visible = entries
					.filter(function (e) {
						return e.isIntersecting;
					})
					.sort(function (a, b) {
						return a.boundingClientRect.top - b.boundingClientRect.top;
					});
				if (visible.length) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].heading === visible[0].target) return setActive(items[i].li);
					}
					return;
				}
				// ничего не в «активной полосе» — активен последний заголовок выше неё
				var above = items.filter(function (it) {
					return it.heading.getBoundingClientRect().top < 120;
				});
				if (above.length) setActive(above[above.length - 1].li);
			},
			{ rootMargin: '-90px 0px -70% 0px', threshold: 0 }
		);
		for (var k = 0; k < items.length; k++) io.observe(items[k].heading);
	}

	/* ── 5. count-up на честных цифрах ───────────────────────────────────────
	   Скрипт не знает никаких чисел заранее: берёт готовый текст узла (разметка — единственный
	   источник правды), прокручивает от нуля только числовые куски и в конце возвращает
	   ИСХОДНУЮ строку целиком, чтобы итог совпал с разметкой символ в символ даже при
	   прерванной анимации. При prefers-reduced-motion текст не трогается вообще. */
	function countUp() {
		if (reduce) return;
		var nodes = document.querySelectorAll('[data-countup]');
		if (!nodes.length) return;

		// Исходную строку снимаем ДО обнуления и держим отдельно: иначе «оригиналом»
		// окажется уже обнулённый текст и цифра никогда не вернётся к своему значению.
		var originals = new Map();

		var io = new IntersectionObserver(
			function (entries) {
				for (var i = 0; i < entries.length; i++) {
					if (!entries[i].isIntersecting) continue;
					run(entries[i].target);
					io.unobserve(entries[i].target);
				}
			},
			{ threshold: 0.4 }
		);

		function run(node) {
			var original = originals.get(node) || '';
			var parts = original.split(/(\d+)/);
			var duration = 900;
			var start = performance.now();
			function render(t) {
				var out = '';
				for (var i = 0; i < parts.length; i++) {
					out += /^\d+$/.test(parts[i]) ? String(Math.round(Number(parts[i]) * t)) : parts[i];
				}
				node.textContent = out;
			}
			function tick(now) {
				var t = Math.min(1, Math.max(0, (now - start) / duration));
				render(1 - (1 - t) * (1 - t)); // easeOutQuad
				if (t < 1) requestAnimationFrame(tick);
				else node.textContent = original;
			}
			requestAnimationFrame(tick);
		}

		for (var n = 0; n < nodes.length; n++) {
			originals.set(nodes[n], nodes[n].textContent || '');
			nodes[n].textContent = (nodes[n].textContent || '').replace(/\d+/g, '0');
			io.observe(nodes[n]);
		}

		// Тот же предохранитель, что у scroll-reveal: в фоновой вкладке IntersectionObserver
		// может не сработать вовремя, и цифра осталась бы нулём — а это уже не потерянная
		// анимация, а неверное число на экране. Через 2,5 с всё, что не анимировалось,
		// возвращается к исходной строке.
		setTimeout(function () {
			originals.forEach(function (original, node) {
				if (node.textContent !== original && !/[1-9]/.test(node.textContent)) node.textContent = original;
			});
		}, 2500);
	}

	reveal();
	escapeClosesMenu();
	readingProgress();
	tocSpy();
	countUp();
})();
