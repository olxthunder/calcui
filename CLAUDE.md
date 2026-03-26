# CalcUI — Claude Instructions

## Про проєкт
Калькулятор з підтримкою Light/Dark теми. Чистий HTML + CSS + JS без фреймворків.

## Структура файлів
```
calcui/
├── index.html          # головний файл
├── tokens.css          # design tokens (НЕ редагувати вручну — генерується з Figma)
├── components/
│   ├── button.css      # стилі кнопок
│   ├── display.css     # стилі дисплею
│   └── header.css      # стилі хедера
├── calculator.js       # логіка калькулятора
└── CLAUDE.md           # цей файл
```

## Design Tokens — завжди використовуй тільки ці змінні

### Кольори (з tokens.css)
```css
/* Backgrounds */
--color-bg-primary        /* основний фон */
--color-bg-secondary      /* вторинний фон (display) */
--color-bg-elevated       /* піднятий фон */
--color-bg-overlay        /* бордери */

/* Content */
--color-content-primary   /* основний текст */
--color-content-secondary /* вторинний текст */
--color-content-tertiary  /* третинний текст */
--color-content-inverse   /* інверсний текст */

/* Accent (зелений) */
--color-accent-default    /* основний акцент */
--color-accent-hover      /* акцент ховер */
--color-accent-pressed    /* акцент натиснутий */
--color-accent-subtle     /* легкий акцент (фон operator) */
--color-accent-text       /* текст на акценті */

/* Buttons */
--color-button-number-default
--color-button-number-hover
--color-button-number-pressed
--color-button-operator-default
--color-button-operator-hover
--color-button-operator-pressed
--color-button-operator-active
--color-button-utility-default
--color-button-utility-hover
--color-button-utility-pressed
--color-button-theme-default
--color-button-theme-hover
```

### Spacing
```css
--spacing-2   /* 8px */
--spacing-3   /* 12px — border-radius кнопок */
--spacing-4   /* 16px — gap між кнопками */
--spacing-5   /* 20px — border-radius калькулятора і display */
--spacing-6   /* 24px — padding калькулятора */
--spacing-8   /* 32px — padding display */
```

## Компоненти — правила

### Button
- Розмір: 68×68px (крім btn-zero: 144×68px)
- Border-radius: var(--spacing-3)
- Font: Inter, 20px, Regular
- 4 типи: Number, Operator, Equals, Utility
- 3 стани: Default, Hover, Pressed (+ Active для Operator)
- **Ніколи не хардкодити кольори** — тільки CSS змінні

### Display
- Background: var(--color-bg-secondary)
- Border: 1px solid var(--color-bg-overlay)
- Border-radius: var(--spacing-5)
- Expression: 32px, Light, color-content-secondary
- Result: 64px, Light, color-content-primary

### Кнопки калькулятора (Button Grid)
```
btn-clear      AC    — Utility
btn-backspace  ⌫    — Utility  
btn-percent    %     — Utility
btn-divide     ÷     — Operator
btn-7          7     — Number
btn-8          8     — Number
btn-9          9     — Number
btn-multiply   ×     — Operator
btn-4          4     — Number
btn-5          5     — Number
btn-6          6     — Number
btn-subtract   -     — Operator
btn-1          1     — Number
btn-2          2     — Number
btn-3          3     — Number
btn-add        +     — Operator
btn-zero       0     — Number (ширина 144px, colspan 2)
btn-dot        .     — Number
btn-equals     =     — Equals
```

## Правила для Claude

1. **Ніколи не використовуй inline стилі** — тільки CSS класи і змінні
2. **Ніколи не хардкодити кольори** — тільки var(--color-*)
3. **Не створюй новий компонент** якщо схожий вже існує в components/
4. **При отриманні Figma посилання** — спочатку прочитай поточний стан файлів у репо
5. **Dark mode** реалізується через `[data-theme="dark"]` на `<html>` елементі
6. **JS логіка** — тільки в calculator.js, не в HTML

## Коли отримуєш задачу від дизайнера

1. Прочитай Figma через MCP (get_design_context)
2. Звір з поточним кодом — що змінилось?
3. Онови тільки те що змінилось
4. Перевір що Dark тема також працює
5. Перевір що кнопки мають правильні hover/pressed стани

## Figma файл
https://www.figma.com/design/LsAH0qI7d9frxlgYeEPp5X/CalcUI-x-Claude
