# Решения тестовых заданий

## Обзор

Этот репозиторий содержит решения задач:

1. Сортировка жидкостей на Node.js (Typescript)
2. Файлообменный сервис на Node.js (Typescript)
3. Сервис прогноза погоды на Java (Maven)

## Системные требования

- **Node.js** (для заданий 1 и 2)
- **Java JDK** (для задания 3)
- **npm** (поставляется с Node.js)
- **Maven** (для задания 3)
- **Docker** (для редиса если не скачан на компьютере)

## Задание 1: Головоломка "Сортировка жидкостей"

### Структура проекта

```
exercice1-sorting/
├── src/
│   ├── main.ts
│   ├── solver.ts
│   └── visualizator.ts
├── view/
│   └── visual.html
└── package.json
```

### Запуск

1. Перейдите в директорию задачи:

```bash
cd exercice1-sorting
```

2. Установите зависимости:

```bash
npm i
```

3. Build:

```bash
npm run build
```

4. Запустите решение:

```bash
npm run start
```

### Как работает

Появится меню:

```bash
Actions:
1. Enter custom input
2. Try example
>
```

Если выбирать 1:

```
Actions:
1. Enter custom input
2. Try example
> 1
How many tubes? 5
Tube capacity? 4
Tube 1. Enter the colors by symbol (number or string), separated by space. For example '1 2 3'
      > 1 2 3
Tube 2. Enter the colors by symbol (number or string), separated by space. For example '1 2 3'
      >
```

Если выбирать 2, то сразу алгоритм начинает. Результат в таком формате:

```
Moves: 49
Solution: [
  [ 1, 12 ], [ 1, 13 ],  [ 1, 12 ], [ 7, 1 ],
  [ 10, 7 ], [ 2, 10 ],  [ 3, 2 ],  [ 5, 3 ],
  [ 5, 1 ],  [ 13, 5 ],  [ 7, 13 ], [ 11, 1 ],
  [ 11, 5 ], [ 11, 13 ], [ 2, 11 ], [ 2, 11 ],
  [ 4, 2 ],  [ 4, 12 ],  [ 6, 4 ],  [ 6, 12 ],
  [ 6, 2 ],  [ 0, 6 ],   [ 0, 6 ],  [ 7, 13 ],
  [ 7, 4 ],  [ 0, 7 ],   [ 3, 0 ],  [ 3, 0 ],
  [ 3, 13 ], [ 3, 11 ],  [ 4, 3 ],  [ 4, 3 ],
  [ 9, 3 ],  [ 4, 3 ],   [ 9, 4 ],  [ 9, 0 ],
  [ 9, 4 ],  [ 10, 9 ],  [ 10, 9 ], [ 10, 4 ],
  [ 10, 6 ], [ 2, 10 ],  [ 8, 9 ],  [ 8, 9 ],
  [ 2, 10 ], [ 8, 10 ],  [ 2, 10 ], [ 8, 7 ],
  [ 2, 7 ]
]
```

И предлагается визуализация:

```
Visualize (YES/no)?
```

Если согласится, сервер запускается и можно по ссылку перейти:

http://127.0.0.1:3000/

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-start.png "alt text")

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-during.png "alt text")

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-end.png "alt text")

## Задание 2: Файлообменный сервис

### Структура проекта

```
exercice2-files/
├── src/
│   ├── Controllers/
│   │   ├── Controller.ts
│   │   ├── DashboardController.ts
│   │   ├── FileController.ts
│   │   ├── LoginController.ts
│   │   └── UploadController.ts
│   ├── Services/
│   │   └── DataServices.ts
│   ├── Auth.ts
│   ├── cron.ts
│   ├── main.ts
│   └── Server.ts
...
```

### Запуск

1. Перейдите в директорию задачи:

```bash
cd exercice2-files
```

2. Установите зависимости:

```bash
npm i
```

3. Build:

```bash
npm run build
```

4. Запустите решение:

```bash
npm run start
```

5. PS: "автоматическое удаление устаревших файлов (устаревшими файлами считать те, которые не скачивали в течение определенного срока, например, 30 дней)" через CRON, скрипт запускается таким образом:

```bash
npm run cron
```

### Как работает

Запускается сервер: http://127.0.0.1:4000

Страница будет такая:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-login.png "alt text")

Тут поставить:

EMAIL: `admin@admin.com`\
PASSWORD: `admin`

Открывается дашборд:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-dash1.png "alt text")

Нажимаем на "Upload file" и переходим в эту страницу:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-upload.png "alt text")

Добавляем файл:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-upload-end.png "alt text")

И автоматически переходим в дашборд где наш файл теперь отображается:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-dash2.png "alt text")

Ссылка доступна по кнопке:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-link.png "alt text")

Если нажать, автоматически копируется:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe2-link2.png "alt text")

## Задание 3: Сервис прогноза погоды

### Структура проекта

```
exercice3-weather/
├── src/
│   └── main/
│       ├── java/com/mestre/weather/
│       │   ├── Controller/
│       │   │   ├── ApiController.java
│       │   │   └── WebController.java
│       │   ├── Helpers/
│       │   │   └── CityWeatherHelper.java
│       │   ├── Models/
│       │   │   ├── HourlyData.java
│       │   │   ├── HourlyForecast.java
│       │   │   └── Location.java
│       │   ├── Services/
│       │   │   ├── GeocodingService.java
│       │   │   └── OpenMeteoService.java
│       │   ├── App.java
│       │   ├── Router.java
│       │   └── Server.java
│       └── resources/index.html
├── docker-compose.yml # Redis
└── pom.xml
```

### Запуск

1. Перейдите в директорию задачи:

```bash
cd exercice3-weather
```

2. Запускаем docker если Redis не установлен на компе:

```bash
docker compose up -d
```

3. Запускаем проект:

```bash
mvn clean compile exec:java
```

### Как работает

Запускается сервер: http://127.0.0.1:8000

Страница будет такая:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe3-home.png "alt text")

Можно указать город:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe3-meteo.png "alt text")

Или через апи:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe3-api.png "alt text")

Все сохраняется в redis:

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe3-redis.png "alt text")
