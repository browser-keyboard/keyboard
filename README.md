# browser-keyboard
Virtual keyboard extensoin for browsers

Расширение виртуальная клавитура для браузеров

# Features 
* convert physical key press to extensoin layout symbols
* type text by on-screen keyboard
* choose diferent languages behind system settings
* hide/show on-screen keyboard however extension will continue to covert physical key press
* turn on/off auto keyboard capturing
* language list is downloaded from server on resetting enxention languages by AJAX
* lowercase, uppercase, additional lowercase and additional uppercase symbols sets
* popum menu
* hot keys
* also able to combinate hot keys, ex: shift + ctrl + alt — switch symbols set to additional uppercase letters
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
* горячие клавиши:
* также возможна комбинация горячих клашив, пример: shift + ctrl + alt — переключение на дополнительные прописные символы* наэкранная клавиатура перетаскиваемая

# Developing Status
Extensions for Chrome and Opera are ready. Porting to Firefox is going now. Port to Safari will be.

Extension is not work on some sites:  mail.google.com, keep.google.com, mail.yahoo.com. Issues are becouse of scripts of this sites now allow to extension handle key pressing. My scills not well to fix this bug so I leave everything as it is until somebody help with it or new browsers API come.

I will glad to get tips about keyboard archeture.

# Статус разработки
Расширение не работает на некоторых сайтах: mail.google.com, keep.google.com, mail.yahoo.com. Ошибки в работе происходят, потому что скрипты этих сайтов не дают расширению обработать события нажатий на клавиши. Так как моих навыков недосточно для исправления этих багов, я оставляю все как есть, до тех времен пока не появятся люди готовые помочь или новые API браузеров.

Также я буду рад получить советы по архетиктуре клавиатуры (но вряд ли я изменю ее).
