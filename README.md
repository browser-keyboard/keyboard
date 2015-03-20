# browser-keyboard
Virtual keyboard extensoin for Firefox and Chrome

Расширение виртуальная клавитура для Firefox и Chrome

# View Demo | Посмотреть демо


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

1. ctrl+k - - - switching on/off virtual keyboard
2. shift
3. caps lock
4. ctrl + alt - - - shift-like switch symbols set to additional letters
5. ctrl + alt + space - - - caps-like switch symbols set to additional letters
6. shift + space - - - change language layout to next

* also able to combinate hot keys, ex: shift + ctrl + alt - - - switch symbols set to additional uppercase letters

1. functional buttons on on-screen keyboard:
2. close - - - turn off virtual keyboard
3. minimize - - - hide on-screen keyboard
4. shift
5. caps lock
6. addit - - - shift-like switch symbols set to additional letters
7. additLong - - - caps-like switch symbols set to additional letters
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

1. ctrl+k - - - - - - - вкл/выкл виртуальной клавиаты
2. shift
3. caps lock
4. ctrl + alt - - - shift-подобное переключение на дополнительные символы
5. ctrl + alt + пробел - - - caps-подобное переключение на дополнительные символы
6. shift + пробел - - - переключить язык на следующий

* также возможна комбинация горячих клашив, пример: shift + ctrl + alt - - - переключение на дополнительные прописные символы

1. функциональные клавиши на наэкранной клавиатуре:
2. close - - - отключить виртуальную клавиатуру
3. minimize - - - скрыть наэкранную клавитуру
4. shift
5. caps lock
6. addit - - - shift-подобное переключение на дополнительные символы
7. additLong - - - caps-подобное переключение на дополнительные символы
8. пробел
9. backspace
10. delete
11. enter
12. следующий язык

* наэкранная клавиатура перетаскиваемая

# Current Problems. Needs Help
After Firefox updates event.keyCode is not supperted any more. So some keys pressing can't be identificated. I have [discribed](https://forums.mozilla.org/viewtopic.php?f=27&t=23447) this promlem of firefox forum

In Firefox at wrinting mail on gmail.com physical key press can't be detected

# Текущие проблемы. Требуется помошь.
После обновлений Firefox'а свойство event.keyCode больше не работает с некотырыми клавишами. Я [описал](https://forums.mozilla.org/viewtopic.php?f=27&t=23447) эту проблему на английском на форуме Firefox. Свойство event.keyCode возвращает код нажатой клавиши. Например: если ввести 'q', то свойство возвращает 81 и если ввести 'й', то опять будет 81, что мне и надо. Но если ввести '[', то свойство возрватит 219, а если ввести русскую 'х', то будет возвращано 0.

В Firefox`е при написании письлма на gmail.com нажатия физических клавиш не определяются.

# TODO
1. Chrome:

* add pupup menu
* saving keyboard setting: current language, is showed on-screen keyboard, is turned

2. Chrome and Firefox:

* make able to turn on/off keyboard capturing
* make able to configure languages. Option page preview

3. Redesign 
4. Start beta-test
5. Make localization for English, Russian, Bashkir and else languages if somebody ask
6. Convert Chrome extinsion to Opera and Yandex Browser


# Список задачь
1. Chrome:

* добавить меню на строке браузера
* сохрание настроек клавиатуры: текущий язык, показана ли наэкранная клавиатура, включена ли клавиатура

2. Chrome and Firefox:

* сделать возможным вкл/выкл перехвата нажатий физических клавиш
* сделать возможным настраивать языки. Превью страницы настроек

3. Редизайн
4. Начать бета-тест
5. Сделать локализации на английский, русский, башкирский и другии языки, если кто-нибудь попросит
6. Конфертировать расширение для Chrome на Opera и Яндекс Браузер
