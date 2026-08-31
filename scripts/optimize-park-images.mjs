// Волна 109: ресайз/сжатие скачанных исходников Wikimedia/Pexels до веб-разумных
// размеров (sharp, mozjpeg q78, ширина 1280/1920).
//
// Итог поиска волны 109: 0 из 3 моделей парка (Ивановец КС-6476, Клинцы КС-35719-7-02,
// XCMG QUY150) — реальное свободно лицензированное фото на Wikimedia Commons не найдено
// (индивидуальная проверка каждой модели — allcategories/categorymembers/search, кириллица
// и латиница, см. content-plan.md раздел «Волна 109»). Единственный обработанный файл —
// атмосферное фото для хаба /park/.
import sharp from 'sharp';
import { statSync, renameSync } from 'node:fs';

// ВАЖНО: src===out — скрипт сжимает файл, который уже лежит в static/. Повторный запуск на
// уже обработанном файле означает повторное JPEG-сжатие (генерационные потери) без пользы.
// Задания закомментированы сразу после того, как отработали один раз.
const jobs = [
	// Волна 109 — уже обработано, не перезапускать без свежего оригинала:
	// { src: 'static/images/park/park-hero.jpg', out: 'static/images/park/park-hero.jpg', width: 1920 },
];

for (const job of jobs) {
	const before = statSync(job.src).size;
	const buf = await sharp(job.src).rotate().resize({ width: job.width, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
	await sharp(buf).toFile(job.out + '.tmp');
	renameSync(job.out + '.tmp', job.out);
	const after = statSync(job.out).size;
	console.log(`${job.src}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}
