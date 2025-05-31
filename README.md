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

И предлагается визуализацию:

```
Visualize (YES/no)?
```

Если согласится, сервер запускается и можно по ссылку перейти:

http://127.0.0.1:3000/

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-start.png "alt text")

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-during.png "alt text")

![alt text](https://github.com/mestrey/doczilla-exercice/raw/main/imgs/exe1-end.png "alt text")
