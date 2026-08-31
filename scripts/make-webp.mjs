// Генерация WebP-двойников для растровых изображений сайта.
//
// Зачем: критерий рубрикатора img-modern-formats. Оригинал НЕ удаляется — он остаётся
// фоллбэком в <img> внутри <picture> и в background-image до image-set(), поэтому браузер
// без поддержки WebP ничего не теряет.
//
// Правило, ради которого скрипт вообще нужен, а не «конвертировать всё подряд»: если WebP
// получился НЕ меньше оригинала (так бывает на схемах, скриншотах и уже пережатых JPEG),
// файл удаляется и разметка остаётся с одним оригиналом. Плодить лишний байт ради галочки
// в линтере смысла нет.
//
// Запуск: node scripts/make-webp.mjs
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = 'static/images';
const RASTER = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) out.push(...walk(p));
		else if (RASTER.has(extname(name).toLowerCase())) out.push(p);
	}
	return out;
}

if (!existsSync(ROOT)) {
	console.log(`${ROOT} не существует — нечего конвертировать`);
	process.exit(0);
}

for (const src of walk(ROOT)) {
	const out = src.replace(/\.(jpe?g|png)$/i, '.webp');
	// quality 78 — тот же уровень, на котором пережаты исходные JPEG (scripts/optimize-park-images.mjs),
	// чтобы сравнение размеров было честным, а не «WebP выиграл, потому что качество ниже».
	await sharp(src).webp({ quality: 78, effort: 6 }).toFile(out);
	const before = statSync(src).size;
	const after = statSync(out).size;
	if (after >= before) {
		unlinkSync(out);
		console.log(`${src}: WebP ${(after / 1024).toFixed(0)} КБ ≥ оригинала ${(before / 1024).toFixed(0)} КБ — удалён, остаётся оригинал`);
	} else {
		console.log(`${src}: ${(before / 1024).toFixed(0)} КБ -> ${(after / 1024).toFixed(0)} КБ WebP (−${(100 - (after / before) * 100).toFixed(0)}%)`);
	}
}
