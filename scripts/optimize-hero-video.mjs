// Волна 128: сжатие скачанного оригинала фонового видео hero до веб-разумного размера
// + извлечение постера. Устроено как остальные ассет-скрипты этого проекта (массив jobs,
// до/после в консоли), но для видео вместо sharp используется ffmpeg-static — единственный портируемый
// способ дать H.264-кодек без системной зависимости от ffmpeg на машине разработчика.
//
// ВАЖНО: исходник — НЕ в static/. Раздавать посетителям сырой файл 89 МБ с оригинальным
// разрешением незачем (используется только как вход в сжатие), а на выходе в static/
// попадает ровно одна оптимизированная и ОБРЕЗАННАЯ версия. static/, а НЕ public/ — этот
// сайт на SvelteKit (adapter-static), и без переопределения kit.files.assets в
// svelte.config (его в проекте нет — дефолт) корневой раздачей служит именно static/;
// проверено: уже опубликованный static/images/park/park-hero.jpg отвечает по /images/
// park/park-hero.jpg, а каталог public/ в этом проекте вообще не существовал до этого
// файла и билдом не подхватывается.
// Источник (автор/лицензия/ссылка) см. content-plan.md, «Волна 128».
import { execFileSync } from 'node:child_process';
import { statSync, mkdirSync, existsSync } from 'node:fs';
import ffmpegPath from 'ffmpeg-static';

const jobs = [
  {
    src: 'scripts/source-assets/hero-refinery-original.mp4',
    outVideo: 'static/videos/hero-refinery.mp4',
    outPoster: 'static/images/hero/hero-refinery-poster.jpg',
    // Оригинал — 55,27с непрерывный облёт дроном ночного НПЗ (не статичный план, поэтому
    // идеального бесшовного цикла не бывает ни на каком отрезке — тот же компромисс, что
    // и у любого другого облёта). Окно 00:00:06–00:00:19 (13с, входит в требуемые 8–20с) —
    // визуально самый насыщенный по светy участок при проверке кадров 02/08/14/20/28/36/44/50с,
    // без явного скачка яркости на границе среза.
    start: '00:00:06',
    duration: '13',
    // Не выше 1280px по широкой стороне (ТЗ) — исходник 2560×1440, масштаб всегда вниз;
    // -2 у высоты — чётность обязательна для libx264.
    width: 1280,
    // Кадр постера берётся НЕ с нулевой секунды обрезанного клипа, а с середины окна —
    // постер берётся из уже сжатого и обрезанного файла, а не с сырого оригинала, чтобы
    // совпасть по цветокоррекции с тем, что реально увидит посетитель.
    posterAt: '00:00:04',
  },
];

for (const job of jobs) {
  if (!existsSync(job.src)) {
    console.error(`Пропуск: исходник не найден — ${job.src}. Скачайте оригинал в scripts/source-assets/ перед запуском.`);
    continue;
  }
  mkdirSync('static/videos', { recursive: true });
  mkdirSync('static/images/hero', { recursive: true });

  const before = statSync(job.src).size;

  // H.264 mp4, без звука (-an — ТЗ прямо требует беззвучный луп), обрезка до окна
  // start..start+duration (-ss перед -i — быстрый seek по ключевым кадрам), масштаб до
  // job.width по ширине с сохранением пропорций (-2 округляет высоту до чётного числа),
  // CRF 30 (выше обычных 28 — у этого исходника высокая детализация
  // множества мелких огней НПЗ, компенсируется чуть более сильным сжатием ради лимита
  // 2–3 МБ) + faststart (moov-атом в начале файла — воспроизведение стартует до полной
  // загрузки, важно при autoplay в браузере).
  execFileSync(ffmpegPath, [
    '-y',
    '-ss', job.start,
    '-i', job.src,
    '-t', job.duration,
    '-an',
    '-vf', `scale=${job.width}:-2:flags=lanczos`,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '30',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    job.outVideo,
  ], { stdio: 'inherit' });

  // Постер — кадр из УЖЕ сжатого и обрезанного файла (тот же размер/цветокоррекция,
  // что и видео, а не случайно другое разрешение оригинала).
  execFileSync(ffmpegPath, [
    '-y',
    '-ss', job.posterAt,
    '-i', job.outVideo,
    '-frames:v', '1',
    '-q:v', '3',
    job.outPoster,
  ], { stdio: 'inherit' });

  const afterVideo = statSync(job.outVideo).size;
  const afterPoster = statSync(job.outPoster).size;
  console.log(
    `${job.src}: ${(before / 1024 / 1024).toFixed(2)} MB -> ${job.outVideo}: ${(afterVideo / 1024 / 1024).toFixed(2)} MB` +
    ` | постер ${job.outPoster}: ${(afterPoster / 1024).toFixed(0)} KB`
  );
  if (afterVideo > 3 * 1024 * 1024) {
    console.warn(`ВНИМАНИЕ: ${job.outVideo} тяжелее 3 МБ (цель ТЗ — 2–3 МБ). Поднимите CRF (например 32–34) и перезапустите.`);
  }
}
