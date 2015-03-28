# browser-keyboard
Virtual keyboard extensoin for Firefox and Chrome

Расширение виртуальная клавитура для Firefox и Chrome

[View Demo | Посмотреть демо](http://browser-keyboard.github.io/demo/index.html)


# Features 

* convert physical key press to extensoin layout symbols
* type text by on-screen keyboard
* choose diferent languages behind system settings
* hide/show on-screen keyboard however extension will continue to covert physical key press
* turn on/off auto keyboard capturing
* language list is downloaded from server on resetting enxention languages by AJAX
* lowercase, uppercase, additional lowercase and additional uppercase symbols sets
* popum menu: 
1. switching on/off virtual keyboard
2. hide/show on-screen keyboard
3. change current language
* hot keys:

1. ctrl+k — switching on/off virtual keyboard
2. shift
3. caps lock
4. ctrl + alt — shift-like switch symbols set to additional letters
5. ctrl + alt + space — caps-like switch symbols set to additional letters
6. shift + space — change language layout to next

* also able to combinate hot keys, ex: shift + ctrl + alt — switch symbols set to additional uppercase letters

1. functional buttons on on-screen keyboard:
2. close — turn off virtual keyboard
3. minimize — hide on-screen keyboard
4. shift
5. caps lock
6. addit — shift-like switch symbols set to additional letters
7. additLong — caps-like switch symbols set to additional letters
8. space
9. backspace
10. delete
11. enter
12. next language

* on-screen keyboard is dragable

# Возможности
* перехват нажатий на физические клавиши и печать соответствуешего символа
* печать текста с помощью на экраной клавиатуры
* выбор разных языков вне зависимости от системных настроек
* скрытие/"позание" наэкранной клавиатуры, при этом перехват клавиш будет продолжать работать
* отключение/включение перехвата клавиш
* при перенастройки раскладки, список языков скачивается из сервера через AJAX
* прописные, строчные, дополнительные прописные и дополнительные строчные наборы символов
* меню на строке браузера: 

1. вкл/выкл виртуальной клавиаты
2. вкл/выкл наэкранной клавиатуры
3. изменить текуший язык

* горячие клавиши:

1. ctrl+k — — - вкл/выкл виртуальной клавиаты
2. shift
3. caps lock
4. ctrl + alt — shift-подобное переключение на дополнительные символы
5. ctrl + alt + пробел — caps-подобное переключение на дополнительные символы
6. shift + пробел — переключить язык на следующий

* также возможна комбинация горячих клашив, пример: shift + ctrl + alt — переключение на дополнительные прописные символы

1. функциональные клавиши на наэкранной клавиатуре:
2. close — отключить виртуальную клавиатуру
3. minimize — скрыть наэкранную клавитуру
4. shift
5. caps lock
6. addit — shift-подобное переключение на дополнительные символы
7. additLong — caps-подобное переключение на дополнительные символы
8. пробел
9. backspace
10. delete
11. enter
12. следующий язык

* наэкранная клавиатура перетаскиваемая

# Firefox extinsion will ba able only after Firefox 38 release
event.keyCode is not work correctly with some keys. So some keys pressing can't be identificated. 
event.code, which is event.keyCode alternative, is realeasing on Firefox 38 on 15 May

# Расширение для Firefox будет только после релиза Firefox 38
event.keyCode не работает правильно с некотырыми клавишами. Поэтому эти клавиши не мог быть распознаны.
Альтернатива event.keyCode event.code выйдет на Firefox 38 15-го мая


# Current Problems. Needs Help
In Firefox at wrinting mail on gmail.com physical key press can't be detected

# Текущие проблемы. Требуется помошь
В Firefox`е при написании письма на gmail.com нажатия физических клавиш не определяются.

# TODO
1) Chrome and Firefox:

* make able to turn on/off keyboard capturing
* make able to set on-screen keyboard showing only on active text field
* make able to configure languages. [Option page preview](http://browser-keyboard.github.io/languages/index.html)

2) add languages

3) redesign 

4) start beta-test

5) make localization for English, Russian, Bashkir and else languages if somebody ask

6) debug

7) convert Chrome extinsion to Opera and Yandex Browser


# Список задач
1) Chrome and Firefox:

* сделать возможным вкл/выкл перехвата нажатий физических клавиш
* сделать возможным опция появление на-экранной клавиатуры только при акивном текстовом поле
* сделать возможным настраивать языки. [Превью страницы настроек](http://browser-keyboard.github.io/languages/index.html)

2) добавить языки

3) редизайн

4) начать бета-тест

5) сделать локализации на английский, русский, башкирский и другии языки, если кто-нибудь попросит

6) дебаг

7) конвертировать расширение для Chrome на Opera и Яндекс Браузер
